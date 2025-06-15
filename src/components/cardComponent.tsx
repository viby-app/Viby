import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Card = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center bg-[#428e9d82]">
      <div className="m-5 flex min-h-screen w-full flex-col rounded-2xl border border-gray-300 bg-white p-3 shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export default Card;
