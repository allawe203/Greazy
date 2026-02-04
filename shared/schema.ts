import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image_url: text("image_url"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image_url: text("image_url"),
  category_id: integer("category_id").references(() => categories.id),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  opening_hours: text("opening_hours"),
  whatsapp: varchar("whatsapp", { length: 50 }),
  instagram_url: text("instagram_url"),
  facebook_url: text("facebook_url"),
  twitter_url: text("twitter_url"),
  google_maps_url: text("google_maps_url"),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
});

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  image_url: text("image_url").notNull(),
  title: varchar("title", { length: 255 }),
  order_index: integer("order_index").default(0),
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
});

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export const placeImages = pgTable("place_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  image_url: text("image_url").notNull(),
});

export const insertPlaceImageSchema = createInsertSchema(placeImages).omit({
  id: true,
});

export type InsertPlaceImage = z.infer<typeof insertPlaceImageSchema>;
export type PlaceImage = typeof placeImages.$inferSelect;
