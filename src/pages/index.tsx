import BusinessCard from "~/components/bussinesCard";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

export default function HomePage() {
  const myBusinesses = api.business.getFollowedBusinessesByUser.useQuery();
  const allBusinesses =
    api.business.getAllBusinessesWithoutFollowing.useQuery();

  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center py-2">
        <h1 className="mt-5 text-4xl font-bold">ברוכים הבאים ל viby</h1>
        <div className="mt-10 w-full px-5">
          <h2 className="mb-4 text-2xl font-bold">העסקים שלי</h2>
          {myBusinesses.isLoading ? (
            <span className="loading loading-dots loading-md" />
          ) : myBusinesses.data?.length === 0 ||
            myBusinesses.data === undefined ? (
            <p className="text-lg">לא עוקב אחרי עסקים</p>
          ) : (
            <div className="flex w-full snap-x snap-mandatory space-x-4 overflow-x-auto p-2 lg:max-w-none">
              {myBusinesses.data.map((followedBusiness) => (
                <BusinessCard
                  id={followedBusiness.business.id}
                  key={followedBusiness.business.id}
                  name={followedBusiness.business.name}
                  description={followedBusiness.business.description}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-10 mb-5 w-full px-5">
          <h2 className="mb-4 text-2xl font-bold">עסקים שעוד לא הכרת</h2>
          <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allBusinesses.isLoading ? (
              <span className="loading loading-dots loading-md" />
            ) : allBusinesses.data?.length === 0 ||
              allBusinesses.data === undefined ? (
              <p className="text-lg">עדיין אין לנו עסקים להציג לך</p>
            ) : (
              <div className="flex max-h-full w-full flex-col justify-center space-y-4 overflow-x-scroll p-2 lg:max-w-none">
                {allBusinesses.data.map((business) => (
                  <BusinessCard
                    key={business.id}
                    id={business.id}
                    name={business.name}
                    description={business.description}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
