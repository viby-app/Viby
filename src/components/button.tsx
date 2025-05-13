import type { FC, ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        "flex w-full transform justify-center rounded-xl bg-[#006A71] px-4 py-3 text-center text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
