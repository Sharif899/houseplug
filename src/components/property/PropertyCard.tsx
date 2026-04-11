"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, CheckCircle, Bookmark } from "lucide-react";
import { useState } from "react";
import { formatPriceWithPeriod, getPropertyPlaceholder, timeAgo, cn } from "@/lib/utils";
import type { Property } from "@/types";

const WA_ICON = (
  <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const PHONE_ICON = (
  <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const img = (!imgErr && property.images?.length) ? property.images[0] : getPropertyPlaceholder(property.type);
  const phone = property.agent?.whatsapp || property.agent?.phone || "2348000000000";
  const waMsg = encodeURIComponent(`Hi, I saw "${property.title}" on HousePlug Osogbo and I'm interested. Can we talk?`);

  return (
    <div className="card group">
      {/* Image */}
      <Link href={`/properties/${property.slug}`}>
        <div className="relative h-[172px] overflow-hidden bg-[#c8ddd0]">
          <Image src={img} alt={property.title} fill priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            onError={() => setImgErr(true)} />

          {/* Price badge */}
          <div className="price-badge">
            {formatPriceWithPeriod(property.price, property.price_period, property.purpose)}
          </div>

          {/* Featured */}
          {property.is_featured && (
            <div className="absolute top-3 right-3 badge-featured">⭐ Featured</div>
          )}

          {/* Save */}
          <button onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
            className="absolute bottom-3 right-3 w-[30px] h-[30px] bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all">
            <Bookmark className={cn("w-4 h-4", saved ? "fill-brand-600 text-brand-600" : "text-gray-400")} />
          </button>
        </div>
      </Link>

      {/* Body */}
      <div className="p-3.5 pb-4">
        {/* Type row */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className={property.type === "shop" ? "badge-shop" : "badge-house"}>
            {property.type === "shop" ? "🏪" : property.type === "apartment" ? "🏢" : "🏠"} {property.type}
          </span>
          <span className={property.purpose === "rent" ? "badge-rent" : "badge-sale"}>
            For {property.purpose}
          </span>
        </div>

        <Link href={`/properties/${property.slug}`}>
          <h3 className="font-bold text-[15px] text-[#1C2B22] mb-1 leading-tight hover:text-brand-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-[12px] text-[#7a9a7e] mb-2 font-medium">
          <MapPin className="w-[12px] h-[12px] text-brand-500 flex-shrink-0" />
          <span className="line-clamp-1">{property.area}</span>
        </div>

        {(property.bedrooms || property.bathrooms) && (
          <div className="flex gap-3 text-[12px] text-[#7a9a7e] mb-2">
            {property.bedrooms  && <span className="flex items-center gap-1"><Bed  className="w-3 h-3" />{property.bedrooms} bed</span>}
            {property.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms} bath</span>}
          </div>
        )}

        <p className="text-[12px] text-[#8a9e8e] leading-[1.5] mb-3 line-clamp-2">{property.description}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="w-[34px] h-[34px] flex-shrink-0 bg-[#F4F8F5] border border-[#D4E6DA] rounded-[8px] flex items-center justify-center hover:bg-[#E0F0E6] hover:border-brand-500 transition-all"
            title="Save listing"
            onClick={() => setSaved(!saved)}>
            <Bookmark className={cn("w-[14px] h-[14px]", saved ? "fill-brand-600 text-brand-600" : "text-brand-500")} />
          </button>

          <a href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-600 text-white text-[12.5px] font-bold rounded-[8px] py-2 hover:bg-brand-500 transition-colors">
            {PHONE_ICON} Call
          </a>

          <a href={`https://wa.me/${phone.replace(/\D/g,"")}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="w-[34px] h-[34px] flex-shrink-0 bg-[#25D366] rounded-[8px] flex items-center justify-center hover:bg-[#1ebe5c] transition-colors text-white">
            {WA_ICON}
          </a>
        </div>

        {/* Agent */}
        <div className="mt-3 pt-3 border-t border-[#f0f5f1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[11px] font-bold flex-shrink-0">
              {property.agent?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="text-[12px] font-semibold text-[#4a6a52] flex items-center gap-1">
              {property.agent?.name || "Agent"}
              {property.agent?.is_verified && <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500" />}
            </span>
          </div>
          <span className="text-[11px] text-[#aab8ae]">{timeAgo(property.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-[14px] border border-[#ddeae0] overflow-hidden animate-pulse">
      <div className="h-[172px] bg-[#e4eee6]" />
      <div className="p-3.5 space-y-3">
        <div className="h-4 bg-[#e4eee6] rounded w-3/4" />
        <div className="h-3 bg-[#e4eee6] rounded w-1/2" />
        <div className="h-3 bg-[#e4eee6] rounded w-full" />
        <div className="h-3 bg-[#e4eee6] rounded w-full" />
        <div className="flex gap-2 pt-1">
          <div className="h-[34px] w-[34px] bg-[#e4eee6] rounded-[8px]" />
          <div className="h-[34px] flex-1 bg-[#e4eee6] rounded-[8px]" />
          <div className="h-[34px] w-[34px] bg-[#e4eee6] rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}
