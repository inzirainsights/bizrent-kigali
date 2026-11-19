/**
 * Saved listings. Saving requires sign-in: when signed out we remember the listing,
 * ask the renter to sign in, and save it right after. Storage is local for the
 * prototype — swap `read`/`write` for the API's saved-listings endpoints.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PENDING_KEY = "bizrent.pendingSave";
const keyFor = (userId: string) => `bizrent.saved.${userId}`;

function read(userId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(keyFor(userId)) ?? "[]");
  } catch {
    return [];
  }
}
function write(userId: string, ids: string[]) {
  localStorage.setItem(keyFor(userId), JSON.stringify(ids));
}

interface SavedValue {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
}

const SavedContext = createContext<SavedValue | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setSavedIds([]);
      return;
    }
    let ids = read(user.id);
    const pending = sessionStorage.getItem(PENDING_KEY);
    if (pending) {
      sessionStorage.removeItem(PENDING_KEY);
      if (!ids.includes(pending)) {
        ids = [pending, ...ids];
        write(user.id, ids);
        toast.success(t("prompt.savedToast"));
      }
    }
    setSavedIds(ids);
  }, [user, t]);

  const toggle = useCallback(
    (id: string) => {
      if (!user) {
        sessionStorage.setItem(PENDING_KEY, id);
        setPromptOpen(true);
        return;
      }
      setSavedIds((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
        write(user.id, next);
        toast.success(next.includes(id) ? t("prompt.savedToast") : t("prompt.removedToast"));
        return next;
      });
    },
    [user, t],
  );

  const value = useMemo(
    () => ({ savedIds, isSaved: (id: string) => savedIds.includes(id), toggle }),
    [savedIds, toggle],
  );

  return (
    <SavedContext.Provider value={value}>
      {children}
      <Dialog
        open={promptOpen}
        onOpenChange={(o) => {
          setPromptOpen(o);
          if (!o && !user) sessionStorage.removeItem(PENDING_KEY);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("prompt.saveTitle")}</DialogTitle>
            <DialogDescription>{t("prompt.saveBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => { sessionStorage.removeItem(PENDING_KEY); setPromptOpen(false); }}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => {
                setPromptOpen(false);
                navigate({ to: "/sign-in", search: { redirect: location.href } });
              }}
            >
              {t("prompt.continue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
  return ctx;
}
