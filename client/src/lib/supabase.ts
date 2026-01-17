import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://umyrutkzbunvqeumrqwi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXJ1dGt6YnVudnFldW1ycXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDI5OTksImV4cCI6MjA4NDIxODk5OX0.MpWmIeEfdnMN7SWL-R_HuGGr0A667ztdd7SlNs3Lr24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: number;
  name: string;
  image_url: string;
  created_at?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  created_at?: string;
}

export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  opening_hours: string;
  whatsapp: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
}

export interface GalleryImage {
  id: number;
  image_url: string;
  title?: string;
  order_index: number;
}

export interface PlaceImage {
  id: string;
  image_url: string;
  created_at?: string;
}
