import dayjs from "../utils/dayjs";
import { UserRoundIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Props {
  description: string;
  date: string;
  businessName: string;
  logo?: string;
  serviceName?: string;
}

const AppointmentCard = ({
  description,
  date,
  businessName,
  logo,
  serviceName,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-lg border border-gray-300 bg-white shadow-md">
        <div className="loading h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-32 w-full min-w-2xs flex-row items-center justify-start gap-4 rounded-lg border border-gray-300 bg-[#ffffffb0] p-4 shadow-md">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-sm">
        {logo ? (
          <Image
            src={`/api/image/${logo}`}
            alt={`Business image ${logo}`}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <UserRoundIcon size={28} />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800">{businessName}</h2>
        <p className="mt-2 text-gray-600">{serviceName}</p>
        <p className="mt-2 text-gray-600">{description}</p>
        <p className="mt-2 text-gray-600">
          {dayjs(date)
            .locale("he")
            .tz("Asia/Jerusalem")
            .format("DD/MM/YYYY - HH:mm")}
        </p>
      </div>
    </div>
  );
};

export default AppointmentCard;
