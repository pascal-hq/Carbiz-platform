"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
}

const THUMB = "5rem"; // main strip thumbnails
const THUMB_FS = "3.5rem"; // fullscreen strip thumbnails

const arrowBase =
  "absolute top-1/2 -translate-y-1/2 rounded-full transition " +
  "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

function Thumb({
  img,
  index,
  active,
  size,
  onSelect,
  className,
  buttonRef,
}: {
  img: GalleryImage;
  index: number;
  active: boolean;
  size: string;
  onSelect: (i: number) => void;
  className?: string;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={() => onSelect(index)}
      aria-label={`View image ${index + 1}`}
      aria-current={active ? "true" : undefined}
      // Inline sizing so global CSS / missing utilities can't blow it up
      style={{ width: size, height: size, flex: `0 0 ${size}` }}
      className={cn("overflow-hidden border-2 transition", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ width: "100%", height: "100%", maxWidth: "none", objectFit: "cover" }}
      />
    </button>
  );
}

export function VehicleGallery({
  images,
  alt,
}: {
  images: GalleryImage[];
  alt: string;
}) {
  const sorted = useMemo(
    () =>
      [...images].sort(
        (a, b) =>
          a.display_order - b.display_order ||
          Number(b.is_primary) - Number(a.is_primary)
      ),
    [images]
  );
  const total = sorted.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const fsStripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fsThumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  // Clamp if the image list shrinks
  useEffect(() => {
    if (activeIndex > Math.max(total - 1, 0)) setActiveIndex(0);
  }, [total, activeIndex]);

  const prev = useCallback(
    () => setActiveIndex((i) => (i === 0 ? total - 1 : i - 1)),
    [total]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i === total - 1 ? 0 : i + 1)),
    [total]
  );

  // Keyboard: only while fullscreen is open
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, prev, next]);

  // Lock body scroll + manage focus
  useEffect(() => {
    if (!fullscreen) return;
    const trigger = openBtnRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [fullscreen]);

  // Keep active thumbnail visible (scrolls the strip only, not the page)
  const centerThumb = (strip: HTMLDivElement | null, thumb: HTMLButtonElement | null) => {
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    centerThumb(stripRef.current, thumbRefs.current[activeIndex]);
    if (fullscreen) centerThumb(fsStripRef.current, fsThumbRefs.current[activeIndex]);
  }, [activeIndex, fullscreen]);

  // Preload neighbours
  useEffect(() => {
    if (total < 2) return;
    [(activeIndex + 1) % total, (activeIndex - 1 + total) % total].forEach((i) => {
      const img = new Image();
      img.src = sorted[i].url;
    });
  }, [activeIndex, total, sorted]);

  // Swipe
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchStartX.current === null || total < 2) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
    },
  };

  if (total === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        No images available
      </div>
    );
  }

  const active = sorted[activeIndex];
  const activeAlt = total > 1 ? `${alt} - image ${activeIndex + 1} of ${total}` : alt;

  return (
    <>
      <div className="min-w-0 space-y-3">
        {/* Main image */}
        <div
          className="group relative aspect-video overflow-hidden rounded-xl bg-black"
          {...swipe}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.url}
            alt={activeAlt}
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover"
          />

          <button
            ref={openBtnRef}
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="View fullscreen"
            className="absolute right-3 top-3 rounded-lg bg-black/60 p-2 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className={cn(
                  arrowBase,
                  "left-3 bg-white/90 p-2 text-black shadow-lg hover:bg-white md:p-3",
                  "md:opacity-0 md:group-hover:opacity-100"
                )}
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className={cn(
                  arrowBase,
                  "right-3 bg-white/90 p-2 text-black shadow-lg hover:bg-white md:p-3",
                  "md:opacity-0 md:group-hover:opacity-100"
                )}
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              <div
                aria-live="polite"
                className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-sm text-white backdrop-blur-sm"
              >
                {activeIndex + 1} of {total}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div ref={stripRef} className="flex w-full max-w-full gap-2 overflow-x-auto pb-1">
            {sorted.map((img, i) => (
              <Thumb
                key={img.id}
                img={img}
                index={i}
                active={i === activeIndex}
                size={THUMB}
                onSelect={setActiveIndex}
                buttonRef={(el) => {
                  thumbRefs.current[i] = el;
                }}
                className={cn(
                  "rounded-lg",
                  i === activeIndex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent hover:border-gray-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          {...swipe}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            aria-live="polite"
            className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-4 py-2 text-sm text-white"
          >
            {activeIndex + 1} of {total}
          </div>

          <div className="flex h-full w-full items-center justify-center p-4 pb-24 md:p-16 md:pb-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.url}
              alt={activeAlt}
              draggable={false}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:p-4"
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:p-4"
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </button>

              <div
                ref={fsStripRef}
                className="absolute bottom-4 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/50 p-2"
              >
                {sorted.map((img, i) => (
                  <Thumb
                    key={img.id}
                    img={img}
                    index={i}
                    active={i === activeIndex}
                    size={THUMB_FS}
                    onSelect={setActiveIndex}
                    buttonRef={(el) => {
                      fsThumbRefs.current[i] = el;
                    }}
                    className={cn(
                      "rounded",
                      i === activeIndex
                        ? "border-white"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}