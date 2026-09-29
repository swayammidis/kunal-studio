"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/site";
import { GALLERY_EVENT, type GalleryRequest } from "@/lib/gallery";
import { track } from "@/lib/analytics";

// The lightbox is only downloaded the first time someone opens a story.
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

export function GalleryHost() {
  const [req, setReq] = useState<GalleryRequest | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<GalleryRequest>).detail;
      opener.current = document.activeElement as HTMLElement | null;
      setReq(detail);
      track("portfolio_open", { project: detail.slug });
    };
    window.addEventListener(GALLERY_EVENT, onOpen);
    return () => window.removeEventListener(GALLERY_EVENT, onOpen);
  }, []);

  const project = req ? projects.find((p) => p.slug === req.slug) : undefined;
  if (!req || !project) return null;

  return (
    <Lightbox
      project={project}
      startIndex={req.index ?? 0}
      onClose={() => {
        setReq(null);
        opener.current?.focus();
      }}
    />
  );
}
