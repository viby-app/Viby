import Head from "next/head";
import BusinessCard from "~/components/bussinesCard";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

export default function HomePage() {
  const myBusinesses = api.business.getFollowedBusinessesByUser.useQuery();
  const allBusinesses = api.business.getAllBusinesses.useQuery();

  return (
    <html lang="he" dir="rtl">
      <Head>
        <title>Viby</title>
        <meta
          name="description"
          content="Where you love to manage your appointments"
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Layout>
        <div className="flex min-h-screen flex-col items-center bg-[#F2EFE7] py-2">
          <h1 className="mt-5 text-4xl font-bold">ברוכים הבאים ל viby</h1>
          <p className="mt-4 text-lg">הפתרון שלך לניהול לקוחות</p>

          {/* My Businesses */}
          <div className="mt-10 w-full px-5">
            <h2 className="mb-4 text-2xl font-bold">העסקים שלי</h2>
            {myBusinesses.isLoading ? (
              <span className="loading loading-dots loading-md" />
            ) : myBusinesses.data?.length === 0 ||
              myBusinesses.data === undefined ? (
              <p className="text-lg">לא עוקב אחרי עסקים</p>
            ) : (
              <div className="flex w-full max-w-6xl snap-x snap-mandatory space-x-4 overflow-x-auto p-2 lg:max-w-none">
                {myBusinesses.data.map((followedBusiness) => (
                  <BusinessCard
                    key={followedBusiness.business.id}
                    businessName={followedBusiness.business.name}
                    description={followedBusiness.business.description}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Explore Section */}
          <div className="mt-10 mb-5 w-full px-5">
            <h2 className="mb-4 text-2xl font-bold">עסקים שעוד לא הכרת</h2>
            <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allBusinesses.isLoading ? (
                <span className="loading loading-dots loading-md" />
              ) : allBusinesses.data?.length === 0 ||
                allBusinesses.data === undefined ? (
                <p className="text-lg">עדיין אין לנו עסקים להציג לך</p>
              ) : (
                <div className="flex w-full max-w-6xl snap-x snap-mandatory space-x-4 overflow-x-auto p-2 lg:max-w-none">
                  {allBusinesses.data.map((business) => (
                    <BusinessCard
                      key={business.id}
                      businessName={business.name}
                      description={business.description}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </html>
  );
}
