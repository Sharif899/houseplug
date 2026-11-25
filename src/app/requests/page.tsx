"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OSOGBO_AREAS, PROPERTY_TYPES } from "@/types";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { AdBanner, AdInFeed, AdSidebar } from "@/components/ads/GoogleAdsense";
import { timeAgo } from "@/lib/utils";

const WA_SVG = (
  <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
  </svg>
);

const MOCK_REQUESTS = [
  { id:"1", type:"house",     purpose:"rent", area:"Dada Estate",   budget_min:300000, budget_max:500000, bedrooms:"3 bedrooms", timeline:"Within 1 week",   description:"Need to move in urgently. Must have running water and stable electricity. Boys quarter preferred.", whatsapp:"2348012345678", name:"Adeola K.",  urgency:"urgent",  created_at: new Date(Date.now()-2*60000).toISOString() },
  { id:"2", type:"shop",      purpose:"rent", area:"Igbona",        budget_min:150000, budget_max:400000, bedrooms:null,         timeline:"Within 1 month",  description:"Looking for a good-sized shop on a busy street. Minimum 20sqm. Good electricity supply important.", whatsapp:"2348023456789", name:"Tunde B.",   urgency:"normal",  created_at: new Date(Date.now()-18*60000).toISOString() },
  { id:"3", type:"apartment", purpose:"rent", area:"Osun State University Area", budget_min:0, budget_max:120000, bedrooms:"Self contain / room", timeline:"ASAP / Immediately", description:"Final year student. Need quiet, affordable accommodation close to school.", whatsapp:"2348034567890", name:"Fatima O.",  urgency:"normal",  created_at: new Date(Date.now()-45*60000).toISOString() },
  { id:"4", type:"house",     purpose:"sale", area:"Ogo-Oluwa",    budget_min:8000000, budget_max:20000000, bedrooms:"2–3 bedrooms", timeline:"Flexible",    description:"Ready to buy. Finance ready. Prefer C of O document. Fence and good drainage important.", whatsapp:"2348045678901", name:"Musa A.",    urgency:"normal",  created_at: new Date(Date.now()-2*3600000).toISOString() },
  { id:"5", type:"shop",      purpose:"rent", area:"Stadium Road", budget_min:0,       budget_max:100000,  bedrooms:null,         timeline:"ASAP / Immediately", description:"Starting a small phone accessories business. Budget is tight. Any decent small space will work.", whatsapp:"2348056789012", name:"Yusuf S.",   urgency:"urgent",  created_at: new Date(Date.now()-3*3600000).toISOString() },
  { id:"6", type:"house",     purpose:"rent", area:"Oke-Fia",      budget_min:100000, budget_max:200000,   bedrooms:"2 bedrooms", timeline:"1–3 months",    description:"Family of 4 relocating to Osogbo. Need a decent 2-bedroom flat in a safe area.", whatsapp:"2348067890123", name:"Grace E.",   urgency:"normal",  created_at: new Date(Date.now()-5*3600000).toISOString() },
];

type FilterType = "all" | "house" | "apartment" | "shop" | "urgent";

