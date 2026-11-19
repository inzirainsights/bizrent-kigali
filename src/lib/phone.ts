/**
 * Rwanda (+250) phone helpers. Accepts what people usually type:
 * "0788123456", "788 123 456", "+250 788 123 456", "250788123456".
 * National significant numbers are 9 digits; mobiles start with 7, landlines with 2.
 */
export function normalizeRwPhone(input: string): string | null {
  let digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("250")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^[27]\d{8}$/.test(digits)) return null;
  return `+250${digits}`;
}

export function formatRwPhone(e164: string): string {
  const n = normalizeRwPhone(e164);
  if (!n) return e164;
  const d = n.slice(4);
  return `+250 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}
