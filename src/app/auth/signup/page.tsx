"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Home, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const router   = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [showPw, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirm)    { setError("Passwords do not match."); return; }
    if (form.password.length < 8)          { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data:{ name:form.name, phone:form.phone }, emailRedirectTo:`${location.origin}/auth/callback` },
    });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id, name:form.name, email:form.email, phone:form.phone, role:"agent", is_verified:false,
      });
    }
    setDone(true); setLoading(false);
  };

  if (done) return (
    <div className="min-h-screen bg-[#F4F8F5] flex items-center justify-center px-4">
      <div className="bg-white rounded-[14px] border border-[#ddeae0] p-10 max-w-md w-full text-center shadow-card">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-[20px] font-extrabold text-[#1C2B22] mb-2">Check your email!</h2>
        <p className="text-[13.5px] text-[#7a9a7e] mb-6">
          We sent a confirmation link to <strong className="text-[#1C2B22]">{form.email}</strong>. Click it to activate your account.
        </p>
        <Link href="/auth/login" className="btn-primary w-full py-3">Back to Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[14px] border border-[#ddeae0] shadow-card p-8">
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-extrabold italic text-brand-600">
              House<em className="text-gold-400 not-italic">Plug</em>
            </span>
          </Link>
          <h1 className="text-[22px] font-extrabold text-[#1C2B22] mb-1">Create Agent Account</h1>
          <p className="text-[13px] text-[#7a9a7e] mb-6">List properties and connect with buyers & tenants</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-[12.5px] px-4 py-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {[
              { label:"Full Name",             key:"name",    type:"text",     ph:"Your full name" },
              { label:"Email Address",          key:"email",   type:"email",    ph:"you@example.com" },
              { label:"WhatsApp / Phone",       key:"phone",   type:"tel",      ph:"+234 800 000 0000" },
            ].map(f=>(
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]}
                  onChange={e=>setForm(prev=>({...prev,[f.key]:e.target.value}))}
                  className="input" placeholder={f.ph} />
              </div>
            ))}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw?"text":"password"} required value={form.password}
                  onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                  className="input pr-11" placeholder="Min. 8 characters" />
                <button type="button" onClick={()=>setShow(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aaa9e]">
                  {showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" required value={form.confirm}
                onChange={e=>setForm(f=>({...f,confirm:e.target.value}))}
                className="input" placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3.5 text-[14px] disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#7a9a7e] mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-500 font-semibold hover:text-brand-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 546f6298eb2e50e5fd6f66f60c33b2386a2d1f7e
