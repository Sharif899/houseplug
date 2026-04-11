import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property/PropertyCard";
import { AdBanner, AdInFeed } from "@/components/ads/GoogleAdsense";
import { OSOGBO_AREAS } from "@/types";

export const metadata: Metadata = {
  title: "HousePlug Osogbo — Find Houses & Shops for Rent and Sale",
  description: "Your trusted property plug in Osogbo, Nigeria. Discover verified listings of houses and shops available for rent and sale.",
};
export const revalidate = 300;

async function getFeatured() {
  try {
    const sb = createClient();
    const { data } = await sb.from("properties")
      .select("*, agent:users!agent_id(id,name,phone,whatsapp,is_verified)")
      .eq("is_featured", true).eq("is_available", true)
      .order("created_at",{ascending:false}).limit(6);
    return data || [];
  } catch { return []; }
}

async function getRecent() {
  try {
    const sb = createClient();
    const { data } = await sb.from("properties")
      .select("*, agent:users!agent_id(id,name,phone,whatsapp,is_verified)")
      .eq("is_available", true).eq("is_featured", false)
      .order("created_at",{ascending:false}).limit(8);
    return data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([getFeatured(), getRecent()]);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[380px] bg-[#EDF5F0] overflow-hidden">
        <div className="px-11 py-14 flex flex-col justify-center">
          <h1 className="text-[38px] md:text-[42px] font-extrabold leading-[1.18] text-[#1C2B22] mb-4 tracking-tight">
            Find Houses &amp; Shops<br />in Osogbo
          </h1>
          <p className="text-[14px] text-[#4a6455] leading-[1.78] max-w-[370px]">
            Your trusted property plug in <strong className="text-[#1C2B22] font-semibold">Osogbo, Nigeria.</strong><br />
            Discover verified listings of houses and shops<br />available for rent and sale.
          </p>
        </div>
        <div className="relative overflow-hidden min-h-[240px]">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85"
            alt="Houses in Osogbo" fill priority
            className="object-cover"
            style={{ clipPath: "polygon(7% 0%,100% 0%,100% 100%,0% 100%)" }}
            sizes="50vw"
          />
        </div>
      </section>

      {/* ── SEARCH BOX ───────────────────────────────────── */}
      <div className="px-7">
        <form action="/properties" method="GET"
          className="bg-white rounded-[14px] border border-[#D4E6DA] shadow-search p-5 -mt-7 relative z-10">
          {/* Labels row */}
          <div className="flex gap-6 mb-3 text-[12px] font-semibold text-[#6a8a72]">
            <span className="flex items-center gap-1"><MapPin className="w-[13px] h-[13px] text-brand-500" />Location ▾</span>
            <span className="flex items-center gap-1">🏠 Property Type ▾</span>
            <span className="flex items-center gap-1">₦ Price Range ▾</span>
            <span className="text-[#9aaa9e]">Keywords</span>
          </div>
          {/* Inputs row */}
          <div className="flex gap-2.5 flex-wrap sm:flex-nowrap">
            <select name="area" className="input flex-1 min-w-[130px]">
              <option value=""><MapPin className="inline w-3 h-3" /> Ogo-Oluwa</option>
              {OSOGBO_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select name="type" className="input flex-1 min-w-[120px]">
              <option value="">House / Shop</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="shop">Shop</option>
              <option value="office">Office</option>
              <option value="land">Land</option>
            </select>
            <select name="purpose" className="input flex-1 min-w-[110px]">
              <option value="">Any Price</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
            <div className="relative flex-[2] min-w-[180px]">
              <input name="search" placeholder="Enter keywords..." className="input pr-[100px] w-full" />
              <button type="submit"
                className="absolute right-[5px] top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-500 text-white text-[13px] font-bold px-5 py-[9px] rounded-[8px] transition-colors">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-7">

        {/* ── AD ZONE 1 — Leaderboard top ──────────────── */}
        <AdBanner className="mt-8" />

        {/* ── FEATURED LISTINGS ────────────────────────── */}
        {featured.length > 0 && (
          <section className="mt-8 mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                <h2 className="text-[19px] font-extrabold text-brand-600">Featured Listings</h2>
              </div>
              <Link href="/properties?featured=true" className="flex items-center gap-1 text-[13px] font-semibold text-brand-500 hover:text-brand-600 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((p: any, i: number) => <PropertyCard key={p.id} property={p} priority={i < 3} />)}
            </div>
          </section>
        )}

        {/* ── AD ZONE 2 — In-Feed between sections ─────── */}
        <AdInFeed />

        {/* ── RECENT LISTINGS ──────────────────────────── */}
        <section className="mt-8 mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[19px] font-extrabold text-brand-600">Recent Listings</h2>
            <Link href="/properties" className="flex items-center gap-1 text-[13px] font-semibold text-brand-500 hover:text-brand-600">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recent.map((p: any) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>

        {/* ── VIEW ALL CTA ──────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <Link href="/properties" className="btn-primary px-8 py-3.5 text-[14px] flex items-center gap-2">
            View All Listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── QUICK CATEGORY LINKS ─────────────────────── */}
        <section className="mb-10">
          <h2 className="text-[18px] font-extrabold text-brand-600 mb-5">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href:"/properties?type=house&purpose=rent",  emoji:"🏠", label:"Houses for Rent",  n:"120+" },
              { href:"/properties?type=house&purpose=sale",  emoji:"🏡", label:"Houses for Sale",  n:"80+"  },
              { href:"/properties?type=shop",                emoji:"🏪", label:"Shops for Rent",   n:"60+"  },
              { href:"/properties?type=apartment",           emoji:"🏢", label:"Apartments",       n:"90+"  },
            ].map(c=>(
              <Link key={c.href} href={c.href}
                className="p-5 rounded-2xl border border-[#D4E6DA] text-center hover:border-brand-500 hover:bg-[#f0f7f2] hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-2">{c.emoji}</div>
                <p className="font-bold text-[13.5px] text-[#1C2B22]">{c.label}</p>
                <p className="text-[12px] text-[#9aaa9e] mt-0.5">{c.n} listings</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── AREA LINKS (SEO) ─────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-[18px] font-extrabold text-brand-600 mb-4">Areas in Osogbo</h2>
          <div className="flex flex-wrap gap-2.5">
            {OSOGBO_AREAS.map(area=>(
              <Link key={area} href={`/properties?area=${encodeURIComponent(area)}`}
                className="px-4 py-2 bg-[#F4F8F5] border border-[#D4E6DA] rounded-full text-[12.5px] font-medium text-[#4a6a52] hover:bg-brand-100 hover:border-brand-400 hover:text-brand-600 transition-all">
                {area}
              </Link>
            ))}
          </div>
        </section>

        {/* ── AD ZONE 3 — Leaderboard bottom ───────────── */}
        <AdBanner className="mb-8" />
      </div>

      {/* ── REQUEST / CTA STRIP ──────────────────────────── */}
      <section className="bg-brand-600 py-7 px-7">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-[19px] font-extrabold text-white mb-1">Start your search for the best</h3>
            <p className="text-white/60 text-[13px]">Or post a request — agents will come to you!</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/properties" className="btn-gold px-7 py-3 flex items-center gap-2">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/requests" className="flex items-center gap-2 px-7 py-3 bg-white/10 text-white font-semibold text-[13.5px] rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              Post a Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
