"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { OSOGBO_AREAS, PROPERTY_TYPES } from "@/types";
import { ChevronLeft, Upload, X, Loader2, Save, Info, CheckCircle } from "lucide-react";

const AMENITIES = [
  "Running Water","Electricity (PHCN)","Solar Power","Generator","Security",
  "Gated Compound","Parking Space","Borehole","Tiled Floors","POP Ceiling",
  "CCTV","Boys Quarter","Fence","Garden","Balcony","Kitchen",
];

export default function EditListingPage() {
  const router   = useRouter();
  const params   = useParams();
  const id       = params.id as string;
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const [form, setForm] = useState({
    title:"", description:"", price:"", price_period:"yearly",
    type:"house", purpose:"rent", area:"", address:"",
    bedrooms:"", bathrooms:"", size_sqm:"",
    is_featured:false, is_available:true,
  });
  const [amenities,    setAmenities]    = useState<string[]>([]);
  const [existingImgs, setExistingImgs] = useState<string[]>([]);
  const [newFiles,     setNewFiles]     = useState<File[]>([]);
  const [newPreviews,  setNewPreviews]  = useState<string[]>([]);

  // Load property
  useEffect(() => {
    (async () => {
      const { data:{ user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data, error: fe } = await supabase
        .from("properties").select("*")
        .eq("id", id).eq("agent_id", user.id).single();

      if (fe || !data) { router.push("/dashboard"); return; }

      setForm({
        title:        data.title,
        description:  data.description,
        price:        String(data.price),
        price_period: data.price_period || "yearly",
        type:         data.type,
        purpose:      data.purpose,
        area:         data.area,
        address:      data.address || "",
        bedrooms:     data.bedrooms  ? String(data.bedrooms)  : "",
        bathrooms:    data.bathrooms ? String(data.bathrooms) : "",
        size_sqm:     data.size_sqm  ? String(data.size_sqm)  : "",
        is_featured:  data.is_featured,
        is_available: data.is_available,
      });
      setAmenities(data.amenities || []);
      setExistingImgs(data.images || []);
      setLoading(false);
    })();
  }, [id]);

  const upd = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const addNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    const total  = existingImgs.length + newFiles.length + picked.length;
    if (total > 10) { setError("Maximum 10 images total."); return; }
    setNewFiles(p => [...p, ...picked]);
    picked.forEach(f => {
      const r = new FileReader();
      r.onloadend = () => setNewPreviews(p => [...p, r.result as string]);
      r.readAsDataURL(f);
    });
  };

  const removeExisting = (url: string) => setExistingImgs(p => p.filter(u => u !== url));
  const removeNew      = (i: number)   => {
    setNewFiles(f => f.filter((_, j) => j !== i));
    setNewPreviews(p => p.filter((_, j) => j !== i));
  };

  const handleSave = async () => {
    setError("");
    if (!form.title || !form.price || !form.area) {
      setError("Title, price, and area are required."); return;
    }
    setSaving(true);
    try {
      // Upload new images
      const newUrls: string[] = [];
      for (const file of newFiles) {
        const ext  = file.name.split(".").pop();
        const path = `properties/${id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { data, error: ue } = await supabase.storage.from("property-images").upload(path, file, { cacheControl:"3600" });
        if (ue) throw ue;
        const { data: ud } = supabase.storage.from("property-images").getPublicUrl(data.path);
        newUrls.push(ud.publicUrl);
      }

      const { error: ue } = await supabase.from("properties").update({
        title:        form.title,
        description:  form.description,
        price:        parseInt(form.price),
        price_period: form.price_period,
        type:         form.type,
        purpose:      form.purpose,
        area:         form.area,
        location:     `${form.area}, Osogbo`,
        address:      form.address || null,
        bedrooms:     form.bedrooms  ? parseInt(form.bedrooms)  : null,
        bathrooms:    form.bathrooms ? parseInt(form.bathrooms) : null,
        size_sqm:     form.size_sqm  ? parseInt(form.size_sqm)  : null,
        images:       [...existingImgs, ...newUrls],
        amenities,
        is_featured:  form.is_featured,
        is_available: form.is_available,
        updated_at:   new Date().toISOString(),
      }).eq("id", id);

      if (ue) throw ue;
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F4F8F5] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
    </div>
  );

  return (
    <div className="bg-[#F4F8F5] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <Link href="/dashboard"
            className="w-9 h-9 bg-white rounded-xl border border-[#D4E6DA] flex items-center justify-center hover:bg-[#F4F8F5] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-[22px] font-extrabold text-[#1C2B22]">Edit Listing</h1>
            <p className="text-[12.5px] text-[#7a9a7e] line-clamp-1">{form.title}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[12.5px] px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-[12.5px] px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />Listing updated! Redirecting to dashboard…
          </div>
        )}

        <div className="bg-white rounded-[14px] border border-[#ddeae0] p-6 space-y-5">

          {/* Status toggles */}
          <div className="flex gap-5 p-4 bg-[#F4F8F5] rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_available} onChange={e => upd("is_available", e.target.checked)} className="accent-brand-600" />
              <span className="text-[13px] font-semibold text-[#1C2B22]">Active / Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => upd("is_featured", e.target.checked)} className="accent-amber-500" />
              <span className="text-[13px] font-semibold text-[#1C2B22]">⭐ Featured</span>
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input value={form.title} onChange={e => upd("title", e.target.value)} className="input" placeholder="Property title" />
          </div>

          {/* Type + Purpose */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={e => upd("type", e.target.value)} className="input">
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Purpose</label>
              <select value={form.purpose} onChange={e => upd("purpose", e.target.value)} className="input">
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₦) <span className="text-red-400">*</span></label>
              <input type="number" value={form.price} onChange={e => upd("price", e.target.value)} className="input" />
            </div>
            {form.purpose === "rent" && (
              <div>
                <label className="label">Period</label>
                <select value={form.price_period} onChange={e => upd("price_period", e.target.value)} className="input">
                  <option value="yearly">Per Year</option>
                  <option value="monthly">Per Month</option>
                </select>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description <span className="text-red-400">*</span></label>
            <textarea value={form.description} onChange={e => upd("description", e.target.value)} className="input resize-none h-28" />
          </div>

          {/* Area + Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Area <span className="text-red-400">*</span></label>
              <select value={form.area} onChange={e => upd("area", e.target.value)} className="input">
                <option value="">Select area…</option>
                {OSOGBO_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Address</label>
              <input value={form.address} onChange={e => upd("address", e.target.value)} className="input" placeholder="Optional" />
            </div>
          </div>

          {/* Beds / Baths / Size */}
          {(form.type === "house" || form.type === "apartment") && (
            <div className="grid grid-cols-3 gap-4">
              <div><label className="label">Beds</label><input type="number" min="0" value={form.bedrooms} onChange={e => upd("bedrooms", e.target.value)} className="input" /></div>
              <div><label className="label">Baths</label><input type="number" min="0" value={form.bathrooms} onChange={e => upd("bathrooms", e.target.value)} className="input" /></div>
              <div><label className="label">Size m²</label><input type="number" value={form.size_sqm} onChange={e => upd("size_sqm", e.target.value)} className="input" /></div>
            </div>
          )}

          {/* Amenities */}
          <div>
            <label className="label">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {AMENITIES.map(a => (
                <button key={a} type="button"
                  onClick={() => setAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])}
                  className={`text-left px-3 py-2 rounded-[8px] text-[12.5px] border-[1.5px] transition-all ${
                    amenities.includes(a)
                      ? "bg-brand-600 border-brand-600 text-white"
                      : "border-[#D4E6DA] text-[#4a6a52] hover:border-brand-400 bg-[#F4F8F5]"
                  }`}>
                  {amenities.includes(a) && "✓ "}{a}
                </button>
              ))}
            </div>
          </div>

          {/* Existing images */}
          {existingImgs.length > 0 && (
            <div>
              <label className="label">Current Photos ({existingImgs.length})</label>
              <p className="text-[11.5px] text-[#9aaa9e] mb-2">Click ✕ to remove a photo</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {existingImgs.map((url, i) => (
                  <div key={url} className="relative group aspect-square rounded-[8px] overflow-hidden bg-[#D4E6DA]">
                    <Image src={url} alt={`Photo ${i+1}`} fill className="object-cover" sizes="100px" />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-600 text-white text-[9px] font-bold text-center py-0.5">Cover</div>
                    )}
                    <button onClick={() => removeExisting(url)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new images */}
          <div>
            <label className="label">Add More Photos</label>
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-[#D4E6DA] rounded-xl p-5 text-center cursor-pointer hover:border-brand-400 hover:bg-[#F4F8F5] transition-all">
              <Upload className="w-6 h-6 text-[#D4E6DA] mx-auto mb-1" />
              <p className="text-[12.5px] text-[#9aaa9e]">Click to add more photos (max 10 total)</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addNewImages} />
            {newPreviews.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-[8px] overflow-hidden bg-[#D4E6DA]">
                    <Image src={src} alt="" fill className="object-cover" sizes="100px" />
                    <button onClick={() => removeNew(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link href="/dashboard" className="btn-outline flex-1 justify-center">Cancel</Link>
            <button onClick={handleSave} disabled={saving}
              className="btn-gold flex-1 justify-center py-3 disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

