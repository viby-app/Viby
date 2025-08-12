"use client";

import { useState, useEffect, useMemo } from "react";
import Layout from "~/components/layout";
import { useCurrentLocation } from "~/hooks/userLocationHook";
import { api } from "~/utils/api";
import { hebrewDictionary } from "~/utils/constants";

import BusinessesCarousel from "./components/BusinessesCarousel";
import FriendsList from "./components/FriendsList";

const BUSINESSES_PER_PAGE = 2;
const FRIENDS_PER_PAGE = 10;

export default function SocialPage() {
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

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (currentPage >= (recommandedBusinesses?.pages.length ?? 0) - 1) {
      void fetchMoreBusinesses();
    }
  }, [
    currentPage,
    hasNextPage,
    isFetchingNextPage,
    fetchMoreBusinesses,
    recommandedBusinesses,
  ]);

  if (loadingBusinesses || loadingFriends) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="loading loading-infinity loading-xl" />
        </div>
      </Layout>
    );
  }

  if (allBusinesses.length === 0 && friendsOfFriends.length === 0) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <p>{hebrewDictionary.noResults}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BusinessesCarousel
        businesses={allBusinesses}
        totalPages={recommandedBusinesses?.pages.length ?? 0}
        perPage={BUSINESSES_PER_PAGE}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hasNextPage={hasNextPage}
      />
      <FriendsList
        friends={friendsOfFriends}
        fetchMoreFriends={fetchMoreFriends}
        hasMoreFriends={hasMoreFriends}
        loadingMoreFriends={loadingMoreFriends}
      />
    </Layout>
  );
}
