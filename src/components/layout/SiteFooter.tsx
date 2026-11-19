import { Link } from "@tanstack/react-router";
import { usingSampleData } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">BizRent</p>
          <p>{t("brand.tagline")}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          <Link to="/rent" className="hover:text-foreground">{t("nav.rent")}</Link>
          <Link to="/list-property" className="hover:text-foreground">{t("nav.list")}</Link>
          <Link to="/account" className="hover:text-foreground">{t("nav.account")}</Link>
        </nav>
        <div className="sm:text-right">
          <p>{t("footer.rights", { year: 2026 })}</p>
          {usingSampleData && <p>{t("footer.sampleNote")}</p>}
        </div>
      </div>
    </footer>
  );
}
