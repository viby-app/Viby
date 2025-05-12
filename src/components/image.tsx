import Image from "next/image";
import { useMemo } from "react";

function ImageWithDynamicSrc({ src, alt }: { src: string; alt?: string }) {
  const image = useMemo(() => {
    return <Image src={src} alt={alt ?? "pic"} />;
  }, [src]);

  return image;
}

export default ImageWithDynamicSrc;
