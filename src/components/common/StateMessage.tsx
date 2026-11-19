import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StateMessage({
  icon: Icon,
  title,
  body,
  action,
  tone = "neutral",
  className,
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
  className?: string;
}) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex flex-col items-center rounded-xl border bg-card px-6 py-10 text-center", className)}>
      <span className={cn("mb-3 grid size-11 place-items-center rounded-full", tone === "error" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground")}>
        <Icon className="size-5" aria-hidden />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {body && <p className="mt-1 max-w-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
