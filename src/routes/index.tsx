import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Home, Info, KeyRound, MessageSquare, Search, Sofa, Store, Warehouse, Building } from "lucide-react";
import { StateMessage } from "@/components/common/StateMessage";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/ListingCard";
import { SearchPanel } from "@/components/search/SearchPanel";
import { Button } from "@/components/ui/button";
import { featuredListingsQuery, usingSampleData } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { RentSearch } from "@/lib/listings/search-params";
import type { MessageKey } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BizRent — Find a place to rent in Kigali" },
      { name: "description", content: "Search long-term homes, offices, shops and warehouses for rent in Kigali. Monthly prices in RWF." },
      { property: "og:title", content: "BizRent — Find a place to rent in Kigali" },
      { property: "og:description", content: "Search long-term homes and commercial spaces for rent in Kigali." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const SHORTCUTS: { label: MessageKey; icon: typeof Home; search: RentSearch }[] = [
  { label: "typePlural.apartment", icon: Building, search: { type: "apartment" } },
  { label: "typePlural.house", icon: Home, search: { type: "house" } },
  { label: "shortcut.furnished", icon: Sofa, search: { category: "residential", furnished: true } },
  { label: "typePlural.office", icon: Building2, search: { type: "office" } },
  { label: "typePlural.shop", icon: Store, search: { type: "shop" } },
  { label: "typePlural.warehouse", icon: Warehouse, search: { type: "warehouse" } },
];

function HomePage() {
  const { t } = useI18n();
  const featured = useQuery(featuredListingsQuery(3));

  return (
    <>
      <section className="border-b bg-surface">
        <div className="container-page py-10 sm:py-14">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{t("home.title")}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{t("home.subtitle")}</p>
          <div className="mt-6">
            <SearchPanel />
          </div>
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="shortcuts-h">
        <h2 id="shortcuts-h" className="mb-4 text-xl font-semibold">{t("home.shortcuts")}</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SHORTCUTS.map((s) => (
            <li key={s.label}>
              <Link
                to="/rent"
                search={s.search}
                className="flex h-full items-center gap-3 rounded-xl border bg-card px-4 py-3.5 font-medium hover:border-primary hover:bg-accent/40"
              >
                <s.icon className="size-5 shrink-0 text-primary" aria-hidden />
                {t(s.label)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-4" aria-labelledby="featured-h">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="featured-h" className="text-xl font-semibold">{t("home.featured")}</h2>
          <Link to="/rent" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t("home.viewAll")} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {usingSampleData && (
          <p className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            {t("home.sampleNote")}
          </p>
        )}
        {featured.isError ? (
          <StateMessage
            icon={Info}
            tone="error"
            title={t("home.featuredError")}
            action={<Button variant="outline" onClick={() => featured.refetch()}>{t("common.retry")}</Button>}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data
              ? featured.data.map((l, i) => <ListingCard key={l.id} listing={l} eager={i === 0} />)
              : Array.from({ length: 3 }, (_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        )}
      </section>

      <section className="container-page py-12" aria-labelledby="how-h">
        <h2 id="how-h" className="mb-6 text-xl font-semibold">{t("home.how")}</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {(
            [
              [Search, "home.how1.title", "home.how1.body"],
              [MessageSquare, "home.how2.title", "home.how2.body"],
              [KeyRound, "home.how3.title", "home.how3.body"],
            ] as const
          ).map(([Icon, title, body], i) => (
            <li key={title} className="rounded-xl border bg-card p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">{i + 1}</span>
                <Icon className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="font-semibold">{t(title)}</h3>
              <p className="mt-1 text-muted-foreground">{t(body)}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
