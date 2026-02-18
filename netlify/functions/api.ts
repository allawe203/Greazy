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
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function transformToSnakeCase(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = obj[key];
  }
  return result;
}

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

function getSupabaseClient() {
  if (!supabase) throw new Error("Supabase not configured");
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
    const db = getSupabaseClient();
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
    const { data: { publicUrl } } = db.storage.from("images").getPublicUrl(fileName);
    res.json({ url: publicUrl });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Categories
app.get("/api/categories", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from("categories").select("*").order("order_index");
    if (error) throw error;
    res.json((data || []).map(transformToCamelCase));
  } catch { res.status(500).json({ error: "Failed to fetch categories" }); }
});

app.get("/api/categories/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from("categories").select("*").eq("id", parseInt(req.params.id)).single();
    if (error || !data) return res.status(404).json({ error: "Category not found" });
    res.json(transformToCamelCase(data));
  } catch { res.status(500).json({ error: "Failed to fetch category" }); }
});

app.post("/api/categories", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const body = transformToSnakeCase(req.body);
    const { data, error } = await db.from("categories").insert(body).select().single();
    if (error) throw error;
    res.status(201).json(transformToCamelCase(data));
  } catch { res.status(500).json({ error: "Failed to create category" }); }
});

app.patch("/api/categories/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const body = transformToSnakeCase(req.body);
    const { data, error } = await db.from("categories").update(body).eq("id", parseInt(req.params.id)).select().single();
    if (error) throw error;
    res.json(transformToCamelCase(data));
  } catch { res.status(500).json({ error: "Failed to update category" }); }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { error } = await db.from("categories").delete().eq("id", parseInt(req.params.id));
    if (error) throw error;
    res.status(204).send();
  } catch { res.status(500).json({ error: "Failed to delete category" }); }
});

// Menu Items
app.get("/api/menu-items", async (req, res) => {
  try {
    const db = getSupabaseClient();
    let query = db.from("menu_items").select("*").order("order_index");
    if (req.query.category_id) query = query.eq("category_id", parseInt(req.query.category_id as string));
    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(transformToCamelCase));
  } catch { res.status(500).json({ error: "Failed to fetch menu items" }); }
});

app.get("/api/menu-items/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from("menu_items").select("*").eq("id", parseInt(req.params.id)).single();
    if (error || !data) return res.status(404).json({ error: "Menu item not found" });
    res.json(transformToCamelCase(data));
  } catch { res.status(500).json({ error: "Failed to fetch menu item" }); }
});

app.post("/api/menu-items", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const body = transformToSnakeCase(req.body);
    if (typeof body.price === "number") body.price = body.price.toString();
    const { data, error } = await db.from("menu_items").insert(body).select().single();
    if (error) throw error;
    res.status(201).json(transformToCamelCase(data));
  } catch { res.status(500).json({ error: "Failed to create menu item" }); }
});

app.patch("/api/menu-items/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const body = transformToSnakeCase(req.body);
    if (typeof body.price === "number") body.price = body.price.toString();
    const { data, error } = await db.from("menu_items").update(body).eq("id", parseInt(req.params.id)).select().single();
    if (error) throw error;
    res.json(transformToCamelCase(data));
  } catch { res.status(500).json({ error: "Failed to update menu item" }); }
});

app.delete("/api/menu-items/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { error } = await db.from("menu_items").delete().eq("id", parseInt(req.params.id));
    if (error) throw error;
    res.status(204).send();
  } catch { res.status(500).json({ error: "Failed to delete menu item" }); }
});

// Contact Info
app.get("/api/contact", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from("contact_info").select("*").limit(1).single();
    if (error || !data) return res.json(null);
    res.json(transformToCamelCase(data));
  } catch { res.status(500).json({ error: "Failed to fetch contact info" }); }
});

app.post("/api/contact", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const body = transformToSnakeCase(req.body);
    const { data: existing } = await db.from("contact_info").select("id").limit(1).single();
    let result;
    if (existing) {
      const { data, error } = await db.from("contact_info").update(body).eq("id", existing.id).select().single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await db.from("contact_info").insert(body).select().single();
      if (error) throw error;
      result = data;
    }
    res.json(transformToCamelCase(result));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update contact info" });
  }
});

app.put("/api/contact", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const body = transformToSnakeCase(req.body);
    const { data: existing } = await db.from("contact_info").select("id").limit(1).single();
    let result;
    if (existing) {
      const { data, error } = await db.from("contact_info").update(body).eq("id", existing.id).select().single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await db.from("contact_info").insert(body).select().single();
      if (error) throw error;
      result = data;
    }
    res.json(transformToCamelCase(result));
  } catch {
    res.status(500).json({ error: "Failed to update contact info" });
  }
});

// Gallery Images
app.get("/api/gallery", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from("gallery_images").select("*").order("order_index");
    if (error) throw error;
    res.json(data || []);
  } catch { res.status(500).json({ error: "Failed to fetch gallery images" }); }
});

app.post("/api/gallery", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from("gallery_images").insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch { res.status(500).json({ error: "Failed to create gallery image" }); }
});

app.delete("/api/gallery/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { error } = await db.from("gallery_images").delete().eq("id", parseInt(req.params.id));
    if (error) throw error;
    res.status(204).send();
  } catch { res.status(500).json({ error: "Failed to delete gallery image" }); }
});

// Place Images
app.get("/api/place-images", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from("gallery_images").select("*").order("order_index");
    if (error) throw error;
    const transformed = (data || []).map((img: any) => ({
      ...transformToCamelCase(img),
      id: String(img.id),
    }));
    res.json(transformed);
  } catch { res.status(500).json({ error: "Failed to fetch place images" }); }
});

app.post("/api/place-images", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const body = transformToSnakeCase(req.body);
    const { data, error } = await db.from("gallery_images").insert({
      image_url: body.image_url,
      title: body.title || null,
      order_index: body.order_index || 0,
    }).select().single();
    if (error) throw error;
    res.status(201).json({ ...transformToCamelCase(data), id: String(data.id) });
  } catch { res.status(500).json({ error: "Failed to create place image" }); }
});

app.delete("/api/place-images/:id", async (req, res) => {
  try {
    const db = getSupabaseClient();
    const numericId = parseInt(req.params.id);
    const { error } = await db.from("gallery_images").delete().eq("id", numericId);
    if (error) throw error;
    res.status(204).send();
  } catch { res.status(500).json({ error: "Failed to delete place image" }); }
});

export const handler = serverless(app, {
  basePath: "/.netlify/functions/api",
});
