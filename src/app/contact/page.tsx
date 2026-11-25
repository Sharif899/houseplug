"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, MessageSquare, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm]   = useState({ name:"", email:"", phone:"", message:"" });
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send — wire to your email service (Resend, Nodemailer etc.)
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="bg-[#F4F8F5] min-h-screen">
      {/* Hero */}
      <div className="bg-brand-600 px-7 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[32px] font-extrabold text-white mb-3">Contact Us</h1>
          <p className="text-white/70 text-[14px]">We are here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-7 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-[14px] border border-[#ddeae0] p-6">
              <h2 className="text-[18px] font-extrabold text-[#1C2B22] mb-5">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  { icon:<MapPin className="w-5 h-5 text-brand-500" />,     label:"Address",   value:"Osogbo, Osun State, Nigeria" },
                  { icon:<Phone className="w-5 h-5 text-brand-500" />,      label:"Phone",     value:"+234 800 000 0000" },
                  { icon:<Mail className="w-5 h-5 text-brand-500" />,       label:"Email",     value:"hello@houseplug.ng" },
                  { icon:<MessageSquare className="w-5 h-5 text-green-500" />,label:"WhatsApp", value:"+234 800 000 0000" },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-3 p-3.5 bg-[#F4F8F5] rounded-xl">
                    <div className="flex-shrink-0 mt-0.5">{c.icon}</div>
                    <div>
                      <p className="text-[11px] font-bold text-[#9aaa9e] uppercase tracking-wide">{c.label}</p>
                      <p className="text-[13.5px] font-semibold text-[#1C2B22] mt-0.5">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-600 rounded-[14px] p-6">
              <h3 className="text-[15px] font-extrabold text-white mb-2">Are you an agent?</h3>
              <p className="text-white/65 text-[13px] leading-relaxed mb-4">
                List your properties for free and start getting inquiries from buyers and tenants in Osogbo today.
              </p>
              <a href="/auth/signup"
                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-gray-900 font-bold text-[13.5px] px-5 py-2.5 rounded-xl transition-colors">
                Start Listing Free
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[14px] border border-[#ddeae0] p-6">
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h3 className="text-[18px] font-extrabold text-[#1C2B22] mb-2">Message Sent!</h3>
                <p className="text-[13.5px] text-[#7a9a7e]">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 className="text-[18px] font-extrabold text-[#1C2B22] mb-5">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Your Name</label>
                    <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                      required className="input" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                      required className="input" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="label">Phone / WhatsApp</label>
                    <input type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                      className="input" placeholder="+234 800 000 0000" />
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                      required className="input resize-none h-28"
                      placeholder="How can we help you?" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 text-[14px] disabled:opacity-60">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
