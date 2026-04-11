import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F8F5] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-5">🏚️</div>
        <h1 className="text-[28px] font-extrabold text-[#1C2B22] mb-2">Page Not Found</h1>
        <p className="text-[#7a9a7e] mb-7 leading-relaxed">This property or page doesn&apos;t exist or may have been removed. Browse our active listings to find your perfect property.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/"           className="btn-primary">Go Home</Link>
          <Link href="/properties" className="btn-outline">Browse Listings</Link>
        </div>
      </div>
    </div>
  );
}

