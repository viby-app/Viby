import React, { useEffect, useState } from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { CircleUserIcon, MenuIcon } from "lucide-react";
import { hebrewDictionary } from "../../utils/constants";
import Link from "next/link";
import Image from "next/image";

const ProfilePage = () => {
    const { data: user, isLoading: isUserLoading } = api.profile.getUser.useQuery();
    const { data: linkedUsers } = api.profile.getUserFriends.useQuery();

    const [userFriends, setUserFriends] = useState<number>(0);

    useEffect(() => {
        if (linkedUsers) {
            setUserFriends(linkedUsers.length);
        }
    }, [linkedUsers]);

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <div className="loading w-16 h-16"></div>
            </div>
        );

    }

    return (
        <Layout>
            <div className="bg-[#428e9d82] flex items-center justify-center">
                <div className="flex flex-col w-full rounded-2xl p-3 shadow-lg min-h-screen m-5 bg-white">
                    {user && (
                        <>
                            <div>
                                <div className="text-right flex items-center justify-between flex-row-reverse">
                                    <Link href="/profile/settings" className="hover:bg-gray-300 transition duration-200 p-2 rounded-full">
                                        <MenuIcon className="w-6 h-6 text-gray-800" />
                                    </Link>
                                    <h1 className="text-4xl font-extrabold text-gray-800">
                                        {hebrewDictionary.hey} {user.firstName}!
                                    </h1>
                                </div>

                                <div className="flex items-center justify-between m-4">
                                    <div className="flex items-center gap-4">
                                        {user?.image ? (
                                            <>
                                                <Image
                                                    src={user.image}
                                                    alt="User"
                                                    width={64}
                                                    height={64}
                                                    className={`w-16 h-16 rounded-full object-cover transition-opacity duration-500`}
                                                />
                                            </>
                                        ) : (
                                            <CircleUserIcon className="w-16 h-16 text-gray-300" />
                                        )}
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">{hebrewDictionary.friends}</p>
                                        <p className="text-2xl font-bold text-gray-800">{userFriends}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="divider my-0.5"></div>

                            <div>
                                <Link
                                    href="/profile/personalDetails"
                                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-white hover:bg-gray-300 transition duration-200"
                                >
                                    <h4 className="text-xl font-semibold text-gray-800">{hebrewDictionary.personalDetails}</h4>
                                    <svg
                                        className="w-6 h-6 text-gray-600 transform"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div className="divider my-0.5"></div>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3">
                                <h4 className="text-xl font-semibold text-gray-800">{hebrewDictionary.myLastVisit}</h4>
                            </div>
                            <div className="divider my-0.5"></div>
                            <div className="flex flex-col items-start gap-2 px-4 py-3">
                                <h4 className="text-xl font-semibold text-gray-800">
                                    {hebrewDictionary.links}
                                </h4>

                                <Link
                                    href="/profile/"
                                    className="flex justify-between items-center w-full hover:bg-gray-300 transition duration-200 p-2 rounded-full"
                                >
                                    <h6 className="text-base font-semibold text-gray-800">
                                        {hebrewDictionary.inviteFriends}
                                    </h6>
                                    <svg
                                        className="w-6 h-6 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/profile/"
                                    className="flex justify-between items-center w-full hover:bg-gray-300 transition duration-200 p-2 rounded-full"
                                >
                                    <h6 className="text-base font-semibold text-gray-800">
                                        {hebrewDictionary.appointmentsHistory}
                                    </h6>
                                    <svg
                                        className="w-6 h-6 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                                                <Link
                                    href="/profile/"
                                    className="flex justify-between items-center w-full hover:bg-gray-300 transition duration-200 p-2 rounded-full"
                                >
                                    <h6 className="text-base font-semibold text-gray-800">
                                        {hebrewDictionary.chatInvite}
                                    </h6>
                                    <svg
                                        className="w-6 h-6 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="divider my-0.5"></div>

                            <div>
                                <Link
                                    href="/profile/"
                                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-white hover:bg-gray-300 transition duration-200"
                                >
                                    <h4 className="text-xl font-semibold text-gray-800">{hebrewDictionary.paymentAddress}</h4>
                                    <svg
                                        className="w-6 h-6 text-gray-600 transform"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div className="divider my-0.5"></div>
                            </div>
                        </>)}
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
