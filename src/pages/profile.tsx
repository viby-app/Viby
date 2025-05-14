import React, { useEffect } from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { CircleUserIcon } from "lucide-react";
import { hayushim } from "../utils/constants";
import { useState } from "react";


const ProfilePage = () => {
    const { data: user, isLoading: isUserLoading } = api.profile.getUser.useQuery();
    const [userFullName, setUserFullName] = useState("");

    useEffect(() => {
        if (user?.fullName) {
            setUserFullName(user.fullName);
        }
    }, [user]);


    if (isUserLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            {user && (
                <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md text-right space-y-9">
                    <h1 className="text-5xl font-bold text-right">{hayushim} {user.firstName}!</h1>

                    <div className="flex flex-row-reverse items-center justify-end gap-4">
                        <p className="text-lg font-semibold">{user.fullName}</p>
                        {user.image ? (
                            <img
                                src={user.image}
                                alt="User"
                                className="w-15 h-15 rounded-full object-cover"
                            />
                        ) : (
                            <CircleUserIcon className="w-24 h-24 text-gray-400" />
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            value={userFullName ?? "כגדגעכג"}
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