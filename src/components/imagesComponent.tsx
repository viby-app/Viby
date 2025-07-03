import ImageWithDynamicSrc from "./image";
import { useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  isImagesLoading: boolean;
  isBusinessLoading: boolean;
}

const ImagesComponent = ({
  images,
  isImagesLoading,
  isBusinessLoading,
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentIndex(index);
            }
          });
        },
        {
          root: document.querySelector(".carousel"), // קונטיינר גלילה
          threshold: 0.6, // כמה אחוז מהתמונה צריך להיות גלוי
        },
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [images]);

  return (
    <div className="relative h-full w-full">
      <div className="flex h-full w-full flex-row justify-center overflow-x-auto">
        {(isImagesLoading || isBusinessLoading) && (
          <div className="skeleton h-48 w-48 animate-pulse rounded-md bg-gray-200" />
        )}
        {!isImagesLoading && images?.length === 0 && (
          <div className="skeleton h-48 w-48 rounded-md bg-gray-200" />
        )}

        <div className="carousel flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg">
          {images?.map((image, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="carousel-item w-full flex-shrink-0 snap-center"
            >
              <ImageWithDynamicSrc
                width={400}
                height={500}
                src={image}
                alt={`Business image`}
                className="rounded-md object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 bottom-2 left-0 flex justify-center space-x-2">
        {images?.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full transition ${
              currentIndex === index ? "bg-[#48A6A7]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagesComponent;
