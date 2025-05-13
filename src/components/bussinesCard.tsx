"use client";

import Link from "next/link";
import { businessRoute } from "~/helpers/routes";

interface Props {
  id: number;
  name: string;
  description: string | null;
}

const BusinessCard = ({ name, description, id }: Props) => {
  return (
    <Link href={businessRoute(id)}>
      <div className="flex h-full min-h-32 w-full min-w-2xs flex-col items-center justify-center rounded-lg bg-[#9ACBD0] p-4 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="mt-2 text-gray-600">{description} </p>
      </div>
    </Link>
  );
};

export default BusinessCard;
