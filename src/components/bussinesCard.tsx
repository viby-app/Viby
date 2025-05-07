import Button from "./button";

interface Props {
  businessName: string;
  description: string | null;
}

const BusinessCard = ({ businessName, description }: Props) => {
  return (
    <div className="flex h-full w-full min-w-2xs flex-col items-center justify-center rounded-lg bg-[#9ACBD0] p-4 shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">{businessName}</h2>
      <p className="mt-2 text-gray-600">{description} </p>
      <div className="mt-4">
        <Button>צור קשר</Button>
      </div>
    </div>
  );
};

export default BusinessCard;
