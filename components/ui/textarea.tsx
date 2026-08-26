import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function TextArea({ className, invalid, id, rows = 4, ...props }: TextAreaProps) {
  return (
    <textarea
      id={id}
      rows={rows}
      className={cn("control-field min-h-[6.5rem] resize-y", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
