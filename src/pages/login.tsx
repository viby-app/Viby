"use client";
import Head from "next/head";
import Button from "~/components/button";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  return (
    <>
      <Head>
        <title>{"התחברות | Viby"}</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-[#F2EFE7] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-5 text-center text-3xl font-bold text-[#006A71]">
            ברוכים הבאים ל Viby
          </h1>
          <Button onClick={async () => await signIn("google")}>
            התחברות עם Google
          </Button>
        </div>
      </div>
    </>
  );
}
