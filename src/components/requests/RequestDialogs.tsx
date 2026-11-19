import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { TimeSlot } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";
import { todayIso, validateEnquiry, validateViewing, type FieldErrors } from "@/lib/requests";
import type { Listing } from "@/lib/listings/types";
import { Field, PhoneInput } from "./Field";

function ResultPanel({
  tone,
  title,
  body,
  extra,
  children,
}: {
  tone: "success" | "pending" | "error";
  title: string;
  body: string;
  extra?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const Icon = tone === "error" ? AlertCircle : tone === "pending" ? Clock : CheckCircle2;
  return (
    <div role={tone === "error" ? "alert" : "status"} className="flex flex-col items-center py-4 text-center">
      <span
        className={
          tone === "error"
            ? "mb-3 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"
            : "mb-3 grid size-12 place-items-center rounded-full bg-accent text-accent-foreground"
        }
      >
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-muted-foreground">{body}</p>
      {extra && <div className="mt-4 w-full">{extra}</div>}
      {children && <div className="mt-5 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">{children}</div>}
    </div>
  );
}

export function EnquiryDialog({ listing, open, onOpenChange }: { listing: Listing; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(() => t("enquiry.defaultMessage"));
  const [errors, setErrors] = useState<FieldErrors<"name" | "phone" | "message">>({});
  const m = useMutation({
    mutationFn: api.sendEnquiry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const v = validateEnquiry({ name, phone, message });
    setErrors(v.errors);
    if (Object.keys(v.errors).length || !v.phone) return;
    m.mutate({ listingId: listing.id, name: name.trim(), phone: v.phone, message: message.trim() });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o && m.isSuccess) m.reset();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("enquiry.title")}</DialogTitle>
          <DialogDescription>{listing.title}</DialogDescription>
        </DialogHeader>

        {m.isSuccess ? (
          <ResultPanel tone="success" title={t("enquiry.successTitle")} body={t("enquiry.successBody")}>
            <Button onClick={() => onOpenChange(false)}>{t("common.close")}</Button>
          </ResultPanel>
        ) : m.isError ? (
          <ResultPanel tone="error" title={t("enquiry.errorTitle")} body={t("enquiry.errorBody")}>
            <Button variant="outline" onClick={() => m.reset()}>{t("common.cancel")}</Button>
            <Button onClick={() => submit()}>{t("common.retry")}</Button>
          </ResultPanel>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <p className="text-sm text-muted-foreground">{t("enquiry.desc")}</p>
            <Field id="enq-name" label={t("form.name")} error={errors.name}>
              <input id="enq-name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name || undefined} />
            </Field>
            <Field id="enq-phone" label={t("form.phone")} hint={t("form.phoneHint")} error={errors.phone}>
              <PhoneInput id="enq-phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
            </Field>
            <Field id="enq-msg" label={t("form.message")} error={errors.message}>
              <textarea id="enq-msg" rows={4} className="field h-auto py-2.5" value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!errors.message || undefined} />
            </Field>
            <Button type="submit" size="lg" className="w-full" disabled={m.isPending}>
              {m.isPending ? t("form.sending") : t("form.send")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ViewingDialog({ listing, open, onOpenChange }: { listing: Listing; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<TimeSlot | "">("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FieldErrors<"name" | "phone" | "date" | "time">>({});
  const m = useMutation({
    mutationFn: api.requestViewing,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const v = validateViewing({ name, phone, date, time });
    setErrors(v.errors);
    if (Object.keys(v.errors).length || !v.phone || !time) return;
    m.mutate({ listingId: listing.id, name: name.trim(), phone: v.phone, preferredDate: date, preferredTime: time, note: note.trim() || undefined });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o && m.isSuccess) m.reset();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("viewing.title")}</DialogTitle>
          <DialogDescription>{listing.title}</DialogDescription>
        </DialogHeader>

        {m.isSuccess ? (
          <ResultPanel
            tone="pending"
            title={t("viewing.successTitle")}
            body={t("viewing.successBody")}
            extra={
              <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                <span className="text-muted-foreground">{t("status.label")}: </span>
                <span className="font-medium">{t("status.pending")}</span>
              </div>
            }
          >
            <Button onClick={() => onOpenChange(false)}>{t("common.close")}</Button>
          </ResultPanel>
        ) : m.isError ? (
          <ResultPanel tone="error" title={t("viewing.errorTitle")} body={t("enquiry.errorBody")}>
            <Button variant="outline" onClick={() => m.reset()}>{t("common.cancel")}</Button>
            <Button onClick={() => submit()}>{t("common.retry")}</Button>
          </ResultPanel>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <p className="text-sm text-muted-foreground">{t("viewing.desc")}</p>
            <div className="flex gap-2 rounded-lg border bg-muted px-3 py-2.5 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <p>{t("viewing.pendingNote")}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="vw-date" label={t("form.date")} error={errors.date}>
                <input id="vw-date" type="date" min={todayIso()} className="field" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={!!errors.date || undefined} />
              </Field>
              <Field id="vw-time" label={t("form.time")} error={errors.time}>
                <select id="vw-time" className="field" value={time} onChange={(e) => setTime(e.target.value as TimeSlot | "")} aria-invalid={!!errors.time || undefined}>
                  <option value="">{t("form.chooseTime")}</option>
                  <option value="morning">{t("time.morning")}</option>
                  <option value="afternoon">{t("time.afternoon")}</option>
                  <option value="late">{t("time.late")}</option>
                </select>
              </Field>
            </div>
            <Field id="vw-name" label={t("form.name")} error={errors.name}>
              <input id="vw-name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name || undefined} />
            </Field>
            <Field id="vw-phone" label={t("form.phone")} hint={t("form.phoneHint")} error={errors.phone}>
              <PhoneInput id="vw-phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
            </Field>
            <Field id="vw-note" label={`${t("form.note")} (${t("common.optional")})`}>
              <textarea id="vw-note" rows={2} className="field h-auto py-2.5" value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <Button type="submit" size="lg" className="w-full" disabled={m.isPending}>
              {m.isPending ? t("form.sending") : t("form.sendViewing")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
