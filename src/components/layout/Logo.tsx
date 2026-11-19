import { Link } from "@tanstack/react-router";
import { House } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight text-foreground" aria-label="BizRent home">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <House className="size-4.5" aria-hidden />
      </span>
      BizRent
    </Link>
  );
}
