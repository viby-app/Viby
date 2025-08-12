import { useRef } from "react";
import BusinessCard from "~/components/businessCard";
import { hebrewDictionary } from "~/utils/constants";
import BusinessDots from "./BusinessDots";

interface Props {
  businesses: { id: number }[];
  totalPages: number;
  perPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hasNextPage: boolean;
}

export default function BusinessesCarousel({
  businesses,
  totalPages,
  perPage,
  currentPage,
  setCurrentPage,
  hasNextPage,
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const onBusinessesScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, offsetWidth } = carouselRef.current;
    const newPage = Math.round(scrollLeft / offsetWidth);
    if (newPage !== currentPage) setCurrentPage(-newPage);
  };

  const renderPages = () => {
    return Array.from({ length: totalPages }, (_, pageIndex) => {
      const start = pageIndex * perPage;
      const pageBusinesses = businesses.slice(start, start + perPage);
      return (
        <div key={pageIndex} className="w-full flex-shrink-0 snap-center px-4">
          <div className="grid grid-cols-1 grid-rows-2 gap-4">
            {pageBusinesses.map((business) => (
              <BusinessCard key={business.id} businessId={business.id} />
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex max-h-1/2 w-full flex-col items-center p-4">
      {businesses.length > 0 && (
        <>
          <h1 className="mb-4 w-full text-start text-2xl font-bold">
            {hebrewDictionary.suggestedBusinesses}
          </h1>
          <div
            ref={carouselRef}
            onScroll={onBusinessesScroll}
            className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
          >
            {renderPages()}
          </div>
          <BusinessDots
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
}
