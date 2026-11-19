import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Lang, type MessageKey } from "./en";
import { fr } from "./fr";
import { rw } from "./rw";

export type { Lang, MessageKey } from "./en";

export const LANGUAGES: { id: Lang; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "rw", label: "Kinyarwanda", short: "RW" },
  { id: "fr", label: "Français", short: "FR" },
];

const dictionaries: Record<Lang, Partial<Record<MessageKey, string>>> = { en, fr, rw };
const STORAGE_KEY = "bizrent.lang";

export type TFunction = (key: MessageKey, vars?: Record<string, string | number>) => string;

export function translate(lang: Lang, key: MessageKey, vars?: Record<string, string | number>) {
  let s = dictionaries[lang][key] ?? en[key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunction;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && saved in dictionaries) setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback<TFunction>((key, vars) => translate(lang, key, vars), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
