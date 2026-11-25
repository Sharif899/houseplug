import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceWithPeriod(
  price: number,
  period?: "monthly" | "yearly" | "total",
  purpose?: "rent" | "sale"
): string {
  const f = formatPrice(price);
  if (purpose === "sale") return f;
  if (period === "monthly") return `${f}/mo`;
  if (period === "yearly")  return `${f}/yr`;
  return f;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"").trim();
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trim() + "...";
}

export function buildWhatsAppURL(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(message)}`;
}

export function getPropertyPlaceholder(type: string): string {
  const map: Record<string, string> = {
    house:     "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    shop:      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
    office:    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    land:      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  };
  return map[type] || map.house;
}

export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)    return "just now";
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins/60)}h ago`;
  if (mins < 43200) return `${Math.floor(mins/1440)}d ago`;
  return new Date(dateString).toLocaleDateString("en-NG",{month:"short",day:"numeric"});
}