import { ComponentProps, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

import { VariantProps } from "class-variance-authority";

import { cn } from "@helpers/cn";

import { buttonVariants } from "@components/Button";

interface LinkButtonVariants
  extends Omit<LinkProps, "to">,
    VariantProps<typeof buttonVariants> {}

export interface LinkButtonProps extends LinkButtonVariants {
  className?: ComponentProps<"div">["className"];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  href: string;
  label: string;
}

export function LinkButton({
  leftIcon,
  rightIcon,
  className,
  href,
  label,
  ...props
}: LinkButtonProps) {
  const classNames = cn(buttonVariants(props), className);

  return (
    <Link to={href} className={classNames}>
      {leftIcon && leftIcon}
      {label}
      {rightIcon && rightIcon}
    </Link>
  );
}

export function NormalLink({
  label,
  href,
  className,
}: Pick<LinkButtonProps, "label" | "href" | "className">) {
  return (
    <Link
      className={cn(
        "text-primary font-medium rounded-sm underline hover:no-underline focus-ring-visible underline-offset-2 outline-none",
        className
      )}
      to={href}
    >
      {label}
    </Link>
  );
}
