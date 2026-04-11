import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const sb = createClient();
  const { data:{ user } } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL));

  const { data: prop } = await sb.from("properties").select("agent_id,images").eq("id", params.id).single();
  if (!prop || prop.agent_id !== user.id)
    return NextResponse.redirect(new URL("/dashboard?error=unauthorized", process.env.NEXT_PUBLIC_APP_URL!));

  if (prop.images?.length) {
    const paths = prop.images.map((u:string)=>{ const m=u.match(/property-images\/(.+)$/); return m?m[1]:null; }).filter(Boolean);
    if (paths.length) await sb.storage.from("property-images").remove(paths);
  }

  await sb.from("properties").delete().eq("id", params.id);
  return NextResponse.redirect(new URL("/dashboard?success=deleted", process.env.NEXT_PUBLIC_APP_URL!));
}
<<<<<<< HEAD
=======

>>>>>>> 546f6298eb2e50e5fd6f66f60c33b2386a2d1f7e
