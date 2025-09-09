"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import BusinessCard from "~/components/businessCard";
import Layout from "~/components/layout";
import UserCard from "~/components/userCard";
import { useCurrentLocation } from "~/hooks/userLocationHook";
import { api } from "~/utils/api";
import { hebrewDictionary } from "~/utils/constants";

const BUSINESSES_PER_PAGE = 2;
const FRIENDS_PER_PAGE = 10;

const SocialPage = () => {
  const { location } = useCurrentLocation();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: recommandedBusinesses,
    fetchNextPage: fetchMoreBusinesses,
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

  const {
    data: friendsPages,
    fetchNextPage: fetchMoreFriends,
    hasNextPage: hasMoreFriends,
    isFetchingNextPage: loadingMoreFriends,
    isLoading: loadingFriends,
  } = api.user.getRecommendedUsers.useInfiniteQuery(
    { limit: FRIENDS_PER_PAGE },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const friendsOfFriends = useMemo(
    () => friendsPages?.pages.flatMap((page) => page.users) ?? [],
    [friendsPages],
  );

  const allBusinesses = useMemo(
    () => recommandedBusinesses?.pages.flatMap((page) => page.businesses) ?? [],
    [recommandedBusinesses],
  );

  const friendsListRef = useRef<HTMLDivElement>(null);

  const onFriendsScroll = () => {
    if (!friendsListRef.current || !hasMoreFriends || loadingMoreFriends)
      return;

    const { scrollTop, scrollHeight, clientHeight } = friendsListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      void fetchMoreFriends();
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);

  // Number of fully rendered pages based on loaded businesses
  const renderedPages = useMemo(() => {
    const totalBusinesses = allBusinesses.length;
    return Math.ceil(totalBusinesses / BUSINESSES_PER_PAGE);
  }, [allBusinesses.length]);

  // Detect Safari to work around scroll snapping/smooth issues that cause jumps
  const isSafari = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    const isSafariLike = /Version\/[\d.]+.*Safari/.test(ua);
    const isNotChrome = !/Chrome|Chromium|Edg/.test(ua);
    return isSafariLike && isNotChrome;
  }, []);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (currentPage >= renderedPages - 1) {
      void fetchMoreBusinesses();
    }
  }, [
    currentPage,
    renderedPages,
    hasNextPage,
    isFetchingNextPage,
    fetchMoreBusinesses,
  ]);

  // Keep scroll position stable on Safari only to avoid jumpy behavior
  useEffect(() => {
    if (!isSafari) return;
    const el = carouselRef.current;
    if (!el) return;
    const pageWidth = el.offsetWidth;
    const targetLeft = currentPage * pageWidth;
    el.scrollTo({ left: targetLeft, behavior: "auto" });
  }, [renderedPages, currentPage, isSafari]);

  const onBusinessesScroll = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
    const width = clientWidth || 1;
    const rawIndex = scrollLeft / width;
    let nextIndex = Math.round(rawIndex);
    const maxRenderedIndex = Math.max(0, renderedPages - 1);
    // If user flings to the very end and more pages exist, allow a visual "loading" dot
    const atVeryEnd = scrollLeft + clientWidth >= scrollWidth - 2;
    if (hasNextPage && atVeryEnd) {
      nextIndex = renderedPages; // one past last rendered page for dots
    } else {
      nextIndex = Math.min(Math.max(0, nextIndex), maxRenderedIndex);
    }
    if (nextIndex !== currentPage) setCurrentPage(nextIndex);
  };

  if (loadingBusinesses || loadingFriends) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="loading loading-infinity loading-xl" />
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
    return Array.from({ length: renderedPages }, (_, pageIndex) => {
      const start = pageIndex * BUSINESSES_PER_PAGE;
      const pageBusinesses = allBusinesses.slice(
        start,
        start + BUSINESSES_PER_PAGE,
      );
      return (
        <div
          key={pageIndex}
          className="w-full flex-shrink-0 snap-center snap-always px-4"
        >
          <div className="grid grid-cols-1 grid-rows-2 gap-4">
            {pageBusinesses.map((business) => (
              <BusinessCard key={business.id} businessId={business.id} />
            ))}
          </div>
        </div>
      );
    });
  };

  const renderDots = () => {
    const dotsCount = hasNextPage ? renderedPages + 1 : renderedPages;
    return (
      <div className="mt-2 flex justify-center space-x-2">
        {Array.from({ length: dotsCount }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-transform duration-300 ${
              currentPage === i
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
              onScroll={onBusinessesScroll}
              className={`scrollbar-hide flex w-full touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-contain ${
                isSafari ? "" : "scroll-smooth"
              }`}
            >
              {renderBusinessPages()}
            </div>
            {renderDots()}
          </>
        )}
      </div>
      <div className="flex items-center justify-center">
        <div
          ref={friendsListRef}
          onScroll={onFriendsScroll}
          className="max-h-96 w-11/12 overflow-auto rounded-xl bg-white px-4 opacity-70 shadow-inner"
        >
          {friendsOfFriends.map((friend) => (
            <UserCard
              key={friend.id}
              id={friend.id}
              name={friend.name}
              image={friend.image}
            />
          ))}
          {loadingMoreFriends && (
            <div className="flex justify-center py-2">
              <div className="loading loading-spinner loading-sm" />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SocialPage;
