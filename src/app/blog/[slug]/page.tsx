import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdBanner, AdInArticle, AdSidebar } from "@/components/ads/GoogleAdsense";
import { Clock, Tag, ArrowLeft, ArrowRight, Home } from "lucide-react";

interface Props { params: { slug: string } }

// ── Static blog content ────────────────────────────────────────────────────────
const POSTS: Record<string, {
  title: string; seoTitle: string; seoDesc: string;
  cover: string; tags: string[]; time: string; date: string;
  intro: string; sections: { heading: string; body: string }[];
}> = {
  "cheap-houses-in-osogbo": {
    title:    "Cheap Houses for Rent in Osogbo — Best Affordable Areas",
    seoTitle: "Cheap Houses for Rent in Osogbo 2024 | HousePlug",
    seoDesc:  "Find affordable houses for rent in Osogbo, Osun State. Compare prices across all major areas. Budget guide updated for 2024.",
    cover:    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85",
    tags:     ["Rent", "Budget", "Osogbo"],
    time:     "5 min read",
    date:     "2024-06-01",
    intro:    "Osogbo, the capital of Osun State, offers a wide range of housing options for every budget. Whether you are a student, young professional, or family, there are neighbourhoods where you can find decent accommodation without breaking the bank.",
    sections: [
      {
        heading: "Most Affordable Areas in Osogbo",
        body: "Oke-Fia remains one of the most popular areas for budget-conscious renters. A one-bedroom flat here typically rents for ₦80,000 to ₦150,000 per year. The area has good road access and is close to the city centre.\n\nIgbona is a highly residential area with a mix of old and new buildings. Single rooms start from ₦30,000 per year, one-bedroom flats from ₦80,000, and two-bedroom flats from ₦150,000 per year.\n\nAlekuwodo is one of the oldest parts of Osogbo and is ultra-affordable. Rent here can be as low as ₦50,000 per year for a decent room self-contain.\n\nIsale Aro is another traditional area with very low rents, popular with families looking for spacious accommodation at reasonable prices.\n\nSabo is popular with traders and working-class residents, offering moderate prices with good access to markets and transport.",
      },
      {
        heading: "Price Guide: What to Expect in 2024",
        body: "Room self-contain in budget areas costs between ₦40,000 and ₦80,000 per year, while mid-range areas charge ₦80,000 to ₦150,000.\n\nA one-bedroom flat in budget areas ranges from ₦80,000 to ₦150,000 per year, while mid-range areas charge ₦150,000 to ₦300,000.\n\nTwo-bedroom flats in budget areas go for ₦150,000 to ₦300,000 per year, with mid-range options from ₦300,000 to ₦600,000.\n\nThree-bedroom flats or bungalows in budget areas range from ₦250,000 to ₦500,000 per year, with mid-range options from ₦500,000 to ₦1,000,000.",
      },
      {
        heading: "Tips for Finding Cheap Houses in Osogbo",
        body: "Always avoid middlemen and use HousePlug Osogbo to contact agents directly via WhatsApp — this saves you agency fees.\n\nAlways visit properties in person before paying any money. Never send money without seeing the property yourself.\n\nNegotiate with landlords. They often accept lower offers, especially if you can pay a full year upfront.\n\nAlways check amenities first. Confirm running water supply, electricity access, and security before signing any agreement.\n\nGet a proper tenancy agreement. Always insist on a signed agreement to protect yourself legally.",
      },
      {
        heading: "Ready to Start Your Search?",
        body: "Browse our verified listings for affordable houses in Osogbo today. All agents are contactable directly via WhatsApp — no middlemen, no hidden fees. Use our filters to search by area, price, and property type to find exactly what you need.",
      },
    ],
  },

  "shops-for-rent-in-osogbo": {
    title:    "Shops for Rent in Osogbo — Complete Business Location Guide",
    seoTitle: "Shops for Rent in Osogbo 2024 | Commercial Space | HousePlug",
    seoDesc:  "Find the best shops and commercial spaces for rent in Osogbo, Osun State. Compare prices across all major business areas.",
    cover:    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=85",
    tags:     ["Commercial", "Shops", "Business"],
    time:     "7 min read",
    date:     "2024-05-20",
    intro:    "Osogbo's commercial landscape is growing rapidly, driven by the state government's development agenda and the steady growth of small and medium enterprises. Whether you are opening a retail outlet, office, or warehouse, location is everything.",
    sections: [
      {
        heading: "Top Commercial Areas in Osogbo",
        body: "Olaiya Junction and Old Garage form the busiest commercial hub in Osogbo. Shops here command premium rents but offer maximum foot traffic. Ideal for retail, telecoms, fashion, and food businesses. Average rent is ₦300,000 to ₦800,000 per year for a standard shop.\n\nIgbona Market Area is a dense trading area popular with fabric sellers, hardware merchants, and food traders. More affordable than Olaiya with strong foot traffic. Average rent is ₦150,000 to ₦400,000 per year.\n\nAtaoja Shopping Complex is a modern facility with good amenities, suitable for boutiques, salons, and professional services. Average rent is ₦200,000 to ₦500,000 per year.\n\nStadium Road is excellent for service businesses, restaurants, and offices. Good access and parking. Average rent is ₦120,000 to ₦300,000 per year.\n\nGbongan Road and Ilesha Road are great for auto-spare parts, building materials, and wholesale businesses due to heavy vehicle traffic. Average rent is ₦100,000 to ₦250,000 per year.",
      },
      {
        heading: "What to Look For When Renting a Shop",
        body: "Foot traffic is the most important factor. Research how many people walk past the location daily before committing.\n\nCheck for competition in the area. Too many similar businesses nearby could hurt your sales.\n\nElectricity access is critical. Check if there is a transformer nearby or if you will need generator backup.\n\nAccessibility matters. Make sure customers can easily reach and park near your shop.\n\nAlways ask about expansion potential. Find out if you can take over adjoining spaces if your business grows.",
      },
      {
        heading: "How to Get the Best Deal",
        body: "Contact agents directly via WhatsApp through HousePlug Osogbo to avoid paying unnecessary agency fees. Always negotiate the rent — landlords in Osogbo are usually open to discussion, especially for longer lease periods. Paying two or three years upfront often unlocks significant discounts. Always get a proper commercial tenancy agreement before making any payment.",
      },
    ],
  },

  "best-areas-to-live-in-osogbo": {
    title:    "Best Areas to Live in Osogbo in 2024",
    seoTitle: "Best Residential Areas in Osogbo 2024 | Neighbourhood Guide",
    seoDesc:  "Where should you live in Osogbo? We rank the top neighbourhoods by safety, amenities, schools, and property prices.",
    cover:    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85",
    tags:     ["Neighbourhood", "Guide", "2024"],
    time:     "8 min read",
    date:     "2024-05-10",
    intro:    "Choosing where to live in Osogbo depends on your lifestyle, budget, and priorities. Here is our honest ranking of the top areas, covering safety, infrastructure, schools, markets, and overall livability.",
    sections: [
      {
        heading: "1. Dada Estate — Best Overall",
        body: "Dada Estate is widely considered Osogbo's most desirable residential address. It features well-planned streets and good drainage, relatively stable electricity supply, proximity to the GRA (Government Reserved Area), low crime rates, and easy access to schools and hospitals. Price range for annual rent: ₦400,000 to ₦1,500,000. The main drawback is higher rent compared to most areas.",
      },
      {
        heading: "2. Ogo-Oluwa Area — Best for Middle-Class Families",
        body: "A well-developed suburb with a mix of residential and light commercial properties. Ogo-Oluwa features a good road network and growing infrastructure, making it ideal for middle-class families. Annual rent ranges from ₦200,000 to ₦600,000, offering good value for the quality of living available.",
      },
      {
        heading: "3. Stadium Road — Best for Young Professionals",
        body: "Close to the Osun State Stadium, government offices, and commercial areas. Stadium Road has active nightlife and easy access to the city centre, making it perfect for young professionals and singles. Annual rent ranges from ₦150,000 to ₦500,000.",
      },
      {
        heading: "4. Powerline and Lameco — Best Value",
        body: "A growing residential corridor with improving infrastructure. Good for those who want space and relative quiet while staying connected to the city. Annual rent ranges from ₦120,000 to ₦350,000, making it one of the best value options in Osogbo.",
      },
      {
        heading: "5. Osun State University Area — Best for Students",
        body: "The university has transformed this corridor significantly. It offers good transport links, affordable food options, and a young and vibrant community. Annual rent ranges from ₦80,000 to ₦250,000, making it the most affordable quality option for students and young couples.",
      },
      {
        heading: "Areas to Watch in 2025",
        body: "Burna is seeing new road constructions that are making it increasingly attractive to residents. The Gbongan Road corridor is experiencing industrial and commercial growth that is driving residential demand. Ede Road is also seeing growing middle-class residential development that is worth watching for investors.",
      },
    ],
  },

  "property-prices-osogbo-2024": {
    title:    "Property Prices in Osogbo — 2024 Market Report",
    seoTitle: "Property Prices in Osogbo 2024 | Market Report | HousePlug",
    seoDesc:  "Comprehensive 2024 property price guide for Osogbo, Osun State. Average rents and sale prices for houses, apartments, shops, and land.",
    cover:    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=85",
    tags:     ["Market", "Prices", "Report"],
    time:     "10 min read",
    date:     "2024-04-25",
    intro:    "The Osogbo real estate market has shown resilience and steady growth through 2024, driven by urbanisation, growing student population, and increasing commercial activity across the state capital.",
    sections: [
      {
        heading: "Residential Rental Prices — Annual",
        body: "Room self-contain in budget areas such as Oke-Fia and Igbona costs between ₦40,000 and ₦90,000 per year. Mid-range areas charge ₦90,000 to ₦180,000, while premium areas like Dada Estate charge ₦180,000 to ₦300,000.\n\nOne-bedroom flats range from ₦80,000 to ₦150,000 in budget areas, ₦150,000 to ₦300,000 in mid-range areas, and ₦300,000 to ₦600,000 in premium areas.\n\nTwo-bedroom flats range from ₦150,000 to ₦300,000 in budget areas, ₦300,000 to ₦600,000 in mid-range areas, and ₦600,000 to ₦1,200,000 in premium areas.\n\nThree-bedroom flats or bungalows start from ₦250,000 in budget areas and go up to ₦2,500,000 in premium locations.",
      },
      {
        heading: "Commercial Property Rental Prices — Annual",
        body: "Small shops under 20 square metres in budget areas cost ₦80,000 to ₦200,000 per year, while prime locations charge ₦200,000 to ₦500,000. Medium shops from 20 to 50 square metres cost ₦150,000 to ₦350,000 in budget areas and ₦350,000 to ₦800,000 in prime locations. Large shops over 50 square metres range from ₦300,000 to ₦600,000 in budget areas and ₦600,000 to ₦1,500,000 in prime locations.",
      },
      {
        heading: "Property Sale Prices",
        body: "Land prices vary significantly by location. In the outskirts and rural fringe, land costs ₦500,000 to ₦2,000,000 per plot. Residential suburbs charge ₦2,000,000 to ₦8,000,000 per plot. Prime areas such as Dada Estate and the GRA charge ₦8,000,000 to ₦30,000,000 per plot.\n\nCompleted buildings for sale start at ₦8,000,000 for a two-bedroom bungalow and go up to ₦100,000,000 or more for a four-bedroom duplex in premium locations.",
      },
      {
        heading: "Key Market Trends for 2024",
        body: "Year-on-year rental increases of 15 to 25 percent have been recorded due to inflation and increasing demand. There is currently a significant supply shortfall with demand exceeding available housing stock across all price ranges. Student housing demand near the UNIOSUN campus has grown by more than 30 percent year-on-year. Land banking remains very active with investors purchasing peripheral land for future development as infrastructure improves.",
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = POSTS[params.slug];
  if (!post) return { title: "Article Not Found" };
  return {
    title:       post.seoTitle,
    description: post.seoDesc,
    openGraph:   { title: post.seoTitle, description: post.seoDesc, images: [{ url: post.cover }], type: "article" },
    alternates:  { canonical: `/blog/${params.slug}` },
  };
}

export function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

// Related posts
const RELATED = [
  { slug:"cheap-houses-in-osogbo",       title:"Cheap Houses in Osogbo" },
  { slug:"shops-for-rent-in-osogbo",     title:"Shops for Rent" },
  { slug:"best-areas-to-live-in-osogbo", title:"Best Areas to Live" },
  { slug:"property-prices-osogbo-2024",  title:"Property Prices 2024" },
];

export default function BlogPostPage({ params }: Props) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  const related = RELATED.filter(r => r.slug !== params.slug).slice(0, 3);

  return (
    <div className="bg-[#F4F8F5] min-h-screen">

      {/* Hero Image */}
      <div className="relative h-64 md:h-[380px] overflow-hidden bg-gray-900">
        <img src={post.cover} alt={post.title}
          className="w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-7 pb-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map(t => (
              <span key={t} className="flex items-center gap-1 bg-white/20 text-white backdrop-blur-sm text-[11.5px] font-bold px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" />{t}
              </span>
            ))}
          </div>
          <h1 className="font-extrabold text-[22px] md:text-[34px] text-white leading-tight mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/65 text-[12.5px]">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.time}</span>
            <span>{new Date(post.date).toLocaleDateString("en-NG", { month:"long", day:"numeric", year:"numeric" })}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-7 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-[#7a9a7e] mb-7">
          <Link href="/" className="hover:text-brand-500 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-500 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#1C2B22] line-clamp-1">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── ARTICLE ─────────────────────────────────────── */}
          <article className="lg:col-span-2 space-y-5">

            {/* Intro */}
            <div className="bg-white rounded-[14px] border border-[#ddeae0] p-7">
              <p className="text-[15px] text-[#4a6a52] leading-[1.85] font-medium">{post.intro}</p>
            </div>

            {/* Sections with ad injected at middle */}
            {post.sections.map((section, i) => (
              <div key={i}>
                {/* Inject in-article ad after first half of sections */}
                {i === Math.floor(post.sections.length / 2) && (
                  <AdInArticle className="my-5" />
                )}
                <div className="bg-white rounded-[14px] border border-[#ddeae0] p-7">
                  <h2 className="text-[18px] font-extrabold text-[#1C2B22] mb-4 pb-3 border-b border-[#eef3ef]">
                    {section.heading}
                  </h2>
                  <div className="space-y-3">
                    {section.body.split("\n\n").map((para, j) => (
                      <p key={j} className="text-[13.5px] text-[#5a7a62] leading-[1.85]">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="bg-brand-600 rounded-[14px] p-7 text-white">
              <h3 className="text-[18px] font-extrabold mb-2">Find Properties in Osogbo</h3>
              <p className="text-white/70 text-[13.5px] mb-5 leading-relaxed">
                Browse hundreds of verified listings and connect with agents directly via WhatsApp. No middlemen, no hidden fees.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/properties" className="btn-gold flex items-center gap-2">
                  Browse Listings <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/requests" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-semibold text-[13.5px] rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                  Post a Request
                </Link>
              </div>
            </div>

            {/* End of article ad */}
            <AdBanner />

            {/* Navigation */}
            <Link href="/blog" className="flex items-center gap-2 text-[13px] font-semibold text-brand-500 hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Articles
            </Link>
          </article>

          {/* ── SIDEBAR ─────────────────────────────────────── */}
          <aside className="space-y-5">

            {/* Sidebar ad */}
            <AdSidebar />

            {/* Related articles */}
            <div className="bg-white rounded-[14px] border border-[#ddeae0] p-5">
              <h3 className="text-[14px] font-extrabold text-[#1C2B22] mb-4">Related Articles</h3>
              <div className="space-y-3">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`}
                    className="flex items-center gap-2 text-[13px] text-[#4a6a52] hover:text-brand-600 transition-colors py-2 border-b border-[#f5f8f5] last:border-0 group">
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-[14px] border border-[#ddeae0] p-5">
              <h3 className="text-[14px] font-extrabold text-[#1C2B22] mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href:"/properties?purpose=rent", label:"Houses for Rent" },
                  { href:"/properties?purpose=sale", label:"Houses for Sale" },
                  { href:"/properties?type=shop",    label:"Shops for Rent" },
                  { href:"/requests",                label:"Post a Property Request" },
                  { href:"/auth/signup",             label:"List Your Property Free" },
                ].map(l => (
                  <Link key={l.href} href={l.href}
                    className="flex items-center gap-2 text-[12.5px] text-[#4a6a52] hover:text-brand-600 transition-colors py-1.5 border-b border-[#f5f8f5] last:border-0">
                    <ArrowRight className="w-3 h-3 text-brand-400 flex-shrink-0" />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Second sidebar ad */}
            <AdSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 546f6298eb2e50e5fd6f66f60c33b2386a2d1f7e
