import { useMemo } from "react";

function ImageWithDynamicSrc({ src, alt }: { src: string; alt?: string }) {
  const image = useMemo(() => {
    return <img src={src} alt={alt} />;
  }, [src]);

  return image;
}

export default ImageWithDynamicSrc;
