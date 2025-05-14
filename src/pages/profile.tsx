import React from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { CircleUserIcon } from "lucide-react";

const ProfilePage = () => {
    const { data: user, isLoading: isUserLoading } = api.profile.getUser.useQuery();

    if (isUserLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            {
                user && (
                    <div style={{ maxWidth: '600px', margin: '0 auto', direction: 'rtl' }}>
                        <h1>פרטים אישיים</h1>
                        {
                            user?.image ? (
                                <img src={user.image} alt="User" />
                            ) : (
                                <CircleUserIcon />
                            )
                        }
                        <div>
                            <label>שם:</label>
                            <p>{user?.name}</p>
                        </div>

                        <div>
                            <label>מייל:</label>
                            <p>{user?.email}</p>
                        </div>

                        <div>
                            <label>טלפון:</label>
                            <p>{user?.phone}</p>
                        </div>

                        <div>
                            <label>מגדר:</label>

                            <select name="gender" value={user.gender}>
                                <option value="זכר">זכר</option>
                                <option value="נקבה">נקבה</option>
                                <option value="אחר">אחר</option>
                            </select>
                            <p>{user.gender}</p>

                        </div>
                        <button>ערוך</button>
                    </div>
                )
            }
        </Layout>

    );
}

export default ProfilePage;