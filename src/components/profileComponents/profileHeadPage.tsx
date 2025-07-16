import Link from "next/link";
import { BellIcon, MenuIcon } from "lucide-react";
import { hebrewDictionary } from "~/utils/constants";

interface ProfileHeadPageProps {
  firstName?: string;
}

const ProfileHeadPage = ({ firstName }: ProfileHeadPageProps) => {
return (
  <div className="flex items-center justify-between px-1 py-2">
    <h1 className="text-4xl font-extrabold text-gray-800">
      {hebrewDictionary.hey} {firstName}!
    </h1>
    <div className="flex flex-row-reverse items-center">
      <Link
        href="/profile"
        className="rounded-full p-2 transition duration-200 hover:bg-gray-300"
      >
        <MenuIcon className="h-6 w-6 text-gray-800" />
      </Link>
      <Link
        href="/profile/settings"
        className="rounded-full p-2 transition duration-200 hover:bg-gray-300"
      >
        <BellIcon className="h-6 w-6 text-gray-800" />
      </Link>
    </div>
  </div>
);

};

export default ProfileHeadPage;
