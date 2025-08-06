import Navbar from "./navbar";
import Head from "next/head";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Viby</title>
        <meta
          name="description"
          content="Where you love to manage your appointments"
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="min-h-screen bg-[#F2EFE7] pb-9 lg:pt-9 dark:bg-[#F2EFE7] dark:text-black">
        {children}
      </main>
      <Navbar />
    </>
  );
};

export default Layout;
