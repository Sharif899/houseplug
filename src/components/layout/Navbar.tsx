"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Home, PlusSquare, User, LogOut, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SBUser } from "@supabase/supabase-js";

const links = [
  { href: "/",          label: "Home" },
  { href: "/properties",label: "Listings" },
  { href: "/requests",  label: "Requests" },
  { href: "/blog",      label: "Blog" },
  { href: "/about",     label: "About Us" },
  { href: "/contact",   label: "Contact" },
];

export function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser]       = useState<SBUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-white shadow-sm border-b border-[#ddeae0]" : "bg-white border-b border-[#ddeae0]"}`}>
      <nav className="max-w-7xl mx-auto px-7 h-[62px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-[42px] h-[42px] bg-brand-600 rounded-[10px] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500 transition-colors">
            <Home className="w-[22px] h-[22px] text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[17px] font-extrabold italic text-brand-600 tracking-tight">
              House<em className="text-gold-400 not-italic">Plug</em>
            </div>
            <div className="text-[9.5px] font-semibold text-[#7a9a82] uppercase tracking-[0.8px]">+ Osogbo</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="px-3.5 py-2 text-[13.5px] font-medium text-[#444] hover:text-brand-600 hover:bg-[#f0f7f2] rounded-lg transition-all">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-outline text-[13px] py-2">Dashboard</Link>
              <button onClick={() => supabase.auth.signOut().then(() => location.href="/")}
                className="flex items-center gap-1 text-[13px] text-[#7a9a7e] hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#444] hover:text-brand-600 transition-colors">
                <User className="w-4 h-4" /> Sign In
              </Link>
              <Link href="/auth/signup" className="flex items-center gap-0 overflow-hidden rounded-[10px] font-bold text-[13.5px] text-gray-900">
                <span className="bg-gold-400 hover:bg-gold-500 transition-colors px-4 py-[10px]">+ Add Listing</span>
                <span className="bg-gold-500 px-[11px] py-[10px] flex items-center">
                  <ChevronRight className="w-[13px] h-[13px] text-gray-900" strokeWidth={2.5} />
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#ddeae0] shadow-lg animate-fade-in">
          <div className="px-5 py-4 space-y-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-[#333] font-medium hover:bg-[#f0f7f2] hover:text-brand-600 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {user
                ? <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-primary w-full">Dashboard</Link>
                : <>
                    <Link href="/auth/login"  onClick={() => setOpen(false)} className="btn-outline w-full">Sign In</Link>
                    <Link href="/auth/signup" onClick={() => setOpen(false)} className="btn-gold w-full">+ Add Listing</Link>
                  </>
              }
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
