import type { FC, ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        "transform rounded-xl bg-[#48A6A7] px-6 py-2 text-center font-semibold text-[#006A71] shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
