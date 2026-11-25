"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { OSOGBO_AREAS, PROPERTY_TYPES } from "@/types";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { label:"Any Price",      min:undefined,  max:undefined  },
  { label:"Under ₦100k",   min:undefined,  max:100000     },
  { label:"₦100k–₦300k",  min:100000,     max:300000     },
  { label:"₦300k–₦600k",  min:300000,     max:600000     },
  { label:"₦600k–₦1M",    min:600000,     max:1000000    },
  { label:"Above ₦1M",     min:1000000,    max:undefined  },
];

export function PropertyFilters({ className }: { className?: string }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const cur = {
    search:  searchParams.get("search")   || "",
    type:    searchParams.get("type")     || "",
    purpose: searchParams.get("purpose")  || "",
    area:    searchParams.get("area")     || "",
    min:     searchParams.get("minPrice") || "",
    max:     searchParams.get("maxPrice") || "",
  };

  const activeCount = [cur.type, cur.purpose, cur.area, cur.min || cur.max].filter(Boolean).length;

  const set = useCallback((key: string, val: string | undefined) => {
    const p = new URLSearchParams(searchParams.toString());
    val ? p.set(key, val) : p.delete(key);
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const clearAll = () => router.push(pathname, { scroll: false });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
    set("search", q || undefined);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-2.5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aaa9e]" />
          <input name="search" defaultValue={cur.search}
            placeholder="Search title, area, description..."
            className="input pl-10 pr-4 w-full" />
        </form>
        <button onClick={() => setOpen(!open)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] font-semibold text-[13px] transition-all",
            open || activeCount > 0 ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-[#D4E6DA] text-[#4a6a52] hover:border-brand-400"
          )}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-white text-brand-600 rounded-full text-[10px] font-extrabold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        {activeCount > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl border-[1.5px] border-[#D4E6DA] text-[#7a9a7e] text-[13px] hover:bg-[#F4F8F5] transition-colors">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 p-4 bg-white border border-[#ddeae0] rounded-[14px] shadow-card animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Purpose */}
            <div>
              <label className="label">Purpose</label>
              <div className="flex gap-2">
                {[["","All"],["rent","Rent"],["sale","Sale"]].map(([v,l])=>(
                  <button key={v} onClick={() => set("purpose", v || undefined)}
                    className={cn("flex-1 py-2 px-2 rounded-lg text-[12.5px] font-semibold border-[1.5px] transition-all",
                      cur.purpose === v ? "bg-brand-600 text-white border-brand-600" : "bg-[#F4F8F5] text-[#4a6a52] border-[#D4E6DA] hover:border-brand-400"
                    )}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Type */}
            <div>
              <label className="label">Property Type</label>
              <select value={cur.type} onChange={e => set("type", e.target.value || undefined)} className="input">
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            {/* Area */}
            <div>
              <label className="label">Area</label>
              <select value={cur.area} onChange={e => set("area", e.target.value || undefined)} className="input">
                <option value="">All Areas</option>
                {OSOGBO_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            {/* Price */}
            <div>
              <label className="label">Price Range</label>
              <select
                value={`${cur.min}-${cur.max}`}
                onChange={e => {
                  const [mn, mx] = e.target.value.split("-");
                  set("minPrice", mn || undefined);
                  set("maxPrice", mx || undefined);
                }}
                className="input">
                {PRICE_RANGES.map(r => (
                  <option key={r.label} value={`${r.min??""}-${r.max??""}`}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
