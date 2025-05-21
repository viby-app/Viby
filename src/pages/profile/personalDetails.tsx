import React, { useEffect, useState } from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

const ProfilePage = () => {
    const { data: user, isLoading: isUserLoading } = api.profile.getUser.useQuery();
    const { data: linkedUsers } = api.profile.getUserFriends.useQuery();

    const [userFullName, setUserFullName] = useState("");
    const [userFriends, setUserFriends] = useState<number>(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (user?.name) {
            setUserFullName(user.name);
        }
    }, [user]);

    useEffect(() => {
        if (linkedUsers) {
            const friendsCount = linkedUsers.length;
            setUserFriends(friendsCount);
        }
    }, [linkedUsers]);

    if (isUserLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            {user && (
                <div className="flex flex-col items-center py-2 mb-2 justify-center min-h-screen bg-[#F2EFE7] px-4">

                    <div>
                        <input
                            type="text"
                            value={userFullName ?? ""}
                            onChange={(e) => setUserFullName(e.target.value)}
                            className="w-full text-lg font-semibold border border-gray-300 rounded px-3 py-2 bg-white text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">מייל:</label>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">טלפון:</label>
                        <p className="text-lg font-semibold">{user.phone}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">מגדר:</label>
                        <select
                            name="gender"
                            value={user.gender}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                        >
                            <option value="זכר">זכר</option>
                            <option value="נקבה">נקבה</option>
                            <option value="אחר">אחר</option>
                        </select>
                    </div>

                    <div className="text-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                            ערוך
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default ProfilePage;
