import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPriceWithPeriod, buildWhatsAppURL, getPropertyPlaceholder } from "@/lib/utils";
import { AdBanner, AdInArticle, AdSidebar } from "@/components/ads/GoogleAdsense";
import { PropertyCard } from "@/components/property/PropertyCard";
import {
  MapPin, Bed, Bath, Maximize2, CheckCircle,
  Phone, Share2, Eye, Calendar, Star, ArrowLeft
} from "lucide-react";

interface Props { params: { slug: string } }

async function getProperty(slug: string) {
  try {
    const sb = createClient();
    const { data } = await sb.from("properties")
      .select("*, agent:users!agent_id(id,name,phone,whatsapp,is_verified,bio)")
      .eq("slug", slug).eq("is_available", true).single();
    if (data) await sb.rpc("increment_property_views", { property_id: data.id });
    return data;
  } catch { return null; }
}

async function getSimilar(type: string, area: string, excludeId: string) {
  try {
    const sb = createClient();
    const { data } = await sb.from("properties")
      .select("*, agent:users!agent_id(id,name,phone,whatsapp,is_verified)")
      .eq("type", type).eq("area", area).eq("is_available", true)
      .neq("id", excludeId).limit(4);
    return data || [];
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProperty(params.slug);
  if (!p) return { title: "Property Not Found" };
  return {
    title: `${p.title} — ${p.area}, Osogbo`,
    description: p.description.slice(0, 155),
    openGraph: { title: p.title, images: p.images?.length ? [{ url: p.images[0] }] : [] },
  };
}

const WA_SVG = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default async function PropertyDetailPage({ params }: Props) {
  const property = await getProperty(params.slug);
  if (!property) notFound();

  const similar = await getSimilar(property.type, property.area, property.id);
  const phone   = property.agent?.whatsapp || property.agent?.phone || "2348000000000";
  const waUrl   = buildWhatsAppURL(phone,
    `Hi ${property.agent?.name || "Agent"}, I saw "${property.title}" on HousePlug Osogbo and I'm interested. Can we talk?`
  );
  const images  = property.images?.length ? property.images : [getPropertyPlaceholder(property.type)];

  return (
    <div className="bg-[#F4F8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-7 py-7">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-[#7a9a7e] mb-5">
          <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-brand-500">Properties</Link>
          <span>/</span>
          <Link href={`/properties?area=${property.area}`} className="hover:text-brand-500">{property.area}</Link>
          <span>/</span>
          <span className="text-[#1C2B22] line-clamp-1">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image Gallery */}
            <div className="bg-white rounded-[14px] border border-[#ddeae0] overflow-hidden">
              <div className="relative h-[320px] md:h-[420px]">
                <Image src={images[0]} alt={property.title} fill priority
                  className="object-cover" sizes="(max-width:1024px) 100vw, 66vw" />
                {property.is_featured && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-gold-400 text-gray-900 text-[12px] font-bold px-3 py-1.5 rounded-[7px]">
                    <Star className="w-3.5 h-3.5 fill-current" /> Featured
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide bg-[#F9FCF9]">
                  {images.map((img: string, i: number) => (
                    <div key={i} className="relative flex-shrink-0 w-20 h-16 rounded-[8px] overflow-hidden border-2 border-[#D4E6DA]">
                      <Image src={img} alt={`${property.title} ${i+1}`} fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-[14px] border border-[#ddeae0] p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={property.type === "shop" ? "badge-shop" : "badge-house"}>
                  {property.type === "shop" ? "🏪" : "🏠"} {property.type}
                </span>
                <span className={property.purpose === "rent" ? "badge-rent" : "badge-sale"}>
                  For {property.purpose}
                </span>
              </div>

              <h1 className="text-[24px] md:text-[28px] font-extrabold text-[#1C2B22] mb-2 leading-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-[#7a9a7e] text-[13px] mb-4">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>{property.address || property.area}, Osogbo, Osun State</span>
              </div>

              <div className="text-[30px] font-extrabold text-brand-600 mb-5">
                {formatPriceWithPeriod(property.price, property.price_period, property.purpose)}
                {property.purpose === "rent" && (
                  <span className="text-[14px] text-[#9aaa9e] font-medium ml-2">per annum</span>
                )}
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-6 py-4 border-y border-[#eef3ef]">
                {property.bedrooms && (
                  <div className="flex items-center gap-2 text-[#4a6a52]">
                    <Bed className="w-5 h-5 text-brand-400" />
                    <div><p className="font-bold text-[#1C2B22]">{property.bedrooms}</p><p className="text-[11px] text-[#9aaa9e]">Bedrooms</p></div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2 text-[#4a6a52]">
                    <Bath className="w-5 h-5 text-brand-400" />
                    <div><p className="font-bold text-[#1C2B22]">{property.bathrooms}</p><p className="text-[11px] text-[#9aaa9e]">Bathrooms</p></div>
                  </div>
                )}
                {property.size_sqm && (
                  <div className="flex items-center gap-2 text-[#4a6a52]">
                    <Maximize2 className="w-5 h-5 text-brand-400" />
                    <div><p className="font-bold text-[#1C2B22]">{property.size_sqm}m²</p><p className="text-[11px] text-[#9aaa9e]">Area</p></div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#4a6a52]">
                  <Eye className="w-5 h-5 text-brand-400" />
                  <div><p className="font-bold text-[#1C2B22]">{property.views}</p><p className="text-[11px] text-[#9aaa9e]">Views</p></div>
                </div>
                <div className="flex items-center gap-2 text-[#4a6a52]">
                  <Calendar className="w-5 h-5 text-brand-400" />
                  <div>
                    <p className="font-bold text-[#1C2B22]">{new Date(property.created_at).toLocaleDateString("en-NG",{month:"short",day:"numeric"})}</p>
                    <p className="text-[11px] text-[#9aaa9e]">Listed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[14px] border border-[#ddeae0] p-6">
              <h2 className="text-[17px] font-extrabold text-[#1C2B22] mb-4">Description</h2>
              <p className="text-[13.5px] text-[#5a7a62] leading-[1.8] whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-[14px] border border-[#ddeae0] p-6">
                <h2 className="text-[17px] font-extrabold text-[#1C2B22] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-2 text-[13px] text-[#4a6a52]">
                      <CheckCircle className="w-4 h-4 text-green-500 fill-green-500 flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AD ZONE 1 — In-Article (highest RPM) */}
            <AdInArticle />

            <Link href="/properties" className="flex items-center gap-2 text-[13px] font-semibold text-brand-500 hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to all listings
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact Card — sticky */}
            <div className="bg-white rounded-[14px] border border-[#ddeae0] p-5 sticky top-[80px]">
              <h3 className="text-[15px] font-bold text-[#1C2B22] mb-4">Contact Agent</h3>

              {/* Agent info */}
              <div className="flex items-center gap-3 p-3.5 bg-[#F4F8F5] rounded-xl mb-5">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg flex-shrink-0">
                  {property.agent?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="font-bold text-[#1C2B22] flex items-center gap-1 text-[14px]">
                    {property.agent?.name || "Agent"}
                    {property.agent?.is_verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                    )}
                  </p>
                  <p className="text-[12px] text-[#7a9a7e]">
                    {property.agent?.is_verified ? "✓ Verified Agent" : "Property Agent"}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold rounded-xl transition-colors shadow-sm">
                  {WA_SVG} Chat on WhatsApp
                </a>
                {property.agent?.phone && (
                  <a href={`tel:${property.agent.phone}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#D4E6DA] text-[#4a6a52] font-semibold rounded-xl hover:border-brand-400 hover:text-brand-600 transition-colors">
                    <Phone className="w-4 h-4" /> Call Agent
                  </a>
                )}
                <button className="w-full flex items-center justify-center gap-2 py-3 text-[#9aaa9e] text-[13px] hover:text-[#4a6a52] transition-colors">
                  <Share2 className="w-4 h-4" /> Share Listing
                </button>
              </div>

              <p className="mt-4 text-[11px] text-[#9aaa9e] text-center leading-relaxed">
                ⚠️ Never send money before viewing. Report suspicious listings.
              </p>
            </div>

            {/* AD ZONE 2 — Sidebar Rectangle (300×250) */}
            <AdSidebar />
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[19px] font-extrabold text-brand-600 mb-5">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p: any) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </section>
        )}

        {/* AD ZONE 3 — Bottom Banner */}
        <AdBanner className="mt-10" />
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 546f6298eb2e50e5fd6f66f60c33b2386a2d1f7e
