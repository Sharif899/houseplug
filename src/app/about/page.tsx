import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Users, Home, Star, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "About HousePlug Osogbo — Nigeria's Trusted Property Platform",
  description: "Learn about HousePlug Osogbo — the fastest-growing real estate platform for Osogbo, Osun State, Nigeria.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#F4F8F5] min-h-screen">

      {/* Hero */}
      <div className="bg-brand-600 px-7 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-white mb-4">
            About HousePlug Osogbo
          </h1>
          <p className="text-white/70 text-[15px] leading-[1.85] max-w-xl mx-auto">
            We are building the most trusted, fastest, and simplest way to find and list properties
            in Osogbo, Osun State, Nigeria.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-7 py-14">

        {/* Mission */}
        <div className="bg-white rounded-[14px] border border-[#ddeae0] p-8 mb-8">
          <h2 className="text-[22px] font-extrabold text-[#1C2B22] mb-4">Our Mission</h2>
          <p className="text-[14px] text-[#5a7a62] leading-[1.85] mb-4">
            Finding a home or shop in Osogbo used to mean driving around, asking neighbours,
            paying middlemen, and hoping for the best. We built HousePlug Osogbo to change that.
          </p>
          <p className="text-[14px] text-[#5a7a62] leading-[1.85]">
            Our platform connects property seekers directly with verified agents and landlords
            via WhatsApp — no middlemen, no hidden fees, no wasted trips. Just find what you
            need and talk directly to the person who can help you.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon:<Home className="w-6 h-6" />,        n:"500+",  l:"Properties Listed" },
            { icon:<Users className="w-6 h-6" />,       n:"100+",  l:"Verified Agents" },
            { icon:<MessageSquare className="w-6 h-6" />,n:"1,200+",l:"WhatsApp Connections" },
            { icon:<Star className="w-6 h-6" />,        n:"20+",   l:"Areas Covered" },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-[14px] border border-[#ddeae0] p-5 text-center shadow-card">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mx-auto mb-3">{s.icon}</div>
              <p className="text-[24px] font-extrabold text-[#1C2B22]">{s.n}</p>
              <p className="text-[12px] text-[#7a9a7e] font-medium">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Why us */}
        <div className="bg-white rounded-[14px] border border-[#ddeae0] p-8 mb-8">
          <h2 className="text-[22px] font-extrabold text-[#1C2B22] mb-6">Why HousePlug?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title:"Direct WhatsApp Contact",  desc:"Talk directly to agents and landlords. No gatekeepers, no delays." },
              { title:"Verified Agents",           desc:"Every agent on our platform is verified with a valid ID and track record." },
              { title:"Free to List",              desc:"Agents can list properties completely free. We make money on premium features." },
              { title:"Osogbo-Focused",            desc:"We know Osogbo. Every area, every street, every market. This is our home." },
              { title:"Request Board",             desc:"Post what you need and agents come to you. No more endless searching." },
              { title:"SEO-Optimised Listings",    desc:"Your listings rank on Google so buyers find you organically." },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3 p-4 bg-[#F4F8F5] rounded-xl">
                <CheckCircle className="w-5 h-5 text-brand-500 fill-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1C2B22] text-[14px]">{f.title}</p>
                  <p className="text-[12.5px] text-[#7a9a7e] mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-600 rounded-[14px] p-8 text-center">
          <h2 className="text-[22px] font-extrabold text-white mb-3">Ready to Get Started?</h2>
          <p className="text-white/70 text-[14px] mb-6">Browse listings or post your property for free today.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/properties" className="btn-gold px-8 py-3">Browse Properties</Link>
            <Link href="/auth/signup" className="px-8 py-3 bg-white/10 text-white font-semibold text-[13.5px] rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              List Your Property Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
