import Image from "next/image";
import { useMemo } from "react";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
}

function ImageWithDynamicSrc({ src, alt, width, height }: Props) {
  const image = useMemo(() => {
    return (
      <Image
        width={width}
        height={height}
        src={src}
        className="rounded-box w-full"
        alt={alt}
      />
    );
  }, [src]);

  return image;
}

export default ImageWithDynamicSrc;
