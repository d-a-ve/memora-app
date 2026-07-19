import {
  ButtonHTMLAttributes,
  ComponentProps,
  DetailedHTMLProps,
  ReactNode,
} from "react";

import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@helpers/cn";

import { InlineLoader } from "@components/Loader";

export const buttonVariants = cva(
  "relative border disabled:bg-opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in flex items-center gap-2 justify-center rounded font-medium outline-none",
  {
    variants: {
      intent: {
        primary:
          "border-transparent bg-primary text-white hover:bg-transparent hover:border-primary hover:text-primary hover:fill-background focus-ring-visible",
        secondary:
          "border-transparent bg-secondary/20 text-foreground fill-white hover:bg-secondary/60 focus-ring-visible",
        danger:
          "bg-red-500 text-white hover:bg-red-600 fill-red-500 hover:fill-red-600 focus-ring-visible",
      },
      size: {
        sm: "text-sm px-4 py-2",
        md: "text-base px-5 py-2.5",
        lg: "text-lg px-6 py-3",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

interface ButtonVariants
  extends DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    VariantProps<typeof buttonVariants> {}

export interface ButtonProps extends ButtonVariants {
  className?: ComponentProps<"div">["className"];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  label: string;
}

function Button({
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  className,
  label,
  type = "button",
  ...props
}: ButtonProps) {
  const classNames = cn(buttonVariants(props), className);

  return (
    <button
      type={type}
      disabled={(isLoading ?? disabled) || disabled}
      className={classNames}
      {...props}
    >
      <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center">
        {isLoading && <InlineLoader />}
      </div>
      <p
        className={cn(
          "flex items-center justify-center gap-2",
          isLoading ? "opacity-0" : "opacity-1"
        )}
      >
        {leftIcon}
        {label}
        {rightIcon && (
          <span
            style={{
              opacity: isLoading ? 0 : 1,
            }}
          >
            {rightIcon}
          </span>
        )}
      </p>
    </button>
  );
}

export default Button;
