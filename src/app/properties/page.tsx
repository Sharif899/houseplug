import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property/PropertyCard";
import { AdBanner, AdInFeed } from "@/components/ads/GoogleAdsense";
import { OSOGBO_AREAS, PROPERTY_TYPES } from "@/types";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Properties for Rent & Sale in Osogbo",
  description: "Browse all verified houses, apartments, shops, and land for rent or sale in Osogbo, Osun State.",
};
export const revalidate = 120;

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Record<string, string | undefined>;
}

async function getProperties(sp: Record<string, string | undefined>, page: number) {
  try {
    const sb  = createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;

    let q = sb.from("properties")
      .select("*, agent:users!agent_id(id,name,phone,whatsapp,is_verified)", { count:"exact" })
      .eq("is_available", true)
      .order("is_featured",  { ascending: false })
      .order("created_at",   { ascending: false })
      .range(from, to);

    if (sp.type)     q = q.eq("type",    sp.type);
    if (sp.purpose)  q = q.eq("purpose", sp.purpose);
    if (sp.area)     q = q.eq("area",    sp.area);
    if (sp.minPrice) q = q.gte("price",  parseInt(sp.minPrice));
    if (sp.maxPrice) q = q.lte("price",  parseInt(sp.maxPrice));
    if (sp.featured) q = q.eq("is_featured", true);
    if (sp.search)   q = q.or(`title.ilike.%${sp.search}%,description.ilike.%${sp.search}%,area.ilike.%${sp.search}%`);

    const { data, count } = await q;
    return { data: data || [], count: count || 0, totalPages: Math.ceil((count || 0) / PAGE_SIZE) };
  } catch {
    return { data: [], count: 0, totalPages: 0 };
  }
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const { data: properties, count, totalPages } = await getProperties(searchParams, page);

  let title = "All Properties in Osogbo";
  if (searchParams.purpose === "rent")  title = "Properties for Rent in Osogbo";
  if (searchParams.purpose === "sale")  title = "Properties for Sale in Osogbo";
  if (searchParams.type === "shop")     title = "Shops for Rent in Osogbo";
  if (searchParams.area)                title = `Properties in ${searchParams.area}, Osogbo`;

  return (
    <div className="bg-[#F4F8F5] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#ddeae0] py-8 px-7">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[28px] font-extrabold text-[#1C2B22] mb-1">{title}</h1>
          <p className="text-[#7a9a7e] text-[13.5px]">
            {count} {count === 1 ? "property" : "properties"} found in Osogbo, Osun State
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-7 py-7">
        {/* Filters */}
        <form method="GET" action="/properties" className="bg-white rounded-[14px] border border-[#ddeae0] p-5 mb-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[160px]">
              <label className="label">Search</label>
              <input name="search" defaultValue={searchParams.search} className="input" placeholder="Title, area..." />
            </div>
            <div className="min-w-[130px]">
              <label className="label">Purpose</label>
              <select name="purpose" defaultValue={searchParams.purpose} className="input">
                <option value="">All</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
            <div className="min-w-[130px]">
              <label className="label">Type</label>
              <select name="type" defaultValue={searchParams.type} className="input">
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="min-w-[150px]">
              <label className="label">Area</label>
              <select name="area" defaultValue={searchParams.area} className="input">
                <option value="">All Areas</option>
                {OSOGBO_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="min-w-[120px]">
              <label className="label">Max Price (₦)</label>
              <select name="maxPrice" defaultValue={searchParams.maxPrice} className="input">
                <option value="">Any</option>
                <option value="100000">Under 100k</option>
                <option value="300000">Under 300k</option>
                <option value="600000">Under 600k</option>
                <option value="1000000">Under 1M</option>
              </select>
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 h-[42px] px-5">
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>
            {Object.values(searchParams).some(Boolean) && (
              <Link href="/properties" className="text-[13px] font-semibold text-[#7a9a7e] hover:text-red-500 transition-colors h-[42px] flex items-center">
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* Ad Zone 1 — Top Banner */}
        <AdBanner className="mb-6" />

        {/* Results */}
        {properties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[14px] border border-[#ddeae0]">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-[18px] font-bold text-[#1C2B22] mb-2">No properties found</h3>
            <p className="text-[#7a9a7e] mb-5">Try adjusting your filters or search terms.</p>
            <Link href="/properties" className="btn-primary">Clear All Filters</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {properties.map((p: any, i: number) => (
                <>
                  <PropertyCard key={p.id} property={p} priority={i < 4} />
                  {/* Ad Zone 2 — In-Grid every 8 cards */}
                  {(i + 1) % 8 === 0 && i !== properties.length - 1 && (
                    <AdInFeed key={`ad-${i}`} />
                  )}
                </>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
                {page > 1 && (
                  <Link href={buildPageUrl(searchParams, page - 1)}
                    className="w-10 h-10 rounded-xl border border-[#D4E6DA] flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, idx, arr) => (
                    <>
                      {idx > 0 && arr[idx-1] < p - 1 && <span key={`e${p}`} className="text-[#9aaa9e] px-1">…</span>}
                      <Link key={p} href={buildPageUrl(searchParams, p)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-semibold transition-colors ${
                          p === page ? "bg-brand-600 text-white" : "border border-[#D4E6DA] text-[#4a6a52] hover:bg-white"
                        }`}>
                        {p}
                      </Link>
                    </>
                  ))
                }
                {page < totalPages && (
                  <Link href={buildPageUrl(searchParams, page + 1)}
                    className="w-10 h-10 rounded-xl border border-[#D4E6DA] flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </nav>
            )}
          </>
        )}

        {/* Ad Zone 3 — Bottom Banner */}
        <AdBanner className="mt-8" />
      </div>
    </div>
  );
}

function buildPageUrl(sp: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => { if (v && k !== "page") params.set(k, v); });
  params.set("page", String(page));
  return `/properties?${params.toString()}`;
}
<<<<<<< HEAD
=======

>>>>>>> 546f6298eb2e50e5fd6f66f60c33b2386a2d1f7e
