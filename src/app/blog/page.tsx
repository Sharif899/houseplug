import type { Metadata } from "next";
import Link from "next/link";
import { AdBanner } from "@/components/ads/GoogleAdsense";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Real Estate Blog — Osogbo Property Tips & Guides",
  description: "Expert guides on renting and buying property in Osogbo, Osun State. Price guides, best areas, and tips.",
};

const POSTS = [
  { slug:"cheap-houses-in-osogbo",      title:"Cheap Houses for Rent in Osogbo — Best Affordable Areas",     excerpt:"Looking for affordable houses in Osogbo? We've compiled the best areas and what you can expect to pay in 2024.",       cover:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80", tags:["Rent","Budget"],    time:"5 min" },
  { slug:"shops-for-rent-in-osogbo",    title:"Shops for Rent in Osogbo — Complete Business Location Guide", excerpt:"Finding the right shop location can make or break your business. Here's our guide to commercial spaces across Osogbo.", cover:"https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",tags:["Shops","Business"], time:"7 min" },
  { slug:"best-areas-to-live-in-osogbo",title:"Best Areas to Live in Osogbo in 2024",                        excerpt:"We rank the top neighbourhoods based on amenities, safety, transport, and property prices.",                          cover:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", tags:["Areas","Guide"],    time:"8 min" },
  { slug:"property-prices-osogbo-2024", title:"Property Prices in Osogbo — 2024 Market Report",             excerpt:"How much does it cost to rent or buy in Osogbo today? Full price guide for houses, shops, and land.",                cover:"https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80", tags:["Prices","Market"],  time:"10 min"},
];

export default function BlogPage() {
  const [featured, ...rest] = POSTS;
  return (
    <div className="bg-[#F4F8F5] min-h-screen">
      <div className="bg-white border-b border-[#ddeae0] py-10 px-7">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[32px] font-extrabold text-[#1C2B22] mb-2">Real Estate Blog</h1>
          <p className="text-[#7a9a7e]">Guides, market reports, and tips for property in Osogbo.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-7 py-10">
        <AdBanner className="mb-8" />
        {/* Featured */}
        <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 rounded-[14px] overflow-hidden border border-[#ddeae0] mb-8 bg-white hover:shadow-card-hover transition-all">
          <div className="relative h-56 lg:h-auto overflow-hidden bg-[#D4E6DA]">
            <img src={featured.cover} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex gap-2 mb-3">{featured.tags.map(t=><span key={t} className="badge-house">{t}</span>)}</div>
            <h2 className="text-[22px] font-extrabold text-[#1C2B22] mb-3 group-hover:text-brand-600 transition-colors leading-tight">{featured.title}</h2>
            <p className="text-[#7a9a7e] text-[13.5px] leading-relaxed mb-5">{featured.excerpt}</p>
            <span className="flex items-center gap-2 text-brand-500 font-bold text-[13px]">
              Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {rest.map(p=>(
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white rounded-[14px] border border-[#ddeae0] overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all">
              <div className="relative h-44 overflow-hidden bg-[#D4E6DA]">
                <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex gap-1.5 mb-2">{p.tags.map(t=><span key={t} className="badge bg-[#F4F8F5] text-[#4a6a52]">{t}</span>)}</div>
                <h3 className="font-extrabold text-[15px] text-[#1C2B22] mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">{p.title}</h3>
                <p className="text-[12px] text-[#9aaa9e] flex items-center gap-1"><Clock className="w-3 h-3" />{p.time} read</p>
              </div>
            </Link>
          ))}
        </div>
        <AdBanner />
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 546f6298eb2e50e5fd6f66f60c33b2386a2d1f7e
