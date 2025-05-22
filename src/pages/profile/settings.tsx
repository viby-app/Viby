import React, { useEffect, useState } from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { signOut } from "next-auth/react";
import Button from "~/components/button";

const settingsPage = () => {
    const { data: user, isLoading: isUserLoading } = api.profile.getUser.useQuery();

    return (
        <Layout>
            <div className="bg-[#F2EFE7] flex items-center justify-center">
                <div className="flex flex-col w-full rounded-lg p-3 shadow-lg min-h-screen m-5 bg-white">
                    <div className="flex-grow">
                        <Button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-primary">
                            log out
                        </Button>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default settingsPage;
