import Image from "next/image";
import type { Photo as PhotoData } from "@/content/site";
import { cx } from "@/lib/utils";

type Props = {
  photo: PhotoData;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Fill the parent (parent must be positioned and sized). */
  fill?: boolean;
  preload?: boolean;
  quality?: 60 | 75 | 85;
  position?: string;
};

export function Photo({ photo, alt, sizes, className, imgClassName, fill = true, preload, quality = 75, position }: Props) {
  if (fill) {
    return (
      <div className={cx("relative overflow-hidden", className)}>
        <Image
          src={photo.src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          preload={preload}
          placeholder="blur"
          blurDataURL={photo.blur}
          className={cx("object-cover", imgClassName)}
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    );
  }
  return (
    <Image
      src={photo.src}
      alt={alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      quality={quality}
      preload={preload}
      placeholder="blur"
      blurDataURL={photo.blur}
      className={cx("h-auto w-full", imgClassName, className)}
    />
  );
}