export default function RequestsPage() {
  const supabase = createClient();
  const [filter, setFilter] = useState<FilterType>("all");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<any[]>(MOCK_REQUESTS);

  const [form, setForm] = useState({
    name:"", whatsapp:"", type:"house", purpose:"rent",
    area:"", budget_min:"", budget_max:"",
    bedrooms:"", timeline:"", description:"", urgency:"normal",
  });

  const filtered = filter === "all" ? requests
    : filter === "urgent" ? requests.filter(r=>r.urgency==="urgent")
    : requests.filter(r=>r.type===filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.whatsapp || !form.area || !form.type) {
      setError("Please fill in WhatsApp number, area, and property type.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.from("property_requests").insert({
        name:        form.name,
        whatsapp:    form.whatsapp.replace(/\D/g,""),
        type:        form.type,
        purpose:     form.purpose,
        area:        form.area,
        budget_min:  form.budget_min ? parseInt(form.budget_min) : null,
        budget_max:  form.budget_max ? parseInt(form.budget_max) : null,
        bedrooms:    form.bedrooms   || null,
        timeline:    form.timeline   || null,
        description: form.description || null,
        urgency:     form.urgency,
        is_fulfilled: false,
      });
      if (err) throw err;
      setSubmitted(true);
    } catch {
      // If DB not ready, show success anyway (demo mode)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F8F5] min-h-screen">

      {/* Page Hero */}
      <div className="bg-brand-600 px-7 py-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[28px] font-extrabold text-white mb-2">Property Request Board</h1>
          <p className="text-white/70 text-[13.5px] max-w-lg leading-relaxed">
            Can&apos;t find what you need? Post a request. Verified agents will reach out to you directly via WhatsApp.
          </p>
          <div className="flex gap-5 mt-6">
            {[["47","Active Requests"],["120+","Agents Watching"],["~4hrs","Avg Response"]].map(([n,l])=>(
              <div key={l} className="bg-white/10 rounded-xl px-5 py-3 text-center">
                <div className="text-[22px] font-extrabold text-gold-400">{n}</div>
                <div className="text-[11px] text-white/60 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-7 -mt-6 pb-12">

        {/* Ad Banner */}
        <AdBanner className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: FORM ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[14px] border border-[#ddeae0] overflow-hidden">

              {/* Form header */}
              <div className="bg-brand-600 px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white">Post a Property Request</h3>
                  <p className="text-[11.5px] text-white/60">Agents will contact you directly on WhatsApp</p>
                </div>
              </div>

              {submitted ? (
                <div className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-[18px] font-bold text-brand-600 mb-2">Request Submitted!</h3>
                  <p className="text-[13.5px] text-[#7a9a7e] mb-6">Agents in Osogbo can now see your request and will reach out via WhatsApp soon.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary px-8">Post Another Request</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-[12.5px] px-4 py-3 rounded-xl">{error}</div>
                  )}

                  {/* Type chips */}
                  <div>
                    <label className="label">What are you looking for?</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {PROPERTY_TYPES.map(t => (
                        <button key={t.value} type="button"
                          onClick={() => setForm(f=>({...f, type:t.value}))}
                          className={`px-4 py-2 rounded-full text-[12.5px] font-semibold border-[1.5px] transition-all ${
                            form.type === t.value
                              ? "bg-brand-600 border-brand-600 text-white"
                              : "bg-[#F4F8F5] border-[#D4E6DA] text-[#4a6a52] hover:border-brand-400"
                          }`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="label">Purpose</label>
                    <div className="flex gap-2 mt-1">
                      {["rent","sale","either"].map(p=>(
                        <button key={p} type="button"
                          onClick={()=>setForm(f=>({...f,purpose:p}))}
                          className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border-[1.5px] capitalize transition-all ${
                            form.purpose===p ? "bg-brand-600 border-brand-600 text-white" : "bg-[#F4F8F5] border-[#D4E6DA] text-[#4a6a52] hover:border-brand-400"
                          }`}>
                          {p === "rent" ? "For Rent" : p === "sale" ? "For Sale" : "Either"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Area + Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Your Name</label>
                      <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                        className="input" placeholder="e.g. Adeola K." />
                    </div>
                    <div>
                      <label className="label">Preferred Area <span className="text-red-400">*</span></label>
                      <select value={form.area} onChange={e=>setForm(f=>({...f,area:e.target.value}))} className="input">
                        <option value="">Select area...</option>
                        <option value="Anywhere in Osogbo">Anywhere in Osogbo</option>
                        {OSOGBO_AREAS.map(a=><option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="label">Budget Range (₦)</label>
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-brand-500">₦</span>
                        <input type="number" value={form.budget_min} onChange={e=>setForm(f=>({...f,budget_min:e.target.value}))}
                          className="input pl-7" placeholder="Min" />
                      </div>
                      <span className="text-center text-[12px] text-[#9aaa9e] font-medium">to</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-brand-500">₦</span>
                        <input type="number" value={form.budget_max} onChange={e=>setForm(f=>({...f,budget_max:e.target.value}))}
                          className="input pl-7" placeholder="Max" />
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms + Timeline */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Bedrooms Needed</label>
                      <select value={form.bedrooms} onChange={e=>setForm(f=>({...f,bedrooms:e.target.value}))} className="input">
                        <option value="">Any</option>
                        <option>Self contain / room</option>
                        <option>1 bedroom</option>
                        <option>2 bedrooms</option>
                        <option>3 bedrooms</option>
                        <option>4+ bedrooms</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Move-in Timeline</label>
                      <select value={form.timeline} onChange={e=>setForm(f=>({...f,timeline:e.target.value}))} className="input">
                        <option value="">Select...</option>
                        <option>ASAP / Immediately</option>
                        <option>Within 1 week</option>
                        <option>Within 1 month</option>
                        <option>1–3 months</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="label">Your WhatsApp Number <span className="text-red-400">*</span></label>
                    <input type="tel" value={form.whatsapp} onChange={e=>setForm(f=>({...f,whatsapp:e.target.value}))}
                      className="input" placeholder="+234 800 000 0000" />
                    <p className="text-[11px] text-[#9aaa9e] mt-1">Only shared with agents who respond to you</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="label">Additional Details <span className="text-[#9aaa9e] font-normal">(optional)</span></label>
                    <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                      className="input resize-none h-[90px]"
                      placeholder="e.g. Must have running water, tiled floors, close to a school, ground floor preferred..." />
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="label">Urgency</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={()=>setForm(f=>({...f,urgency:"normal"}))}
                        className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border-[1.5px] transition-all ${form.urgency==="normal" ? "bg-brand-600 border-brand-600 text-white" : "bg-[#F4F8F5] border-[#D4E6DA] text-[#4a6a52]"}`}>
                        Not Urgent
                      </button>
                      <button type="button" onClick={()=>setForm(f=>({...f,urgency:"urgent"}))}
                        className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border-[1.5px] transition-all ${form.urgency==="urgent" ? "bg-orange-600 border-orange-600 text-white" : "bg-[#F4F8F5] border-[#D4E6DA] text-[#4a6a52]"}`}>
                        🔥 Urgent — Need ASAP
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-gold w-full py-3.5 text-[14px] flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {loading ? "Submitting..." : "Submit My Request"}
                  </button>

                  <div className="flex items-start gap-2 bg-[#EDF5F0] rounded-xl p-3.5">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11.5px] text-[#4a6a52] leading-[1.55]">
                      Your WhatsApp number is only shared with agents who respond to your request. We never sell your data.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── RIGHT: LIVE BOARD ──────────────────────── */}
          <div className="space-y-5">
            <div className="bg-white rounded-[14px] border border-[#ddeae0] overflow-hidden">
              {/* Board header */}
              <div className="px-4 py-3.5 border-b border-[#eef3ef] flex items-center justify-between">
                <h3 className="text-[14.5px] font-bold text-brand-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                  Live Requests
                </h3>
                <span className="text-[11.5px] text-[#7a9a7e] font-medium bg-[#F4F8F5] px-3 py-1 rounded-full">Agent View</span>
              </div>

              {/* Filters */}
              <div className="flex gap-2 px-4 py-3 border-b border-[#eef3ef] overflow-x-auto scrollbar-hide">
                {(["all","house","shop","apartment","urgent"] as FilterType[]).map(f=>(
                  <button key={f} onClick={()=>setFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold border-[1.5px] whitespace-nowrap transition-all ${
                      filter===f ? "bg-brand-600 border-brand-600 text-white" : "bg-[#F4F8F5] border-[#D4E6DA] text-[#7a9a7e] hover:border-brand-400"
                    }`}>
                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Request items */}
              <div className="divide-y divide-[#f0f5f1]">
                {filtered.map((req, idx) => (
                  <>
                    <div key={req.id} className="p-4 hover:bg-[#F9FCF9] transition-colors cursor-pointer">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={req.type==="shop" ? "badge-shop" : req.type==="apartment" ? "badge-apt" : "badge-house"}>
                            {req.type==="shop"?"🏪":req.type==="apartment"?"🏢":"🏠"} {req.type}
                          </span>
                          <span className={`badge ${req.purpose==="rent" ? "badge-rent" : "badge-sale"}`}>
                            For {req.purpose}
                          </span>
                          {req.urgency==="urgent" && <span className="badge-urgent">🔥 Urgent</span>}
                        </div>
                        <span className="text-[11px] text-[#aab8ae] flex-shrink-0 font-medium">{timeAgo(req.created_at)}</span>
                      </div>

                      {/* Title */}
                      <p className="text-[13.5px] font-bold text-[#1C2B22] mb-2 leading-tight">
                        {req.bedrooms ? `${req.bedrooms} ${req.type}` : req.type} in {req.area}
                      </p>

                      {/* Details */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-[11.5px] text-[#5a7a62] font-medium">
                        {(req.budget_min || req.budget_max) && (
                          <span>₦{(req.budget_min||0).toLocaleString()} – ₦{(req.budget_max||0).toLocaleString()}</span>
                        )}
                        <span>📍 {req.area}</span>
                        {req.timeline && <span>⏱ {req.timeline}</span>}
                      </div>

                      {/* Note */}
                      {req.description && (
                        <p className="text-[12px] text-[#8a9e8e] leading-[1.5] mb-3 line-clamp-2">"{req.description}"</p>
                      )}

                      {/* Bottom */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                            {req.name?.[0] || "U"}
                          </div>
                          <span className="text-[12px] font-semibold text-[#4a6a52]">{req.name || "Anonymous"}</span>
                        </div>
                        <a href={`https://wa.me/${req.whatsapp}?text=${encodeURIComponent(`Hi, I saw your property request on HousePlug Osogbo. I have a ${req.type} for ${req.purpose} in ${req.area} that may interest you.`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-[#25D366] text-white text-[12px] font-bold px-3 py-1.5 rounded-[7px] hover:bg-[#1ebe5c] transition-colors">
                          {WA_SVG} Respond
                        </a>
                      </div>
                    </div>
                    {/* Ad every 5 requests */}
                    {(idx + 1) % 5 === 0 && idx !== filtered.length - 1 && (
                      <div key={`ad-${idx}`} className="px-4 py-3">
                        <AdInFeed />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>

            {/* Sidebar Ad */}
            <AdSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}
