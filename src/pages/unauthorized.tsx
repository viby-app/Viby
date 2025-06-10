import Link from "next/link";
import Button from "~/components/button";

export default function Unauthorized() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F2EFE7] px-4 text-right">
      <div className="min-w-xs space-y-8 rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-center text-xl font-bold text-[#006A71]">
          הגישה נדחתה{" "}
        </h1>
        <p className="text-center text-[#222]">צור קשר עם התמיכה.</p>
        <div className="flex justify-center">
          <Link href="/">
            <Button>לעמוד הבית</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
