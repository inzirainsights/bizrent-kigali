import type { ReactNode } from "react";
import { useI18n, type MessageKey } from "@/lib/i18n";

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string | undefined;
  error?: MessageKey | undefined;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">{t(error)}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function PhoneInput({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  return (
    <div className="flex">
      <span className="inline-flex h-11 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-[0.9375rem] font-medium text-muted-foreground">
        +250
      </span>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="788 123 456"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : `${id}-hint`}
        className="field rounded-l-none"
      />
    </div>
  );
}
