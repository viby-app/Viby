"use client";

import React from "react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loadingSpinner";
import UserProfilePage from "~/components/profileComponents/userProfilePage";
import BusinessProfilePage from "~/components/profileComponents/businessProfilePage";

const ProfilePage = () => {
  const { data: user, isLoading: isUserLoading } = api.user.getUser.useQuery();

  if (isUserLoading) {
    return LoadingSpinner();
  }

  return user?.role === "USER" ? (
    <UserProfilePage isUserLoading={isUserLoading} user={user} />
  ) : user?.role === "BUSINESS_OWNER" ? (
    <BusinessProfilePage isUserLoading={isUserLoading} user={user} />
  ) : (
    <div></div>
  );
};

export default ProfilePage;
