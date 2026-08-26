import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function TextField({ className, invalid, id, ...props }: TextFieldProps) {
  return (
    <input
      id={id}
      className={cn("control-field", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
