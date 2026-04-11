import { MetadataRoute } from "next";
const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://houseplug.ng";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url:BASE,                                      changeFrequency:"daily",   priority:1.0 },
    { url:`${BASE}/properties`,                      changeFrequency:"hourly",  priority:0.9 },
    { url:`${BASE}/properties?purpose=rent`,         changeFrequency:"hourly",  priority:0.9 },
    { url:`${BASE}/properties?purpose=sale`,         changeFrequency:"hourly",  priority:0.9 },
    { url:`${BASE}/properties?type=shop`,            changeFrequency:"hourly",  priority:0.8 },
    { url:`${BASE}/requests`,                        changeFrequency:"daily",   priority:0.8 },
    { url:`${BASE}/blog`,                            changeFrequency:"weekly",  priority:0.7 },
    { url:`${BASE}/blog/cheap-houses-in-osogbo`,     changeFrequency:"monthly", priority:0.8 },
    { url:`${BASE}/blog/shops-for-rent-in-osogbo`,   changeFrequency:"monthly", priority:0.8 },
    { url:`${BASE}/blog/best-areas-to-live-in-osogbo`,changeFrequency:"monthly",priority:0.8 },
    { url:`${BASE}/blog/property-prices-osogbo-2024`,changeFrequency:"monthly", priority:0.8 },
    { url:`${BASE}/auth/login`,                      changeFrequency:"monthly", priority:0.3 },
    { url:`${BASE}/auth/signup`,                     changeFrequency:"monthly", priority:0.4 },
  ];
}
