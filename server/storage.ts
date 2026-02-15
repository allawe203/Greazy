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
  type InsertGalleryImage,
  type PlaceImage,
  type InsertPlaceImage
} from "@shared/schema";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
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
  
  getPlaceImages(): Promise<PlaceImage[]>;
  createPlaceImage(image: InsertPlaceImage): Promise<PlaceImage>;
  deletePlaceImage(id: string): Promise<boolean>;
}

import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://umyrutkzbunvqeumrqwi.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Temporary file-based storage for google_maps_url until Supabase schema cache refreshes
const MAPS_URL_FILE = path.join(process.cwd(), '.google_maps_url.json');

function getStoredMapsUrl(): string | null {
  try {
    if (fs.existsSync(MAPS_URL_FILE)) {
      const data = JSON.parse(fs.readFileSync(MAPS_URL_FILE, 'utf-8'));
      return data.url || null;
    }
  } catch {
    // File doesn't exist or is invalid
  }
  return null;
}

function setStoredMapsUrl(url: string | null): void {
  try {
    fs.writeFileSync(MAPS_URL_FILE, JSON.stringify({ url }));
  } catch (err) {
    console.error('Failed to store maps URL:', err);
  }
}

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor() {
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for database operations');
    }
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: 'public' },
      global: { headers: { 'x-my-custom-header': 'refresh-schema' } }
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const { data, error } = await this.supabase
      .from('users')
      .insert({ ...insertUser, id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as User;
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return (data || []) as Category[];
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return data as Category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await this.supabase
      .from('categories')
      .insert({
        name: category.name,
        image_url: category.image_url || null
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Category;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const updateData: any = {};
    if (category.name !== undefined) updateData.name = category.name;
    if (category.image_url !== undefined) updateData.image_url = category.image_url;

    const { data, error } = await this.supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return undefined;
    return data as Category;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await this.supabase
      .from('menu_items')
      .delete()
      .eq('category_id', id);
    
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getMenuItems(categoryId?: number): Promise<MenuItem[]> {
    let query = this.supabase.from('menu_items').select('*').order('id', { ascending: true });
    if (categoryId !== undefined) {
      query = query.eq('category_id', categoryId);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
    return (data || []) as MenuItem[];
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const { data, error } = await this.supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return data as MenuItem;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const { data, error } = await this.supabase
      .from('menu_items')
      .insert({
        name: item.name,
        description: item.description || null,
        price: item.price,
        image_url: item.image_url || null,
        category_id: item.category_id || null
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as MenuItem;
  }

  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const updateData: any = {};
    if (item.name !== undefined) updateData.name = item.name;
    if (item.description !== undefined) updateData.description = item.description;
    if (item.price !== undefined) updateData.price = item.price;
    if (item.image_url !== undefined) updateData.image_url = item.image_url;
    if (item.category_id !== undefined) updateData.category_id = item.category_id;

    const { data, error } = await this.supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return undefined;
    return data as MenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getContactInfo(): Promise<ContactInfo | undefined> {
    const { data, error } = await this.supabase
      .from('contact_info')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();
    if (error || !data) return undefined;
    
    // Use file-based storage for google_maps_url until Supabase schema cache refreshes
    const googleMapsUrl = getStoredMapsUrl();
    
    return { ...data, google_maps_url: googleMapsUrl } as ContactInfo;
  }

  async updateContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const existing = await this.getContactInfo();
    
    // Base update data (fields that are in the cached schema)
    const baseUpdateData = {
      phone: info.phone || null,
      email: info.email || null,
      address: info.address || null,
      opening_hours: info.opening_hours || null,
      whatsapp: info.whatsapp || null,
      instagram_url: info.instagram_url || null,
      facebook_url: info.facebook_url || null,
      tiktok_url: info.tiktok_url || null,
      snapchat_url: info.snapchat_url || null,
    };
    
    if (existing) {
      // Update the base fields first
      const { data, error } = await this.supabase
        .from('contact_info')
        .update(baseUpdateData)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      
      // Store google_maps_url in file until Supabase schema cache refreshes
      if (info.google_maps_url !== undefined) {
        setStoredMapsUrl(info.google_maps_url || null);
      }
      
      return { ...data, google_maps_url: info.google_maps_url || null } as ContactInfo;
    } else {
      const { data, error } = await this.supabase
        .from('contact_info')
        .insert(baseUpdateData)
        .select()
        .single();
      if (error) throw new Error(error.message);
      
      return { ...data, google_maps_url: info.google_maps_url || null } as ContactInfo;
    }
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    const { data, error } = await this.supabase
      .from('gallery_images')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
    return (data || []) as GalleryImage[];
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const { data, error } = await this.supabase
      .from('gallery_images')
      .insert({
        image_url: image.image_url,
        title: image.title || null,
        order_index: image.order_index || 0
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as GalleryImage;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getPlaceImages(): Promise<PlaceImage[]> {
    const { data, error } = await this.supabase
      .from('gallery_images')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching place images:', error);
      return [];
    }
    return (data || []).map((item: any) => ({
      id: String(item.id),
      image_url: item.image_url
    })) as PlaceImage[];
  }

  async createPlaceImage(image: InsertPlaceImage): Promise<PlaceImage> {
    const { data, error } = await this.supabase
      .from('gallery_images')
      .insert({
        image_url: image.image_url,
        title: null,
        order_index: 0
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return {
      id: String(data.id),
      image_url: data.image_url
    } as PlaceImage;
  }

  async deletePlaceImage(id: string): Promise<boolean> {
    const numericId = parseInt(id, 10);
    const { error } = await this.supabase
      .from('gallery_images')
      .delete()
      .eq('id', numericId);
    return !error;
  }
}

export const storage = new SupabaseStorage();
