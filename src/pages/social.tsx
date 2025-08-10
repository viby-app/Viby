"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import BusinessCard from "~/components/businessCard";
import Layout from "~/components/layout";
import UserCard from "~/components/userCard";
import { useCurrentLocation } from "~/hooks/userLocationHook";
import { api } from "~/utils/api";
import { hebrewDictionary } from "~/utils/constants";

const BUSINESSES_PER_PAGE = 2;

const SocialPage = () => {
  const { location } = useCurrentLocation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: loadingBusinesses,
    isFetchingNextPage,
  } = api.business.getRecommendedBusinesses.useInfiniteQuery(
    { location, limit: BUSINESSES_PER_PAGE },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!location,
    },
  );

  const { data: friendsOfFriends, isLoading: loadingFriends } =
    api.user.getRecommendedUsers.useQuery();

  const allBusinesses = useMemo(
    () => data?.pages.flatMap((page) => page.businesses) ?? [],
    [data],
  );

  const [currentPage, setCurrentPage] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const totalPages = data ? data.pages.length : 0;

  useEffect(() => {
    if (hasNextPage && currentPage >= totalPages - 2) {
      console.log("Prefetching next page");
      fetchNextPage();
    }
  }, [currentPage, fetchNextPage, hasNextPage, totalPages]);

  const onScroll = () => {
    if (!carouselRef.current) return;
    console.log("onScroll called");
    const { scrollLeft, offsetWidth } = carouselRef.current;
    const newPage = Math.round(scrollLeft / offsetWidth);
    if (newPage !== currentPage) setCurrentPage(newPage);
  };

  useEffect(() => {
    if (!carouselRef.current) return;
    const pageWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({
      left: pageWidth * currentPage,
      behavior: "smooth",
    });
    console.log(`Scrolled to page ${currentPage}`);
  }, [currentPage]);

  if (loadingBusinesses || loadingFriends) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <p>{hebrewDictionary.loading}</p>
        </div>
      </Layout>
    );
  }

  if (allBusinesses.length === 0 && (friendsOfFriends?.length ?? 0) === 0) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <p>{hebrewDictionary.noResults}</p>
        </div>
      </Layout>
    );
  }

  const renderBusinessPages = () => {
    return Array.from({ length: totalPages }, (_, pageIndex) => {
      const start = pageIndex * BUSINESSES_PER_PAGE;
      const pageBusinesses = allBusinesses.slice(
        start,
        start + BUSINESSES_PER_PAGE,
      );
      return (
        <div
          key={pageIndex}
          className="w-full flex-shrink-0 snap-center px-4"
          aria-hidden={currentPage !== pageIndex}
        >
          <div className="grid grid-cols-1 grid-rows-2 gap-4">
            {pageBusinesses.map((b) => (
              <BusinessCard key={b.id} businessId={b.id} />
            ))}
          </div>
        </div>
      );
    });
  };

  const renderDots = () => {
    const dotsCount = hasNextPage ? totalPages + 1 : totalPages;
    return (
      <div className="mt-2 flex justify-center space-x-2">
        {Array.from({ length: dotsCount }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-transform duration-300 ${
              currentPage * -1 === i
                ? "scale-125 bg-[#48A6A7]"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex max-h-1/2 w-full flex-col items-center p-4">
        {allBusinesses.length > 0 && (
          <>
            <h1 className="mb-4 w-full text-start text-2xl font-bold">
              {hebrewDictionary.suggestedBusinesses}
            </h1>

            <div
              ref={carouselRef}
              onScroll={onScroll}
              className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {renderBusinessPages()}
            </div>

            {renderDots()}

            {isFetchingNextPage && (
              <p className="mt-2 text-gray-500">{hebrewDictionary.loading}</p>
            )}
          </>
        )}
      </div>
      <div className="flex max-h-1/2 w-full flex-col items-center p-4">
        {friendsOfFriends && friendsOfFriends.length > 0 && (
          <>
            <h2 className="mb-4 w-full text-start text-2xl font-bold">
              {hebrewDictionary.suggestedFriends}
            </h2>
            <div className="max-h-96 w-11/12 overflow-auto rounded-xl bg-white px-4 opacity-70 shadow-inner">
              {friendsOfFriends.map((friend) => (
                <UserCard
                  key={friend.id}
                  id={friend.id}
                  name={friend.name}
                  image={friend.image}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SocialPage;
