"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { getPropertyPlaceholder } from "@/lib/utils";

interface Props { images: string[]; title: string; type: string; }

export function PropertyGallery({ images, title, type }: Props) {
  const all = images.length > 0 ? images : [getPropertyPlaceholder(type)];
  const [idx,       setIdx]       = useState(0);
  const [lightbox,  setLightbox]  = useState(false);

  const prev = () => setIdx(i => (i === 0 ? all.length - 1 : i - 1));
  const next = () => setIdx(i => (i === all.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="bg-white rounded-[14px] border border-[#ddeae0] overflow-hidden">
        {/* Main image */}
        <div className="relative h-[300px] md:h-[420px] group cursor-zoom-in" onClick={() => setLightbox(true)}>
          <Image src={all[idx]} alt={`${title} — ${idx + 1}`} fill priority
            className="object-cover" sizes="(max-width:1024px) 100vw,66vw" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Counter */}
          <div className="absolute bottom-4 right-4 bg-black/55 text-white text-[12px] font-medium px-3 py-1 rounded-full">
            {idx + 1} / {all.length}
          </div>
          {/* Nav arrows */}
          {all.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {all.length > 1 && (
          <div className="flex gap-2 p-3 bg-[#F9FCF9] overflow-x-auto scrollbar-hide">
            {all.map((img, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-[8px] overflow-hidden border-2 transition-all ${
                  i === idx ? "border-brand-500 opacity-100" : "border-transparent opacity-50 hover:opacity-75"
                }`}>
                <Image src={img} alt={`Thumb ${i+1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-[80vh]"
            onClick={e => e.stopPropagation()}>
            <Image src={all[idx]} alt={title} fill className="object-contain" sizes="100vw" />
          </div>
          {all.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
