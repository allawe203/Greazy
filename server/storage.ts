import { 
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory,
  type MenuItem,
  type InsertMenuItem,
  type ContactInfo,
  type InsertContactInfo,
  type GalleryImage,
  type InsertGalleryImage 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  getMenuItems(categoryId?: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(info: InsertContactInfo): Promise<ContactInfo>;
  
  getGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<number, Category>;
  private menuItems: Map<number, MenuItem>;
  private contactInfo: ContactInfo | undefined;
  private galleryImages: Map<number, GalleryImage>;
  private nextCategoryId: number = 1;
  private nextMenuItemId: number = 1;
  private nextGalleryImageId: number = 1;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.menuItems = new Map();
    this.galleryImages = new Map();
    this.initializeDefaults();
  }

  private initializeDefaults() {
    this.contactInfo = {
      id: 1,
      phone: '+966501234567',
      email: 'info@greazy.com',
      address: 'King Fahd Road, Riyadh, Saudi Arabia',
      opening_hours: 'Daily 11:00 AM - 11:00 PM',
      whatsapp: '+966501234567',
      instagram_url: 'https://instagram.com/greazy',
      facebook_url: 'https://facebook.com/greazy',
      twitter_url: 'https://twitter.com/greazy',
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.id - b.id);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.nextCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    const updated: Category = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const menuItemsToDelete = Array.from(this.menuItems.values()).filter(item => item.category_id === id);
    menuItemsToDelete.forEach(item => this.menuItems.delete(item.id));
    return this.categories.delete(id);
  }

  async getMenuItems(categoryId?: number): Promise<MenuItem[]> {
    const items = Array.from(this.menuItems.values());
    if (categoryId !== undefined) {
      return items.filter(item => item.category_id === categoryId).sort((a, b) => a.id - b.id);
    }
    return items.sort((a, b) => a.id - b.id);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.nextMenuItemId++;
    const newItem: MenuItem = { ...item, id };
    this.menuItems.set(id, newItem);
    return newItem;
  }

  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existing = this.menuItems.get(id);
    if (!existing) return undefined;
    const updated: MenuItem = { ...existing, ...item };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async getContactInfo(): Promise<ContactInfo | undefined> {
    return this.contactInfo;
  }

  async updateContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    this.contactInfo = { ...info, id: 1 };
    return this.contactInfo;
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.nextGalleryImageId++;
    const newImage: GalleryImage = { ...image, id };
    this.galleryImages.set(id, newImage);
    return newImage;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    return this.galleryImages.delete(id);
  }
}

export const storage = new MemStorage();
