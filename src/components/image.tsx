import Image from "next/image";
import { useMemo } from "react";
import { cn } from "../lib/utils";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

function ImageWithDynamicSrc({ className, src, alt, width, height }: Props) {
  const image = useMemo(() => {
    return (
      <Image
        width={width}
        height={height}
        src={src}
        className={cn(
          "rounded-box w-full",
          className,
        )}
        alt={alt}
      />
    );
  }, [src]);

  return image;
}

export default ImageWithDynamicSrc;
