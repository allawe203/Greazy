import express from "express";
import serverless from "serverless-http";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

const app = express();
app.use(express.json());

const EXPECTED_PASSWORD = "greazy@online_02365149875298";

const supabaseUrl = "https://umyrutkzbunvqeumrqwi.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "public" },
    })
  : null;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function transformToCamelCase(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(transformToCamelCase);
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    result[camelKey] = obj[key];
  }
  return result;
}

function getDb() {
  if (!supabase) throw new Error("Supabase not configured. Set SUPABASE_SERVICE_ROLE_KEY environment variable.");
  return supabase;
}

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password is required" });
    if (password === EXPECTED_PASSWORD) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = Date.now() + 24 * 60 * 60 * 1000;
      res.json({ success: true, token, expiry });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch {
    res.status(500).json({ error: "Authentication failed" });
  }
});

// File upload
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const db = getDb();
    const folder = req.body.folder || "uploads";
    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await db.storage
      .from("images")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });
    if (uploadError) return res.status(500).json({ error: uploadError.message });
    const {
      data: { publicUrl },
    } = db.storage.from("images").getPublicUrl(fileName);
    res.json({ url: publicUrl });
  } catch {
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// ==================== CATEGORIES ====================

app.get("/api/categories", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("categories")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    res.json((data || []).map(transformToCamelCase));
  } catch (err: any) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/categories/:id", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("categories")
      .select("*")
      .eq("id", parseInt(req.params.id))
      .single();
    if (error || !data) return res.status(404).json({ error: "Category not found" });
    res.json(transformToCamelCase(data));
  } catch {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("categories")
      .insert({
        name: req.body.name,
        image_url: req.body.imageUrl || req.body.image_url || null,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(transformToCamelCase(data));
  } catch (err: any) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.patch("/api/categories/:id", async (req, res) => {
  try {
    const db = getDb();
    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.imageUrl !== undefined) updateData.image_url = req.body.imageUrl;
    if (req.body.image_url !== undefined) updateData.image_url = req.body.image_url;
    const { data, error } = await db
      .from("categories")
      .update(updateData)
      .eq("id", parseInt(req.params.id))
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: "Category not found" });
    res.json(transformToCamelCase(data));
  } catch (err: any) {
    console.error("Update category error:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const db = getDb();
    await db.from("menu_items").delete().eq("category_id", parseInt(req.params.id));
    const { error } = await db
      .from("categories")
      .delete()
      .eq("id", parseInt(req.params.id));
    if (error) throw error;
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ==================== MENU ITEMS ====================

app.get("/api/menu-items", async (req, res) => {
  try {
    const db = getDb();
    let query = db.from("menu_items").select("*").order("id", { ascending: true });
    if (req.query.category_id)
      query = query.eq("category_id", parseInt(req.query.category_id as string));
    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(transformToCamelCase));
  } catch (err: any) {
    console.error("Fetch menu items error:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

app.get("/api/menu-items/:id", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("menu_items")
      .select("*")
      .eq("id", parseInt(req.params.id))
      .single();
    if (error || !data) return res.status(404).json({ error: "Menu item not found" });
    res.json(transformToCamelCase(data));
  } catch {
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
});

app.post("/api/menu-items", async (req, res) => {
  try {
    const db = getDb();
    let price = req.body.price;
    if (typeof price === "number") price = price.toString();
    const { data, error } = await db
      .from("menu_items")
      .insert({
        name: req.body.name,
        description: req.body.description || null,
        price: price,
        image_url: req.body.imageUrl || req.body.image_url || null,
        category_id: req.body.categoryId || req.body.category_id || null,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(transformToCamelCase(data));
  } catch (err: any) {
    console.error("Create menu item error:", err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

app.patch("/api/menu-items/:id", async (req, res) => {
  try {
    const db = getDb();
    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) {
      updateData.price = typeof req.body.price === "number" ? req.body.price.toString() : req.body.price;
    }
    if (req.body.imageUrl !== undefined) updateData.image_url = req.body.imageUrl;
    if (req.body.image_url !== undefined) updateData.image_url = req.body.image_url;
    if (req.body.categoryId !== undefined) updateData.category_id = req.body.categoryId;
    if (req.body.category_id !== undefined) updateData.category_id = req.body.category_id;

    const { data, error } = await db
      .from("menu_items")
      .update(updateData)
      .eq("id", parseInt(req.params.id))
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: "Menu item not found" });
    res.json(transformToCamelCase(data));
  } catch (err: any) {
    console.error("Update menu item error:", err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

app.delete("/api/menu-items/:id", async (req, res) => {
  try {
    const db = getDb();
    const { error } = await db
      .from("menu_items")
      .delete()
      .eq("id", parseInt(req.params.id));
    if (error) throw error;
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// ==================== CONTACT INFO ====================

app.get("/api/contact", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("contact_info")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .single();
    if (error || !data) return res.json(null);
    res.json(transformToCamelCase(data));
  } catch {
    res.json(null);
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const db = getDb();
    const body = req.body;
    const contactData: any = {
      phone: body.phone || null,
      email: body.email || null,
      address: body.address || null,
      opening_hours: body.openingHours || body.opening_hours || null,
      whatsapp: body.whatsapp || null,
      instagram_url: body.instagramUrl || body.instagram_url || null,
      facebook_url: body.facebookUrl || body.facebook_url || null,
      tiktok_url: body.tiktokUrl || body.tiktok_url || null,
      snapchat_url: body.snapchatUrl || body.snapchat_url || null,
    };

    const googleMapsUrl = body.googleMapsUrl || body.google_maps_url || null;

    const { data: existing } = await db
      .from("contact_info")
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    let result;
    if (existing) {
      const dataWithMaps = { ...contactData, google_maps_url: googleMapsUrl };
      let { data, error } = await db
        .from("contact_info")
        .update(dataWithMaps)
        .eq("id", existing.id)
        .select()
        .single();
      if (error && error.message && error.message.includes("google_maps_url")) {
        const retryResult = await db
          .from("contact_info")
          .update(contactData)
          .eq("id", existing.id)
          .select()
          .single();
        if (retryResult.error) throw retryResult.error;
        data = retryResult.data;
      } else if (error) {
        throw error;
      }
      result = data;
    } else {
      const dataWithMaps = { ...contactData, google_maps_url: googleMapsUrl };
      let { data, error } = await db
        .from("contact_info")
        .insert(dataWithMaps)
        .select()
        .single();
      if (error && error.message && error.message.includes("google_maps_url")) {
        const retryResult = await db
          .from("contact_info")
          .insert(contactData)
          .select()
          .single();
        if (retryResult.error) throw retryResult.error;
        data = retryResult.data;
      } else if (error) {
        throw error;
      }
      result = data;
    }
    if (result) {
      result.google_maps_url = result.google_maps_url || googleMapsUrl;
    }
    res.json(transformToCamelCase(result));
  } catch (err: any) {
    console.error("Contact info update error:", err);
    res.status(500).json({ error: "Failed to update contact info" });
  }
});

app.put("/api/contact", async (req, res) => {
  try {
    const db = getDb();
    const body = req.body;
    const contactData: any = {
      phone: body.phone || null,
      email: body.email || null,
      address: body.address || null,
      opening_hours: body.openingHours || body.opening_hours || null,
      whatsapp: body.whatsapp || null,
      instagram_url: body.instagramUrl || body.instagram_url || null,
      facebook_url: body.facebookUrl || body.facebook_url || null,
      tiktok_url: body.tiktokUrl || body.tiktok_url || null,
      snapchat_url: body.snapchatUrl || body.snapchat_url || null,
    };

    const googleMapsUrl = body.googleMapsUrl || body.google_maps_url || null;

    const { data: existing } = await db
      .from("contact_info")
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    let result;
    if (existing) {
      const dataWithMaps = { ...contactData, google_maps_url: googleMapsUrl };
      let { data, error } = await db
        .from("contact_info")
        .update(dataWithMaps)
        .eq("id", existing.id)
        .select()
        .single();
      if (error && error.message && error.message.includes("google_maps_url")) {
        const retryResult = await db
          .from("contact_info")
          .update(contactData)
          .eq("id", existing.id)
          .select()
          .single();
        if (retryResult.error) throw retryResult.error;
        data = retryResult.data;
      } else if (error) {
        throw error;
      }
      result = data;
    } else {
      const dataWithMaps = { ...contactData, google_maps_url: googleMapsUrl };
      let { data, error } = await db
        .from("contact_info")
        .insert(dataWithMaps)
        .select()
        .single();
      if (error && error.message && error.message.includes("google_maps_url")) {
        const retryResult = await db
          .from("contact_info")
          .insert(contactData)
          .select()
          .single();
        if (retryResult.error) throw retryResult.error;
        data = retryResult.data;
      } else if (error) {
        throw error;
      }
      result = data;
    }
    if (result) {
      result.google_maps_url = result.google_maps_url || googleMapsUrl;
    }
    res.json(transformToCamelCase(result));
  } catch {
    res.status(500).json({ error: "Failed to update contact info" });
  }
});

// ==================== GALLERY IMAGES ====================

app.get("/api/gallery", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("gallery_images")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch {
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
});

app.post("/api/gallery", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("gallery_images")
      .insert({
        image_url: req.body.image_url,
        title: req.body.title || null,
        order_index: req.body.order_index || 0,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "Failed to create gallery image" });
  }
});

app.delete("/api/gallery/:id", async (req, res) => {
  try {
    const db = getDb();
    const { error } = await db
      .from("gallery_images")
      .delete()
      .eq("id", parseInt(req.params.id));
    if (error) throw error;
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete gallery image" });
  }
});

// ==================== PLACE IMAGES ====================

app.get("/api/place-images", async (req, res) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from("gallery_images")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    const result = (data || []).map((item: any) => ({
      id: String(item.id),
      imageUrl: item.image_url,
    }));
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch place images" });
  }
});

app.post("/api/place-images", async (req, res) => {
  try {
    const db = getDb();
    const imageUrl = req.body.imageUrl || req.body.image_url;
    const { data, error } = await db
      .from("gallery_images")
      .insert({
        image_url: imageUrl,
        title: null,
        order_index: 0,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({
      id: String(data.id),
      imageUrl: data.image_url,
    });
  } catch {
    res.status(500).json({ error: "Failed to create place image" });
  }
});

app.delete("/api/place-images/:id", async (req, res) => {
  try {
    const db = getDb();
    const numericId = parseInt(req.params.id);
    const { error } = await db
      .from("gallery_images")
      .delete()
      .eq("id", numericId);
    if (error) throw error;
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete place image" });
  }
});

export const handler = serverless(app, {
  basePath: "/.netlify/functions/api",
});
