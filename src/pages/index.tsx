import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Viby</title>
        <meta name="description" content="where you like to manage your appintments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] text-white to-[#15162c]">
       <p>
        welcome to Viby
       </p>
      </main>
    </>
  );
}
