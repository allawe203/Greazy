# GREAZY Restaurant Website

## Overview
A modern, fully functional restaurant website for "GREAZY" featuring a bold street food vibe with flame-grilled aesthetics. The site includes a public-facing customer experience and a protected admin dashboard for content management.

## Brand Identity
- **Restaurant Name**: GREAZY
- **Tagline**: "We Stack, You Attack"
- **Color Palette**:
  - Primary Orange: #f36e27
  - Dark Background: #222222
  - Cream: #f5e6c7
  - Light Cream: #f9f3e1
  - Dark Gray: #3e3e3e
  - Medium Gray: #606161

## Architecture

### Frontend (React + TypeScript)
- `/client/src/pages/` - Main page components
  - `Home.tsx` - Video hero with branding
  - `Menu.tsx` - Category grid and menu items
  - `Reservations.tsx` - Date picker with WhatsApp integration
  - `OurFood.tsx` - Parallax image gallery
  - `Contact.tsx` - Contact info with Google Maps
  - `admin/Login.tsx` - Admin login
  - `admin/Dashboard.tsx` - Full admin management

### Backend (Express + TypeScript)
- `/server/routes.ts` - API endpoints for categories, menu items, contact, gallery
- `/server/storage.ts` - In-memory storage with CRUD operations
- `/shared/schema.ts` - Shared TypeScript types and Zod schemas

### Database Integration
The app supports dual data sources:
1. **Supabase** (Primary) - Direct client connection from frontend
2. **Local API** (Fallback) - Express backend with in-memory storage

**Supabase Credentials**:
- URL: https://umyrutkzbunvqeumrqwi.supabase.co
- Configured in `/client/src/lib/supabase.ts`

### Required Supabase Tables
```sql
-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Info
CREATE TABLE contact_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  opening_hours TEXT,
  whatsapp VARCHAR(50),
  instagram_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT
);

-- Gallery Images
CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  order_index INTEGER DEFAULT 0
);
```

## Routes

### Public Pages
- `/` - Home (video hero)
- `/menu` - Menu categories and items
- `/reservations` - Booking via WhatsApp
- `/our-food` - Food gallery
- `/contact` - Contact information

### Admin Pages
- `/admin` - Login page
- `/admin/dashboard` - Management panel

**Admin Password**: `greazy@online_02365149875298`

## Key Features
1. **Responsive Design** - Mobile-first with smooth transitions
2. **Video Hero** - Full-screen looping video background
3. **WhatsApp Integration** - Direct booking via WhatsApp
4. **Admin Dashboard** - Category, menu item, and contact management
5. **Parallax Gallery** - Scroll-triggered animations
6. **Dark Theme** - Consistent dark aesthetic throughout

## Development
```bash
npm run dev  # Start development server
```

The app runs on port 5000.
