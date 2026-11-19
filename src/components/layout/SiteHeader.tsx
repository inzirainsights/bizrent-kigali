import { Link } from "@tanstack/react-router";
import { Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

const linkClass =
  "rounded-md px-3 py-2 text-[0.9375rem] font-medium text-muted-foreground hover:text-foreground data-[status=active]:text-foreground";

export function SiteHeader() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label={t("nav.main")} className="hidden items-center gap-1 md:flex">
          <Link to="/rent" className={linkClass}>
            {t("nav.rent")}
          </Link>
          <Link to="/list-property" className={linkClass}>
            {t("nav.list")}
          </Link>
          <LanguageSwitcher className="ml-1" />
          {user ? (
            <Button asChild variant="outline" size="sm" className="ml-2">
              <Link to="/account">
                <UserRound aria-hidden /> {t("nav.account")}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="ml-2">
              <Link to="/sign-in" search={{ redirect: undefined }}>
                {t("nav.signIn")}
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          {user ? (
            <Button asChild variant="ghost" size="icon" aria-label={t("nav.account")}>
              <Link to="/account">
                <UserRound aria-hidden />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/sign-in" search={{ redirect: undefined }}>
                {t("nav.signIn")}
              </Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("nav.menu")}>
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">{t("nav.menu")}</SheetTitle>
              </SheetHeader>
              <nav aria-label={t("nav.main")} className="mt-2 flex flex-col gap-1 px-4" onClick={() => setOpen(false)}>
                <Link to="/rent" className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted">
                  {t("nav.rent")}
                </Link>
                <Link to="/list-property" className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted">
                  {t("nav.list")}
                </Link>
                {user ? (
                  <Link to="/account" className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted">
                    {t("nav.account")}
                  </Link>
                ) : (
                  <Link to="/sign-in" search={{ redirect: undefined }} className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted">
                    {t("nav.signIn")}
                  </Link>
                )}
              </nav>
              <div className="mt-4 border-t px-4 pt-4">
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
