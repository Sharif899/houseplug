import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent:"*", allow:"/", disallow:["/dashboard/","/api/","/auth/callback"] },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL||"https://houseplug.ng"}/sitemap.xml`,
  };
}
