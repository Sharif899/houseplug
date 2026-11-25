"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Home, ChevronRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const sp     = useSearchParams();
  const redirectTo = sp.get("redirectTo") || "/dashboard";
  const supabase   = createClient();
  const [form, setForm]   = useState({ email:"", password:"" });
  const [showPw, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword(form);
    if (err) { setError(err.message); setLoading(false); return; }
    router.push(redirectTo); router.refresh();
  };

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
          <h1 className="text-[22px] font-extrabold text-[#1C2B22] mb-1">Welcome back</h1>
          <p className="text-[13px] text-[#7a9a7e] mb-6">Sign in to your agent account</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-[12.5px] px-4 py-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" required value={form.email}
                onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw?"text":"password"} required value={form.password}
                  onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                  className="input pr-11" placeholder="••••••••" />
                <button type="button" onClick={()=>setShow(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aaa9e] hover:text-[#4a6a52]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-[14px] disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#7a9a7e] mt-5">
            No account?{" "}
            <Link href="/auth/signup" className="text-brand-500 font-semibold hover:text-brand-600">Create free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F8F5] flex items-center justify-center px-4 py-12"><p className="text-[13px] text-[#7a9a7e]">Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}