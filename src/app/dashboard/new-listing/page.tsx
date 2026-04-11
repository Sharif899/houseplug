"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { OSOGBO_AREAS, PROPERTY_TYPES } from "@/types";
import { slugify } from "@/lib/utils";
import { ChevronLeft, Upload, X, Loader2, CheckCircle, Star, Info } from "lucide-react";

const AMENITIES = [
  "Running Water","Electricity (PHCN)","Solar Power","Generator","Security",
  "Gated Compound","Parking Space","Borehole","Tiled Floors","POP Ceiling",
  "CCTV","Boys Quarter","Fence","Garden","Balcony","Kitchen",
];

export default function NewListingPage() {
  const router   = useRouter();
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title:"", description:"", price:"", price_period:"yearly",
    type:"house", purpose:"rent", area:"", address:"",
    bedrooms:"", bathrooms:"", size_sqm:"", is_featured:false,
  });
  const [amenities, setAmenities]   = useState<string[]>([]);
  const [files, setFiles]           = useState<File[]>([]);
  const [previews, setPreviews]     = useState<string[]>([]);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState("");

  const upd = (k: string, v: string | boolean) => setForm(f=>({...f,[k]:v}));

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files||[]);
    if (files.length + picked.length > 10) { setError("Max 10 images."); return; }
    const valid = picked.filter(f=>f.size < 5*1024*1024);
    setFiles(p=>[...p,...valid]);
    valid.forEach(f=>{ const r=new FileReader(); r.onloadend=()=>setPreviews(p=>[...p,r.result as string]); r.readAsDataURL(f); });
  };

  const publish = async () => {
    setError("");
    if (!form.title||!form.price||!form.area||!form.description) { setError("Fill all required fields."); return; }
    setUploading(true);
    try {
      const { data:{ user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const pid  = crypto.randomUUID();
      const slug = slugify(`${form.title}-${form.area}-${Date.now()}`);

      const urls: string[] = [];
      for (const file of files) {
        const ext  = file.name.split(".").pop();
        const path = `properties/${pid}/${Date.now()}.${ext}`;
        const { data, error: ue } = await supabase.storage.from("property-images").upload(path, file,{cacheControl:"3600"});
        if (ue) throw ue;
        const { data: ud } = supabase.storage.from("property-images").getPublicUrl(data.path);
        urls.push(ud.publicUrl);
      }

      const { error: ie } = await supabase.from("properties").insert({
        id:pid, slug, title:form.title, description:form.description,
        price:parseInt(form.price), price_period:form.price_period,
        type:form.type, purpose:form.purpose, area:form.area,
        location:`${form.area}, Osogbo`, address:form.address||null,
        bedrooms:form.bedrooms?parseInt(form.bedrooms):null,
        bathrooms:form.bathrooms?parseInt(form.bathrooms):null,
        size_sqm:form.size_sqm?parseInt(form.size_sqm):null,
        images:urls, amenities, agent_id:user.id,
        is_featured:form.is_featured, is_available:true, views:0,
      });
      if (ie) throw ie;
      router.push("/dashboard?success=1");
    } catch(err:any) {
      setError(err.message||"Failed to publish. Try again.");
    } finally { setUploading(false); }
  };

  const stepTitles = ["Details","Location","Photos","Review"];

  return (
    <div className="bg-[#F4F8F5] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <Link href="/dashboard" className="w-9 h-9 bg-white rounded-xl border border-[#D4E6DA] flex items-center justify-center hover:bg-[#F4F8F5] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-[22px] font-extrabold text-[#1C2B22]">Add New Listing</h1>
            <p className="text-[12.5px] text-[#7a9a7e]">Step {step} of 4 — {stepTitles[step-1]}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-7">
          {stepTitles.map((t,i)=>(
            <div key={t} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 transition-colors ${
                step > i+1 ? "bg-green-500 text-white" : step===i+1 ? "bg-brand-600 text-white" : "bg-[#D4E6DA] text-[#9aaa9e]"
              }`}>
                {step > i+1 ? <CheckCircle className="w-4 h-4" /> : i+1}
              </div>
              <span className={`text-[12px] hidden sm:block ${step===i+1?"font-bold text-[#1C2B22]":"text-[#9aaa9e]"}`}>{t}</span>
              {i < 3 && <div className="flex-1 h-px bg-[#D4E6DA] hidden sm:block" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[12.5px] px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        <div className="bg-white rounded-[14px] border border-[#ddeae0] p-6 space-y-5">

          {/* ── STEP 1 ── */}
          {step===1 && <>
            <h2 className="font-extrabold text-[16px] text-[#1C2B22] border-b border-[#eef3ef] pb-3">Property Details</h2>
            <div>
              <label className="label">Title <span className="text-red-400">*</span></label>
              <input value={form.title} onChange={e=>upd("title",e.target.value)} className="input" placeholder="e.g. 3 Bedroom Flat at Dada Estate" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Type</label>
                <select value={form.type} onChange={e=>upd("type",e.target.value)} className="input">
                  {PROPERTY_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div><label className="label">Purpose</label>
                <select value={form.purpose} onChange={e=>upd("purpose",e.target.value)} className="input">
                  <option value="rent">For Rent</option><option value="sale">For Sale</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Price (₦) <span className="text-red-400">*</span></label>
                <input type="number" value={form.price} onChange={e=>upd("price",e.target.value)} className="input" placeholder="e.g. 250000" />
              </div>
              {form.purpose==="rent" && <div><label className="label">Period</label>
                <select value={form.price_period} onChange={e=>upd("price_period",e.target.value)} className="input">
                  <option value="yearly">Per Year</option><option value="monthly">Per Month</option>
                </select>
              </div>}
            </div>
            <div><label className="label">Description <span className="text-red-400">*</span></label>
              <textarea value={form.description} onChange={e=>upd("description",e.target.value)} className="input resize-none h-28" placeholder="Describe the property..." />
            </div>
            {(form.type==="house"||form.type==="apartment") && (
              <div className="grid grid-cols-3 gap-4">
                <div><label className="label">Beds</label><input type="number" min="0" value={form.bedrooms} onChange={e=>upd("bedrooms",e.target.value)} className="input" placeholder="0" /></div>
                <div><label className="label">Baths</label><input type="number" min="0" value={form.bathrooms} onChange={e=>upd("bathrooms",e.target.value)} className="input" placeholder="0" /></div>
                <div><label className="label">Size m²</label><input type="number" value={form.size_sqm} onChange={e=>upd("size_sqm",e.target.value)} className="input" placeholder="0" /></div>
              </div>
            )}
            <div>
              <label className="label">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {AMENITIES.map(a=>(
                  <button key={a} type="button" onClick={()=>setAmenities(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a])}
                    className={`text-left px-3 py-2 rounded-[8px] text-[12.5px] border-[1.5px] transition-all ${
                      amenities.includes(a) ? "bg-brand-600 border-brand-600 text-white" : "border-[#D4E6DA] text-[#4a6a52] hover:border-brand-400 bg-[#F4F8F5]"
                    }`}>
                    {amenities.includes(a)&&"✓ "}{a}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e=>upd("is_featured",e.target.checked)} className="mt-0.5 accent-amber-500" />
              <div>
                <p className="font-bold text-[#1C2B22] flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" />Mark as Featured Listing</p>
                <p className="text-[12px] text-[#7a9a7e] mt-0.5">Appears at the top of search results and homepage.</p>
              </div>
            </label>
            <button onClick={()=>{setError("");setStep(2);}} className="btn-primary w-full py-3">Continue to Location →</button>
          </>}

          {/* ── STEP 2 ── */}
          {step===2 && <>
            <h2 className="font-extrabold text-[16px] text-[#1C2B22] border-b border-[#eef3ef] pb-3">Location</h2>
            <div><label className="label">Area in Osogbo <span className="text-red-400">*</span></label>
              <select value={form.area} onChange={e=>upd("area",e.target.value)} className="input">
                <option value="">Select area...</option>
                {OSOGBO_AREAS.map(a=><option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div><label className="label">Specific Address <span className="text-[#9aaa9e] font-normal">(optional)</span></label>
              <input value={form.address} onChange={e=>upd("address",e.target.value)} className="input" placeholder="e.g. No. 12 Adeoyo Street" />
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="btn-outline flex-1">← Back</button>
              <button onClick={()=>{if(!form.area){setError("Please select an area.");return;}setError("");setStep(3);}} className="btn-primary flex-1">Continue to Photos →</button>
            </div>
          </>}

          {/* ── STEP 3 ── */}
          {step===3 && <>
            <h2 className="font-extrabold text-[16px] text-[#1C2B22] border-b border-[#eef3ef] pb-3">Property Photos</h2>
            <p className="text-[13px] text-[#7a9a7e]">Upload up to 10 photos. First image will be the cover.</p>
            <div onClick={()=>fileRef.current?.click()}
              className="border-2 border-dashed border-[#D4E6DA] rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-[#F4F8F5] transition-all">
              <Upload className="w-8 h-8 text-[#D4E6DA] mx-auto mb-2" />
              <p className="text-[#7a9a7e] font-medium">Click to upload photos</p>
              <p className="text-[12px] text-[#9aaa9e] mt-1">JPG, PNG, WebP — max 5MB each</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addImages} />
            {previews.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {previews.map((src,i)=>(
                  <div key={i} className="relative group aspect-square rounded-[8px] overflow-hidden bg-[#D4E6DA]">
                    <Image src={src} alt="" fill className="object-cover" sizes="100px" />
                    {i===0 && <div className="absolute bottom-0 left-0 right-0 bg-brand-600 text-white text-[9px] font-bold text-center py-0.5">Cover</div>}
                    <button onClick={()=>{setFiles(f=>f.filter((_,j)=>j!==i));setPreviews(p=>p.filter((_,j)=>j!==i));}}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={()=>setStep(2)} className="btn-outline flex-1">← Back</button>
              <button onClick={()=>{setError("");setStep(4);}} className="btn-primary flex-1">Review Listing →</button>
            </div>
          </>}

          {/* ── STEP 4 ── */}
          {step===4 && <>
            <h2 className="font-extrabold text-[16px] text-[#1C2B22] border-b border-[#eef3ef] pb-3">Review & Publish</h2>
            <div className="bg-[#F4F8F5] rounded-xl p-4 space-y-2.5 text-[13px]">
              {[
                ["Title",     form.title],
                ["Type",      `${form.type} · For ${form.purpose}`],
                ["Price",     `₦${parseInt(form.price||"0").toLocaleString()}${form.purpose==="rent"?`/${form.price_period==="monthly"?"mo":"yr"}`:""}` ],
                ["Location",  `${form.area}, Osogbo`],
                ["Photos",    `${files.length} photo${files.length!==1?"s":""}`],
                ["Amenities", `${amenities.length} selected`],
                ["Featured",  form.is_featured?"⭐ Yes":"No"],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between">
                  <span className="text-[#7a9a7e]">{k}</span>
                  <span className="font-semibold text-[#1C2B22]">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep(3)} className="btn-outline flex-1">← Back</button>
              <button onClick={publish} disabled={uploading} className="btn-gold flex-1 py-3 disabled:opacity-60">
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {uploading ? "Publishing..." : "🚀 Publish Listing"}
              </button>
            </div>
          </>}

        </div>
      </div>
    </div>
  );
}
