import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Segmented } from "@/components/common/Segmented";
import { Field, PhoneInput } from "@/components/requests/Field";
import { Button } from "@/components/ui/button";
import { useAuth, type SignInMethod } from "@/lib/auth";
import { useI18n, type MessageKey } from "@/lib/i18n";
import { normalizeRwPhone } from "@/lib/phone";

export const Route = createFileRoute("/sign-in")({
  validateSearch: zodValidator(z.object({ redirect: fallback(z.string().optional(), undefined) })),
  head: () => ({
    meta: [
      { title: "Sign in — BizRent" },
      { name: "description", content: "Sign in to BizRent with your phone number or email to save places and follow your requests." },
      { property: "og:title", content: "Sign in — BizRent" },
      { property: "og:description", content: "Save places you like and follow your rental requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignInPage,
});

/** Only allow same-site relative redirects. */
function safeRedirect(r?: string) {
  return r && r.startsWith("/") && !r.startsWith("//") ? r : "/account";
}

function SignInPage() {
  const { t } = useI18n();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [method, setMethod] = useState<SignInMethod>("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"name" | "id" | "password", MessageKey>>>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    let identifier = "";
    if (method === "phone") {
      const n = normalizeRwPhone(phone);
      if (!n) errs.id = "form.errPhone";
      else identifier = n;
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.id = "signin.errEmail";
      else identifier = email.trim().toLowerCase();
    }
    if (password.length < 8) errs.password = "signin.errPassword";
    if (mode === "create" && name.trim().length < 2) errs.name = "form.errName";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setFailed(false);
    try {
      if (mode === "create") await signUp({ method, identifier, password, name: name.trim() });
      else await signIn({ method, identifier, password });
      navigate({ href: safeRedirect(redirect), replace: true });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-10 sm:py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">{mode === "signin" ? t("signin.title") : t("signin.createTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("signin.subtitle")}</p>

        <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-card p-5" noValidate>
          <div>
            <p className="mb-1.5 text-sm font-medium">{t("signin.method")}</p>
            <Segmented
              label={t("signin.method")}
              value={method}
              onChange={(m) => { setMethod(m); setErrors({}); }}
              options={[
                { value: "phone", label: t("signin.phone") },
                { value: "email", label: t("signin.email") },
              ]}
              className="flex w-full"
            />
          </div>

          {mode === "create" && (
            <Field id="si-name" label={t("signin.fullName")} error={errors.name}>
              <input id="si-name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name || undefined} />
            </Field>
          )}

          {method === "phone" ? (
            <Field id="si-phone" label={t("form.phone")} hint={t("form.phoneHint")} error={errors.id}>
              <PhoneInput id="si-phone" value={phone} onChange={setPhone} invalid={!!errors.id} />
            </Field>
          ) : (
            <Field id="si-email" label={t("signin.emailLabel")} error={errors.id}>
              <input id="si-email" type="email" inputMode="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.id || undefined} />
            </Field>
          )}

          <Field id="si-pass" label={t("signin.password")} error={errors.password}>
            <input
              id="si-pass"
              type="password"
              autoComplete={mode === "create" ? "new-password" : "current-password"}
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password || undefined}
            />
          </Field>

          {failed && <p role="alert" className="text-sm text-destructive">{t("signin.failed")}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? t("signin.working") : mode === "signin" ? t("signin.submit") : t("signin.createSubmit")}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">{mode === "signin" ? t("signin.noAccount") : t("signin.haveAccount")} </span>
          <button type="button" className="font-medium text-primary hover:underline" onClick={() => { setMode(mode === "signin" ? "create" : "signin"); setErrors({}); }}>
            {mode === "signin" ? t("signin.switchCreate") : t("signin.switchSignIn")}
          </button>
        </p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("signin.browseNote")} <Link to="/rent" className="font-medium text-primary hover:underline">{t("account.browse")}</Link>
        </p>
      </div>
    </div>
  );
}
