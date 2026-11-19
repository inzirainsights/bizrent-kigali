import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { List, Map as MapIcon, SearchX, WifiOff } from "lucide-react";
import { useMemo, useState } from "react";
import { StateMessage } from "@/components/common/StateMessage";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/ListingCard";
import { ListingsMap } from "@/components/map/ListingsMap";
import { ActiveFilters, countActiveFilters } from "@/components/search/ActiveFilters";
import { FilterSheet } from "@/components/search/FilterSheet";
import { Button } from "@/components/ui/button";
import { searchListingsQuery } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { resultsHeading } from "@/lib/listings/heading";
import { cleanQuery } from "@/lib/listings/query";
import { queryToSearch, rentSearchSchema, searchToQuery } from "@/lib/listings/search-params";
import type { ListingQuery, SortOption } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rent")({
  validateSearch: zodValidator(rentSearchSchema),
  head: () => ({
    meta: [
      { title: "Places for rent in Kigali — BizRent" },
      { name: "description", content: "Browse long-term homes and commercial spaces for rent in Kigali. Filter by area, type and monthly rent in RWF." },
      { property: "og:title", content: "Places for rent in Kigali — BizRent" },
      { property: "og:description", content: "Homes, offices, shops and warehouses for long-term rent in Kigali." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RentPage,
});

function RentPage() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/rent" });
  const query = useMemo(() => cleanQuery(searchToQuery(search)), [search]);
  const view = search.view === "map" ? "map" : "list";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const results = useQuery({ ...searchListingsQuery(query), placeholderData: keepPreviousData });
  const items = results.data?.items ?? [];

  const update = (q: ListingQuery) => {
    setSelectedId(null);
    navigate({ search: { ...queryToSearch(cleanQuery(q)), view: search.view } });
  };
  const setView = (v: "list" | "map") => navigate({ search: (prev) => ({ ...prev, view: v === "map" ? "map" : undefined }), replace: true });

  const heading = resultsHeading(query, t);
  const total = results.data?.total;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,44%)]">
      <div className={cn("min-w-0", view === "map" && "hidden lg:block")}>
        <div className="px-4 pb-6 pt-6 sm:px-6 lg:pl-8">
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-1 text-muted-foreground" aria-live="polite">
            {total == null ? t("common.loading") : total === 1 ? t("results.countOne") : t("results.count", { count: total })}
            {results.isFetching && results.isPlaceholderData && <span className="ml-2 text-sm">· {t("results.updating")}</span>}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <FilterSheet query={query} onApply={update} />
            <label className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("results.sortBy")}</span>
              <select
                className="field h-10 w-auto py-0 text-sm"
                value={query.sort ?? "newest"}
                onChange={(e) => update({ ...query, sort: e.target.value as SortOption })}
              >
                <option value="newest">{t("sort.newest")}</option>
                <option value="rent_asc">{t("sort.rent_asc")}</option>
                <option value="rent_desc">{t("sort.rent_desc")}</option>
              </select>
            </label>
          </div>
          {countActiveFilters(query) > 0 && (
            <div className="mt-3">
              <ActiveFilters query={query} onChange={update} />
            </div>
          )}

          <div className={cn("mt-6 transition-opacity", results.isFetching && results.isPlaceholderData && "opacity-60")}>
            {results.isError && !results.data ? (
              <StateMessage
                icon={WifiOff}
                tone="error"
                title={t("results.errorTitle")}
                body={t("results.errorBody")}
                action={<Button onClick={() => results.refetch()}>{t("common.retry")}</Button>}
              />
            ) : results.isPending ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => <ListingCardSkeleton key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <StateMessage
                icon={SearchX}
                title={t("results.emptyTitle")}
                body={t("results.emptyBody")}
                action={
                  countActiveFilters(query) > 0 ? (
                    <Button variant="outline" onClick={() => update({ sort: query.sort })}>{t("results.clearAll")}</Button>
                  ) : undefined
                }
              />
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {items.map((l, i) => (
                  <li key={l.id}>
                    <ListingCard listing={l} active={l.id === selectedId} onHover={setHoverId} eager={i < 2} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-l bg-muted lg:sticky lg:top-16 lg:block lg:h-[calc(100dvh-4rem)]",
          view === "map" ? "block h-[calc(100dvh-4rem)]" : "hidden",
        )}
      >
        <ListingsMap listings={items} selectedId={selectedId} onSelect={setSelectedId} highlightId={hoverId} />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[600] flex justify-center lg:hidden">
        <Button
          onClick={() => setView(view === "map" ? "list" : "map")}
          className="pointer-events-auto rounded-full px-5 shadow-card"
          aria-label={view === "map" ? t("results.showList") : t("results.showMap")}
        >
          {view === "map" ? <List aria-hidden /> : <MapIcon aria-hidden />}
          {view === "map" ? t("results.list") : t("results.map")}
        </Button>
      </div>
    </div>
  );
}
