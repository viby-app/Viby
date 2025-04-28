import Head from "next/head";
import BusinessCard from "~/components/bussinesCard";
import Layout from "~/components/layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Viby</title>
        <meta
          name="description"
          content="where you like to manage your appintments"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex min-h-screen flex-col items-center bg-[#F2EFE7] py-2">
          <h1 className="mt-5 text-4xl font-bold">Welcome to Viby</h1>
          <p className="mt-4 text-lg">Your appointment management solution.</p>

          <h2 className="font-bold">my businesses</h2>
          <div className="px-1 carousel max-w-full snap-x snap-always space-x-2 rounded-xl p-2">
            <div className="carousel-item snap-start">
              <BusinessCard businessName={"barbershop"} />
            </div>
            <div className="carousel-item snap-start">
              <BusinessCard businessName={"barbershop"} />
            </div>
            <div className="carousel-item snap-start">
              <BusinessCard businessName={"barbershop"} />
            </div>
            <div className="carousel-item snap-start">
              <BusinessCard businessName={"barbershop"} />
            </div>
          </div>
          <h2 className="ml-5 self-start font-bold">explore new businesses</h2>

          <div className="custom-scrollbar grid h-full w-full grid-cols-1 flex-col gap-2 space-y-2 space-x-2 self-center overflow-auto rounded-xl p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <BusinessCard businessName="beauty salon" />
            <BusinessCard businessName="beauty salon" />
            <BusinessCard businessName="beauty salon" />
          </div>
        </div>
      </Layout>
    </>
  );
}
