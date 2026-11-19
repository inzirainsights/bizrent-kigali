import type { MessageKey } from "@/lib/i18n";
import { normalizeRwPhone } from "@/lib/phone";
import type { TimeSlot } from "@/lib/api/types";

export type FieldErrors<K extends string> = Partial<Record<K, MessageKey>>;

export function todayIso(now: Date = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function validateEnquiry(v: { name: string; phone: string; message: string }) {
  const errors: FieldErrors<"name" | "phone" | "message"> = {};
  if (v.name.trim().length < 2) errors.name = "form.errName";
  const phone = normalizeRwPhone(v.phone);
  if (!phone) errors.phone = "form.errPhone";
  if (v.message.trim().length < 10) errors.message = "form.errMessage";
  return { errors, phone };
}

export function validateViewing(
  v: { name: string; phone: string; date: string; time: TimeSlot | "" },
  now: Date = new Date(),
) {
  const errors: FieldErrors<"name" | "phone" | "date" | "time"> = {};
  if (v.name.trim().length < 2) errors.name = "form.errName";
  const phone = normalizeRwPhone(v.phone);
  if (!phone) errors.phone = "form.errPhone";
  if (!v.date || v.date < todayIso(now)) errors.date = "form.errDate";
  if (!v.time) errors.time = "form.errTime";
  return { errors, phone };
}
