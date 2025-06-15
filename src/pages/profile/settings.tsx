import React from "react";
import Layout from "~/components/layout";
import { signOut } from "next-auth/react";
import Button from "~/components/button";
import { hebrewDictionary } from "~/utils/constants";
import Card from "~/components/cardComponent";

const settingsPage = () => {
  return (
    <Layout>
      <Card>
        <div className="flex-grow">
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn btn-primary"
          >
            {hebrewDictionary.logOut}
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default settingsPage;
