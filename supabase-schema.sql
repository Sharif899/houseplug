-- ============================================================
-- HousePlug Osogbo — Supabase Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  phone       TEXT,
  whatsapp    TEXT,
  role        TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('user','agent','admin')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles"   ON public.users FOR SELECT USING (true);
CREATE POLICY "Own update"        ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Own insert"        ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- ── PROPERTIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.properties (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  price        BIGINT NOT NULL,
  price_period TEXT DEFAULT 'yearly' CHECK (price_period IN ('monthly','yearly','total')),
  type         TEXT NOT NULL CHECK (type IN ('house','apartment','shop','office','land')),
  purpose      TEXT NOT NULL CHECK (purpose IN ('rent','sale')),
  location     TEXT NOT NULL,
  area         TEXT NOT NULL,
  address      TEXT,
  bedrooms     INTEGER,
  bathrooms    INTEGER,
  size_sqm     INTEGER,
  images       TEXT[]   DEFAULT ARRAY[]::TEXT[],
  amenities    TEXT[]   DEFAULT ARRAY[]::TEXT[],
  agent_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  slug         TEXT NOT NULL UNIQUE,
  views        INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_props_agent    ON public.properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_props_type     ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_props_purpose  ON public.properties(purpose);
CREATE INDEX IF NOT EXISTS idx_props_area     ON public.properties(area);
CREATE INDEX IF NOT EXISTS idx_props_featured ON public.properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_props_avail    ON public.properties(is_available);
CREATE INDEX IF NOT EXISTS idx_props_slug     ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_props_price    ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_props_created  ON public.properties(created_at DESC);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View available"  ON public.properties FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Agent insert"    ON public.properties FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agent update"    ON public.properties FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Agent delete"    ON public.properties FOR DELETE USING (auth.uid() = agent_id);

-- ── PROPERTY REQUESTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.property_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT,
  whatsapp     TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('house','apartment','shop','office','land')),
  purpose      TEXT NOT NULL CHECK (purpose IN ('rent','sale','either')),
  area         TEXT NOT NULL,
  budget_min   BIGINT,
  budget_max   BIGINT,
  bedrooms     TEXT,
  timeline     TEXT,
  description  TEXT,
  urgency      TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal','urgent')),
  is_fulfilled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_req_type     ON public.property_requests(type);
CREATE INDEX IF NOT EXISTS idx_req_area     ON public.property_requests(area);
CREATE INDEX IF NOT EXISTS idx_req_urgency  ON public.property_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_req_created  ON public.property_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_req_fulfill  ON public.property_requests(is_fulfilled);

ALTER TABLE public.property_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can view open requests (agents browse them)
CREATE POLICY "View open requests"
  ON public.property_requests FOR SELECT
  USING (is_fulfilled = FALSE);

-- Anyone can submit a request (no login needed)
CREATE POLICY "Public submit request"
  ON public.property_requests FOR INSERT
  WITH CHECK (true);

-- Only admins can mark fulfilled
CREATE POLICY "Admin fulfill"
  ON public.property_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ── HELPER FUNCTIONS ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.properties SET views = views + 1 WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_properties_updated
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, is_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email, 'agent', FALSE
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── STORAGE BUCKET ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-images','property-images', TRUE, 5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Auth upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Own delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[2]);
