"use client";

import BusinessCard from "~/components/businessCard";
import Layout from "~/components/layout";
import UserCard from "~/components/userCard";
import { useCurrentLocation } from "~/hooks/userLocationHook";
import { api } from "~/utils/api";
import { hebrewDictionary } from "~/utils/constants";

const SocialPage = () => {
  const { location } = useCurrentLocation();
  const { data: businessesFriendsFollowing, isLoading: loadingBusinesses } =
    api.business.getRecommendedBusinesses.useQuery({ location });
  const { data: friendsOfFriends, isLoading: loadingFriends } =
    api.user.getRecommendedUsers.useQuery();

  if (loadingBusinesses || loadingFriends) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <p>{hebrewDictionary.loading}</p>
        </div>
      </Layout>
    );
  }

  if (
    businessesFriendsFollowing?.length === 0 &&
    friendsOfFriends?.length === 0
  ) {
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
      <div className="flex max-h-1/2 flex-col items-center p-4">
        {businessesFriendsFollowing &&
          businessesFriendsFollowing.length > 0 && (
            <>
              <h1 className="mb-4 w-full text-start text-2xl font-bold">
                {hebrewDictionary.suggestedBusinesses}
              </h1>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {businessesFriendsFollowing.map((business) => (
                  <BusinessCard key={business.id} businessId={business.id} />
                ))}
              </div>
            </>
          )}
      </div>
      <div className="flex max-h-1/2 flex-col items-center p-4">
        {friendsOfFriends && friendsOfFriends.length > 0 && (
          <>
            <h2 className="mb-4 w-full text-start text-2xl font-bold">
              {hebrewDictionary.suggestedFriends}
            </h2>
            <div className="w-11/12 rounded-xl bg-white px-4">
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
