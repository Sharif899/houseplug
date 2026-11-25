import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, timeAgo } from "@/lib/utils";
import { PlusSquare, Eye, Star, Home, CheckCircle, AlertCircle, Edit, Trash2 } from "lucide-react";

export default async function DashboardPage() {
  const sb = createClient();
  const { data:{ user } } = await sb.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard");

  const { data: profile } = await sb.from("users").select("*").eq("id", user.id).single();
  const { data: properties } = await sb.from("properties").select("*").eq("agent_id", user.id).order("created_at",{ascending:false});
  const props = properties || [];

  const stats = {
    total:    props.length,
    active:   props.filter(p=>p.is_available).length,
    featured: props.filter(p=>p.is_featured).length,
    views:    props.reduce((s,p)=>s+(p.views||0),0),
  };

  return (
    <div className="bg-[#F4F8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-7 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
          <div>
            <p className="text-[12px] font-semibold text-[#7a9a7e] uppercase tracking-wide mb-1">Agent Dashboard</p>
            <h1 className="text-[24px] font-extrabold text-[#1C2B22]">
              Welcome, {profile?.name || user.email}
            </h1>
            {profile?.is_verified
              ? <span className="flex items-center gap-1 text-blue-600 text-[12.5px] font-semibold mt-1"><CheckCircle className="w-4 h-4 fill-current" />Verified Agent</span>
              : <span className="flex items-center gap-1 text-amber-500 text-[12.5px] font-semibold mt-1"><AlertCircle className="w-4 h-4" />Pending Verification</span>
            }
          </div>
          <Link href="/dashboard/new-listing" className="btn-gold flex items-center gap-2 px-6 py-3">
            <PlusSquare className="w-4 h-4" /> Add New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {[
            { label:"Total Listings", value:stats.total,    icon:<Home  className="w-5 h-5" />, color:"bg-brand-100 text-brand-600" },
            { label:"Active",         value:stats.active,   icon:<CheckCircle className="w-5 h-5" />, color:"bg-green-100 text-green-600" },
            { label:"Featured",       value:stats.featured, icon:<Star  className="w-5 h-5" />, color:"bg-amber-100 text-amber-600" },
            { label:"Total Views",    value:stats.views,    icon:<Eye   className="w-5 h-5" />, color:"bg-blue-100 text-blue-600" },
          ].map(s=>(
            <div key={s.label} className="bg-white rounded-[14px] border border-[#ddeae0] p-5 shadow-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-[22px] font-extrabold text-[#1C2B22]">{s.value.toLocaleString()}</p>
              <p className="text-[12px] text-[#7a9a7e] font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-[14px] border border-[#ddeae0] overflow-hidden shadow-card">
          <div className="px-6 py-4 border-b border-[#eef3ef] flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold text-[#1C2B22]">Your Listings</h2>
            <Link href="/dashboard/new-listing" className="btn-primary text-[13px] py-2 px-4">
              <PlusSquare className="w-3.5 h-3.5" /> New
            </Link>
          </div>

          {props.length === 0 ? (
            <div className="text-center py-16">
              <Home className="w-12 h-12 text-[#D4E6DA] mx-auto mb-3" />
              <p className="text-[#7a9a7e] mb-4">No listings yet. Add your first property!</p>
              <Link href="/dashboard/new-listing" className="btn-gold px-6 py-2.5">Add Property</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-[#F4F8F5] text-[#7a9a7e] text-[11px] uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-6 py-3">Property</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Type</th>
                    <th className="text-left px-6 py-3">Price</th>
                    <th className="text-left px-6 py-3 hidden lg:table-cell">Views</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Status</th>
                    <th className="text-left px-6 py-3 hidden lg:table-cell">Listed</th>
                    <th className="text-right px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f8f5]">
                  {props.map((p: any) => (
                    <tr key={p.id} className="hover:bg-[#F9FCF9] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-[8px] bg-[#D4E6DA] overflow-hidden flex-shrink-0">
                            {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1C2B22] line-clamp-1 max-w-[180px]">{p.title}</p>
                            <p className="text-[11px] text-[#9aaa9e]">{p.area}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell capitalize text-[#4a6a52]">{p.type}</td>
                      <td className="px-6 py-4 font-bold text-brand-600">{formatPrice(p.price)}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-[#7a9a7e]"><Eye className="w-3.5 h-3.5" />{p.views||0}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          <span className={`badge ${p.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {p.is_available ? "Active" : "Inactive"}
                          </span>
                          {p.is_featured && <span className="badge-featured">⭐ Featured</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-[11px] text-[#9aaa9e]">{timeAgo(p.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/edit/${p.id}`}
                            className="w-8 h-8 rounded-[8px] bg-[#F4F8F5] border border-[#D4E6DA] flex items-center justify-center text-[#7a9a7e] hover:bg-brand-100 hover:text-brand-600 transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <form action={`/api/properties/${p.id}/delete`} method="POST">
                            <button type="submit"
                              onClick={e=>{ if(!confirm("Delete this listing?")) e.preventDefault(); }}
                              className="w-8 h-8 rounded-[8px] bg-[#F4F8F5] border border-[#D4E6DA] flex items-center justify-center text-[#7a9a7e] hover:bg-red-100 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upgrade CTA */}
        {!profile?.is_verified && (
          <div className="mt-5 p-5 bg-brand-600 rounded-[14px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-extrabold text-[16px] text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-gold-400 fill-gold-400" /> Get Verified Agent Badge
              </p>
              <p className="text-white/65 text-[13px] mt-1">Verified agents get more trust, more clicks, and more inquiries.</p>
            </div>
            <button className="btn-gold px-6 py-3 flex-shrink-0">Get Verified</button>
          </div>
        )}
      </div>
    </div>
  );
}
