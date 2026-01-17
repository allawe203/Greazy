# GREAZY Restaurant Website

## Overview
A modern, fully functional restaurant website for "GREAZY" featuring a bold street food vibe with flame-grilled aesthetics. The site includes a public-facing customer experience and a protected admin dashboard for content management.

## Brand Identity
- **Restaurant Name**: GREAZY
- **Tagline**: "We Stack, You Attack"
- **Logo**: `attached_assets/V1_1768668285045.png`
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
  - `Home.tsx` - Full-screen video hero (uses local video file)
  - `Menu.tsx` - Category grid and menu items from API
  - `Reservations.tsx` - Date picker with WhatsApp integration
  - `OurPlace.tsx` - Full-screen image slider with auto-play
  - `Contact.tsx` - Contact info with Google Maps
  - `admin/Login.tsx` - Admin login (server-side validation)
  - `admin/Dashboard.tsx` - Full admin management (Categories, Menu Items, Our Place, Contact)

### Backend (Express + TypeScript)
- `/server/routes.ts` - API endpoints with camelCase/snake_case transformation
- `/server/storage.ts` - In-memory storage with CRUD operations
- `/shared/schema.ts` - Shared TypeScript types and Zod schemas

### Data Flow
- All data is fetched through the backend API (`/api/*` endpoints)
- Backend transforms snake_case (database) to camelCase (frontend) and vice versa
- In-memory storage is used by default; Supabase can be connected if needed

### API Endpoints
```
GET/POST     /api/categories
GET/PATCH/DELETE /api/categories/:id

GET/POST     /api/menu-items
GET/PATCH/DELETE /api/menu-items/:id

GET/POST/PUT /api/contact

GET/POST     /api/place-images
DELETE       /api/place-images/:id

POST         /api/admin/login
```

## Routes

### Public Pages
- `/` - Home (full-screen video hero with custom uploaded video)
- `/menu` - Menu categories and items
- `/reservations` - Booking via WhatsApp
- `/our-place` - Image slider gallery (renamed from /our-food)
- `/contact` - Contact information

### Admin Pages
- `/admin` - Login page
- `/admin/dashboard` - Management panel with tabs:
  - Dashboard (overview)
  - Categories
  - Menu Items
  - Our Place (image management)
  - Contact Info

**Admin Password**: `greazy@online_02365149875298`

## Key Features
1. **Responsive Design** - Mobile-first with smooth transitions
2. **Video Hero** - Full-screen looping video background (custom uploaded video)
3. **Logo Image** - Custom logo in navigation bar (clickable to home)
4. **WhatsApp Integration** - Direct booking via WhatsApp
5. **Admin Dashboard** - Category, menu item, place image, and contact management
6. **Image Slider** - Auto-playing carousel for "Our Place" page
7. **Dark Theme** - Consistent dark aesthetic throughout
8. **Server-side Authentication** - Secure admin login

## Image Upload (Supabase Storage)
Admin dashboard supports file uploads to Supabase Storage for Categories, Menu Items, and Our Place images.

### Setup Required
1. Create a storage bucket named "images" in your Supabase dashboard
2. Enable public access or configure RLS policies for the bucket
3. The upload function will create folders: categories/, menu-items/, our-place/

### Fallback
If Supabase Storage is not configured, users can manually enter image URLs instead.

## Recent Changes (January 2026)
- Added file upload functionality to admin dashboard (Supabase Storage)
- Added custom video file for home page hero
- Added custom logo image in navigation bar
- Renamed "Our Food" to "Our Place" with image slider
- Added "Our Place" management tab in admin dashboard
- Updated all pages to fetch data from backend API instead of Supabase directly
- Added place_images table and API endpoints

## Development
```bash
npm run dev  # Start development server
```

The app runs on port 5000.
