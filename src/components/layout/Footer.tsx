import Link from "next/link";
import { Home, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-600 text-white">
      <div className="max-w-7xl mx-auto px-7 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-extrabold italic">
              House<em className="text-gold-400 not-italic">Plug</em>
            </span>
          </Link>
          <p className="text-white/65 text-[13px] leading-relaxed mb-5">
            Osogbo&apos;s most trusted property platform. Find houses, shops and apartments for rent or sale.
          </p>
          <div className="space-y-2 text-[13px] text-white/65">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />Osogbo, Osun State, Nigeria</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />+234 800 000 0000</div>
            <div className="flex items-center gap-2"><Mail  className="w-4 h-4 text-gold-400 flex-shrink-0" />hello@houseplug.ng</div>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm">Properties</h4>
          <ul className="space-y-2 text-[13px] text-white/65">
            {[["Houses for Rent","/properties?purpose=rent"],["Houses for Sale","/properties?purpose=sale"],
              ["Shops for Rent","/properties?type=shop"],["Apartments","/properties?type=apartment"],
              ["Land for Sale","/properties?type=land"]].map(([l,h])=>(
              <li key={h}><Link href={h} className="hover:text-gold-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm">Areas in Osogbo</h4>
          <ul className="space-y-2 text-[13px] text-white/65">
            {[["Dada Estate","Dada+Estate"],["Ogo-Oluwa","Ogo-Oluwa"],["Oke-Fia","Oke-Fia"],
              ["Stadium Road","Stadium+Road"],["Igbona","Igbona"],["Gbongan Road","Gbongan+Road"]].map(([l,a])=>(
              <li key={a}><Link href={`/properties?area=${a}`} className="hover:text-gold-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm">Real Estate Guides</h4>
          <ul className="space-y-2 text-[13px] text-white/65">
            {[["Cheap Houses in Osogbo","cheap-houses-in-osogbo"],
              ["Shops for Rent","shops-for-rent-in-osogbo"],
              ["Best Areas to Live","best-areas-to-live-in-osogbo"],
              ["Property Prices 2024","property-prices-osogbo-2024"],
              ["Post a Property Request","/requests"]].map(([l,s])=>(
              <li key={s}><Link href={s.startsWith("/") ? s : `/blog/${s}`} className="hover:text-gold-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-[12.5px]">© {new Date().getFullYear()} HousePlug Osogbo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-white/50 hover:text-white text-[12.5px] transition-colors">Privacy</Link>
            <Link href="/terms"   className="text-white/50 hover:text-white text-[12.5px] transition-colors">Terms</Link>
            <div className="flex items-center gap-3 ml-1">
              {[Facebook,Twitter,Instagram].map((Icon,i)=>(
                <a key={i} href="#" className="text-white/40 hover:text-gold-400 transition-colors"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 546f6298eb2e50e5fd6f66f60c33b2386a2d1f7e
