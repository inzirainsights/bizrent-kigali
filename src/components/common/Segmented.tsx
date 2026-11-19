import { cn } from "@/lib/utils";

/** Familiar two/three-option toggle built on radio semantics. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  size = "default",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  className?: string;
  size?: "default" | "sm";
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-lg border bg-muted p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-md px-3 font-medium transition-colors",
              size === "sm" ? "h-8 text-sm" : "h-10 text-[0.9375rem]",
              active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
