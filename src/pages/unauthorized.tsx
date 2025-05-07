import Link from "next/link";
import Button from "~/components/button";

export default function Unauthorized() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F2EFE7] px-4 text-right">
      <div className="max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-center text-xl font-bold text-[#006A71]">
          הגישה נדחתה: החשבון שלך לא אושר
        </h1>
        <p className="text-center text-[#222]">
          אנא נסה להתחבר מחדש או צור קשר עם התמיכה.
        </p>
        <div className="flex justify-center">
          <Link href="/login">
            <Button>לעמוד ההתחברות</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
