import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCategorySchema, 
  insertMenuItemSchema, 
  insertContactInfoSchema,
  insertGalleryImageSchema
} from "@shared/schema";
import crypto from "crypto";

const EXPECTED_PASSWORD = 'greazy@online_02365149875298';

function transformToSnakeCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = obj[key];
  }
  return result;
}

function transformToCamelCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(transformToCamelCase);
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }
      
      if (password === EXPECTED_PASSWORD) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + 24 * 60 * 60 * 1000;
        res.json({ success: true, token, expiry });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories.map(transformToCamelCase));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(transformToCamelCase(category));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const snakeCaseBody = transformToSnakeCase(req.body);
      const parsed = insertCategorySchema.safeParse(snakeCaseBody);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid category data" });
      }
      const category = await storage.createCategory(parsed.data);
      res.status(201).json(transformToCamelCase(category));
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const snakeCaseBody = transformToSnakeCase(req.body);
      const category = await storage.updateCategory(id, snakeCaseBody);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(transformToCamelCase(category));
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/menu-items", async (req, res) => {
    try {
      const categoryId = req.query.category_id ? parseInt(req.query.category_id as string) : undefined;
      const items = await storage.getMenuItems(categoryId);
      res.json(items.map(transformToCamelCase));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(transformToCamelCase(item));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const snakeCaseBody = transformToSnakeCase(req.body);
      const parsed = insertMenuItemSchema.safeParse(snakeCaseBody);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid menu item data" });
      }
      const item = await storage.createMenuItem(parsed.data);
      res.status(201).json(transformToCamelCase(item));
    } catch (error) {
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.patch("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const snakeCaseBody = transformToSnakeCase(req.body);
      const item = await storage.updateMenuItem(id, snakeCaseBody);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(transformToCamelCase(item));
    } catch (error) {
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const info = await storage.getContactInfo();
      res.json(info ? transformToCamelCase(info) : null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact info" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const snakeCaseBody = transformToSnakeCase(req.body);
      const parsed = insertContactInfoSchema.safeParse(snakeCaseBody);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid contact info data" });
      }
      const info = await storage.updateContactInfo(parsed.data);
      res.json(transformToCamelCase(info));
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact info" });
    }
  });

  app.put("/api/contact", async (req, res) => {
    try {
      const snakeCaseBody = transformToSnakeCase(req.body);
      const parsed = insertContactInfoSchema.safeParse(snakeCaseBody);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid contact info data" });
      }
      const info = await storage.updateContactInfo(parsed.data);
      res.json(transformToCamelCase(info));
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact info" });
    }
  });

  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const parsed = insertGalleryImageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid gallery image data" });
      }
      const image = await storage.createGalleryImage(parsed.data);
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to create gallery image" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGalleryImage(id);
      if (!deleted) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gallery image" });
    }
  });

  return httpServer;
}
