import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-paper shadow-[0_1px_2px_rgba(28,36,32,0.04)] transition-shadow",
        className
      )}
      {...props}
    />
  );
}
