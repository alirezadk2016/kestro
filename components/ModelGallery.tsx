"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import type { Model } from "@/lib/models";

export default function ModelGallery({
  images,
  lang,
  name,
  note,
}: {
  images: NonNullable<Model["images"]>;
  lang: Lang;
  name: string;
  note: string;
}) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const da = lang === "da";
  const item = images[selected];
  const step = (offset: number) =>
    setSelected((index) => (index + offset + images.length) % images.length);
  useEffect(() => {
    if (!zoomed || !dialog.current) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previous;
    };
  }, [zoomed]);
  if (!item) return null;
  const iconClass =
    "inline-flex h-11 w-11 flex-none items-center justify-center rounded border border-white/20 bg-brand-950 text-paper hover:border-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300";
  return (
    <div className="space-y-3 sm:space-y-4">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={da ? `Forstør billede af ${name}` : `Enlarge photo of ${name}`}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-paper-dim ring-1 ring-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
      >
        <Image
          src={item.src}
          alt={item.alt[lang]}
          width={1179}
          height={1120}
          quality={85}
          sizes="(max-width: 1024px) 92vw, 460px"
          priority={selected === 0}
          className="h-full w-full object-contain p-3 mix-blend-multiply sm:p-6"
        />
        <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded border border-ink-200 bg-paper text-ink-800">
          <ZoomIn size={20} aria-hidden="true" />
        </span>
      </button>
      <div
        className="grid grid-cols-4 gap-2 sm:gap-3"
        role="group"
        aria-label={da ? "Produktbilleder" : "Product photos"}
      >
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            aria-label={`${index + 1}: ${image.alt[lang]}`}
            className={`aspect-[4/3] min-h-11 overflow-hidden rounded border-2 bg-paper-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 ${selected === index ? "border-brand-300" : "border-transparent hover:border-ink-400"}`}
          >
            <Image
              src={image.src}
              alt=""
              width={295}
              height={280}
              quality={75}
              sizes="(max-width: 640px) 22vw, 110px"
              className="h-full w-full object-contain p-2 mix-blend-multiply"
            />
          </button>
        ))}
      </div>
      <p className="pt-1 text-sm leading-[1.6] text-paper/65">{note}</p>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClose={() => setZoomed(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setZoomed(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
        className="m-auto max-h-[calc(100svh-2rem)] w-[min(96vw,1100px)] max-w-none overflow-y-auto rounded-lg border border-white/20 bg-brand-950 p-0 text-paper backdrop:bg-black/85"
      >
        {zoomed && (
          <div className="p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p id={titleId} className="min-w-0 text-sm font-semibold">
                {name}{" "}
                <span className="text-paper/75">
                  · {selected + 1}/{images.length}
                </span>
              </p>
              <button
                autoFocus
                type="button"
                onClick={() => setZoomed(false)}
                aria-label={da ? "Luk billeder" : "Close photos"}
                title={da ? "Luk" : "Close"}
                className={iconClass}
              >
                <X aria-hidden="true" size={22} />
              </button>
            </div>
            <div className="relative flex h-[min(65svh,calc(100svh-220px),700px)] items-center justify-center rounded bg-paper-dim">
              <Image
                src={item.src}
                alt={item.alt[lang]}
                fill
                quality={90}
                sizes="(max-width: 1100px) 94vw, 1060px"
                className="object-contain p-4 mix-blend-multiply sm:p-8"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={da ? "Forrige billede" : "Previous photo"}
                title={da ? "Forrige billede" : "Previous photo"}
                className={iconClass}
              >
                <ChevronLeft aria-hidden="true" size={24} />
              </button>
              <p className="text-center text-sm leading-6 text-paper/85" aria-live="polite">
                {item.alt[lang]}
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={da ? "Næste billede" : "Next photo"}
                title={da ? "Næste billede" : "Next photo"}
                className={iconClass}
              >
                <ChevronRight aria-hidden="true" size={24} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
