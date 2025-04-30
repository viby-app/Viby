import Head from "next/head";
import BusinessCard from "~/components/bussinesCard";
import Layout from "~/components/layout";

export default function HomePage() {
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
            <div className="flex w-full max-w-6xl snap-x snap-mandatory space-x-4 overflow-x-auto p-2 lg:max-w-none">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="snap-start">
                  <BusinessCard businessName={`מספרה ${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Explore Section */}
          <div className="mt-10 mb-5 w-full px-5">
            <h2 className="mb-4 text-2xl font-bold">עסקים שעוד לא הכרת</h2>
            <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {["Beauty Salon", "Yoga Studio", "Photography", "Tutoring"].map(
                (business, i) => (
                  <BusinessCard key={i} businessName={business} />
                ),
              )}
            </div>
          </div>
        </div>
      </Layout>
    </html>
  );
}
