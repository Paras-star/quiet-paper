import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type StepperButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  symbol: string;
};

export function StepperButton({
  label,
  symbol,
  className,
  type = "button",
  ...props
}: StepperButtonProps) {
  return (
    <button type={type} className={cn("stepper-button", className)} aria-label={label} {...props}>
      <span aria-hidden="true">{symbol}</span>
    </button>
  );
}
