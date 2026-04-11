# 🏠 HousePlug Osogbo — Full-Stack Real Estate Platform

Production-ready real estate web app for Osogbo, Osun State, Nigeria.
Built with **Next.js 14**, **Tailwind CSS**, **Supabase**, and **Google AdSense**.

---

## 🚀 Quick Start (5 Steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste entire `supabase-schema.sql` → Run
3. Go to **Authentication → Settings** → add your domain to Redirect URLs

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start development server
```bash
npm run dev
```
Open http://localhost:3000

### 5. Deploy to Vercel
```bash
npx vercel --prod
```
Add all environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## 💰 Google AdSense Activation

Once your site has traffic and gets AdSense approved:

1. Go to [google.com/adsense](https://google.com/adsense) and apply
2. Get your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
4. Create 4 ad units in AdSense Dashboard and add slot IDs:
   ```env
   NEXT_PUBLIC_AD_SLOT_LEADERBOARD=1234567890
   NEXT_PUBLIC_AD_SLOT_RECTANGLE=0987654321
   NEXT_PUBLIC_AD_SLOT_INFEED=1122334455
   NEXT_PUBLIC_AD_SLOT_INARTICLE=5544332211
   ```
5. Deploy — all **15 ad zones go live automatically** across all pages.

### Ad Zones by Page
| Page             | Zones | Format |
|------------------|-------|--------|
| Homepage         | 3     | Leaderboard × 2, In-Feed |
| Listings         | 2     | Leaderboard, In-Grid |
| Property Detail  | 2     | In-Article, Sidebar 300×250 |
| Blog Index       | 2     | Leaderboard × 2 |
| Blog Posts       | 3+1   | Top, Mid-Article, End + Sidebar |
| Request Board    | 3     | Banner, In-Feed, Sidebar |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout + AdSense
│   ├── globals.css                 # Poppins font + design tokens
│   ├── properties/
│   │   ├── page.tsx                # Listings with filters
│   │   └── [slug]/page.tsx         # Property detail
│   ├── requests/page.tsx           # Request Board ← NEW
│   ├── blog/
│   │   ├── page.tsx                # Blog index
│   │   └── [slug]/page.tsx         # Blog post
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   ├── dashboard/
│   │   ├── page.tsx                # Agent dashboard
│   │   ├── new-listing/page.tsx    # 4-step listing form
│   │   └── edit/[id]/page.tsx      # Edit listing
│   └── api/properties/[id]/delete/
├── components/
│   ├── layout/Navbar.tsx           # HousePlug navbar
│   ├── layout/Footer.tsx
│   ├── property/PropertyCard.tsx   # Card with Call + WhatsApp
│   └── ads/GoogleAdsense.tsx       # All ad components
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   └── utils.ts
└── types/index.ts
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary green | `#0D4A2F` |
| Mid green | `#1A6B45` |
| Gold accent | `#F5A623` |
| Font | Poppins (400, 500, 600, 700, 800) |
| Card radius | 14px |
| Background | `#F4F8F5` |

---

## ✅ Features

| Feature | Status |
|---------|--------|
| HousePlug green design + Poppins font | ✅ |
| Property listings (SSR) | ✅ |
| Search & filters | ✅ |
| Property detail + gallery | ✅ |
| WhatsApp + Call buttons | ✅ |
| Featured listings | ✅ |
| Verified agent badge | ✅ |
| Agent signup/login | ✅ |
| Agent dashboard | ✅ |
| 4-step listing form | ✅ |
| Multi-image upload | ✅ |
| **Request Board (user + agent view)** | ✅ |
| **15 AdSense zones pre-placed** | ✅ |
| SEO blog (6 articles) | ✅ |
| Auto sitemap | ✅ |
| Mobile-first responsive | ✅ |
| Supabase RLS security | ✅ |

---

## 🗺️ Roadmap

- [ ] Paystack payments for Featured Listing upgrades
- [ ] Email/WhatsApp notifications for new requests
- [ ] Agent profiles page
- [ ] Google Maps integration
- [ ] Admin panel

---

Built with ❤️ for Osogbo, Osun State, Nigeria.
