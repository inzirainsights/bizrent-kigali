import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Check, ClipboardCheck, Info, MapPin, MessageSquare, Phone, SearchX, WifiOff } from "lucide-react";
import { useState, type ReactNode } from "react";
import { StateMessage } from "@/components/common/StateMessage";
import { Gallery } from "@/components/detail/Gallery";
import { AvailabilityBadge, LastConfirmed } from "@/components/listings/AvailabilityBadge";
import { SaveButton } from "@/components/listings/SaveButton";
import { LocationMap } from "@/components/map/ListingsMap";
import { EnquiryDialog, ViewingDialog } from "@/components/requests/RequestDialogs";
import { Button } from "@/components/ui/button";
import { listingQuery } from "@/lib/api";
import { formatDate, formatRwf } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { formatRwPhone } from "@/lib/phone";
import { AMENITIES, areaName } from "@/lib/listings/taxonomy";
import type { Listing } from "@/lib/listings/types";

export const Route = createFileRoute("/listings/$id")({
  loader: async ({ context, params }) => {
    const listing = await context.queryClient.ensureQueryData(listingQuery(params.id));
    if (!listing) throw notFound();
    return { title: listing.title, area: areaName(listing.areaId), rent: listing.rentMonthlyRwf, isSample: listing.isSample };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Listing unavailable — BizRent" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.title}, ${loaderData.area} — ${formatRwf(loaderData.rent)}/month | BizRent`;
    const desc = `${loaderData.title} for long-term rent in ${loaderData.area}, Kigali. ${formatRwf(loaderData.rent)} per month.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData.isSample ? [{ name: "robots", content: "noindex" }] : []),
      ],
    };
  },
  component: ListingPage,
  notFoundComponent: ListingNotFound,
  errorComponent: ListingError,
});

function ListingNotFound() {
  const { t } = useI18n();
  return (
    <div className="container-page py-16">
      <StateMessage
        icon={SearchX}
        title={t("detail.notFound")}
        body={t("detail.notFoundBody")}
        action={<Button asChild><Link to="/rent">{t("account.browse")}</Link></Button>}
      />
    </div>
  );
}

function ListingError({ reset }: { reset: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <div className="container-page py-16">
      <StateMessage
        icon={WifiOff}
        tone="error"
        title={t("detail.errorTitle")}
        body={t("results.errorBody")}
        action={
          <Button onClick={() => { router.invalidate(); reset(); }}>{t("common.retry")}</Button>
        }
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t py-6">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function ListingPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(listingQuery(id));
  const listing = data as Listing;
  const { t, lang } = useI18n();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [viewingOpen, setViewingOpen] = useState(false);
  const isHome = listing.category === "residential";
  const amenities = AMENITIES.filter((a) => listing.amenities.includes(a.id));

  const actions = (
    <div className="flex flex-col gap-2">
      <Button size="lg" onClick={() => setEnquiryOpen(true)}>
        <MessageSquare aria-hidden /> {t("detail.contact")}
      </Button>
      <Button size="lg" variant="outline" onClick={() => setViewingOpen(true)}>
        <CalendarDays aria-hidden /> {t("detail.viewing")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">{t("detail.ctaNote")}</p>
    </div>
  );

  return (
    <div className="container-page pb-28 pt-4 lg:pb-10">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/rent"><ArrowLeft aria-hidden /> {t("common.back")}</Link>
        </Button>
        <SaveButton listingId={listing.id} variant="inline" />
      </div>

      {listing.isSample && (
        <p className="mb-4 flex items-start gap-2 rounded-lg border border-dashed bg-surface px-3 py-2.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden /> {t("detail.sampleBanner")}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <Gallery photos={listing.photos} />

          <div className="py-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <AvailabilityBadge availability={listing.availability} />
              <LastConfirmed date={listing.availability.lastConfirmedAt} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{listing.title}</h1>
            <p className="mt-1 inline-flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
              {listing.publicAddress ?? areaName(listing.areaId)} · {t(`type.${listing.propertyType}`)}
            </p>
            <p className="mt-3 text-2xl font-semibold lg:hidden">
              {formatRwf(listing.rentMonthlyRwf, lang)}
              <span className="text-base font-normal text-muted-foreground"> {t("common.perMonth")}</span>
            </p>
          </div>

          <Section title={t("detail.costs")}>
            <dl className="divide-y">
              <Row label={t("common.monthlyRent")} value={formatRwf(listing.rentMonthlyRwf, lang)} />
              {listing.depositRwf != null && (
                <Row
                  label={t("detail.deposit")}
                  value={
                    <>
                      {formatRwf(listing.depositRwf, lang)}
                      {listing.depositNote && <span className="block text-xs font-normal text-muted-foreground">{listing.depositNote}</span>}
                    </>
                  }
                />
              )}
              {listing.serviceChargeMonthlyRwf != null && (
                <Row label={t("detail.serviceCharge")} value={`${formatRwf(listing.serviceChargeMonthlyRwf, lang)} ${t("common.perMonth")}`} />
              )}
              {listing.recurringCosts?.map((c) => (
                <Row key={c.label} label={c.label} value={`${formatRwf(c.amountRwf, lang)} ${t("common.perMonth")}`} />
              ))}
            </dl>
          </Section>

          <Section title={t("detail.details")}>
            <dl className="divide-y">
              <Row label={t("common.propertyType")} value={t(`type.${listing.propertyType}`)} />
              {isHome && listing.bedrooms != null && <Row label={t("detail.bedrooms")} value={listing.bedrooms} />}
              {listing.bathrooms != null && <Row label={t("detail.bathrooms")} value={listing.bathrooms} />}
              {listing.floorAreaSqm != null && <Row label={t("detail.floorArea")} value={t("listing.sqm", { n: listing.floorAreaSqm })} />}
              {isHome && listing.furnished != null && (
                <Row label={t("detail.furnishing")} value={listing.furnished ? t("detail.furnished") : t("detail.unfurnished")} />
              )}
              {listing.parking != null && <Row label={t("detail.parking")} value={listing.parking ? t("detail.yes") : t("detail.no")} />}
              {!isHome && listing.permittedUse?.length ? <Row label={t("detail.permittedUse")} value={listing.permittedUse.join(", ")} /> : null}
              {!isHome && listing.access?.length ? <Row label={t("detail.access")} value={listing.access.join(", ")} /> : null}
            </dl>
          </Section>

          {amenities.length > 0 && (
            <Section title={t("detail.amenities")}>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {amenities.map((a) => (
                  <li key={a.id} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" aria-hidden /> {t(a.labelKey)}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title={t("detail.description")}>
            <p className="whitespace-pre-line leading-relaxed">{listing.description}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t("detail.listed", { date: formatDate(listing.listedAt, lang) })}</p>
          </Section>

          <Section title={t("detail.checks")}>
            {listing.verifications.length > 0 ? (
              <ul className="space-y-3">
                {listing.verifications.map((v) => (
                  <li key={v.label} className="flex gap-3">
                    <ClipboardCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="font-medium">{v.label}</p>
                      <p className="text-sm text-muted-foreground">{t("detail.checkedOn", { date: formatDate(v.checkedAt, lang) })}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{t("detail.noChecks")}</p>
            )}
          </Section>

          <Section title={t("detail.location")}>
            <p className="mb-3">{listing.publicAddress ?? `${areaName(listing.areaId)}, Kigali`}</p>
            <div className="h-64 overflow-hidden rounded-xl border sm:h-80">
              <LocationMap listing={listing} />
            </div>
            {listing.location?.precision === "approximate" && (
              <p className="mt-2 text-sm text-muted-foreground">{t("map.approximate")}</p>
            )}
          </Section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-5 shadow-card">
            <p className="text-2xl font-semibold">
              {formatRwf(listing.rentMonthlyRwf, lang)}
              <span className="text-base font-normal text-muted-foreground"> {t("common.perMonth")}</span>
            </p>
            <AvailabilityBadge availability={listing.availability} className="mt-2" />
            <div className="mt-5">{actions}</div>
            {listing.publicContact?.phone && (
              <div className="mt-5 border-t pt-4 text-sm">
                <p className="text-muted-foreground">{t("detail.publicContact")}</p>
                <a href={`tel:${listing.publicContact.phone}`} className="mt-1 inline-flex items-center gap-2 font-medium text-primary hover:underline">
                  <Phone className="size-4" aria-hidden />
                  {listing.publicContact.name ? `${listing.publicContact.name}: ` : ""}
                  {formatRwPhone(listing.publicContact.phone)}
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl gap-2">
          <Button className="flex-1 px-3 max-[400px]:[&_svg]:hidden" onClick={() => setEnquiryOpen(true)}>
            <MessageSquare aria-hidden /> {t("detail.contact")}
          </Button>
          <Button variant="outline" className="flex-1 px-3 max-[400px]:[&_svg]:hidden" onClick={() => setViewingOpen(true)}>
            <CalendarDays aria-hidden /> {t("detail.viewing")}
          </Button>
        </div>
      </div>

      {listing.publicContact?.phone && (
        <p className="mt-2 text-sm lg:hidden">
          <span className="text-muted-foreground">{t("detail.publicContact")}: </span>
          <a href={`tel:${listing.publicContact.phone}`} className="font-medium text-primary">{formatRwPhone(listing.publicContact.phone)}</a>
        </p>
      )}

      <EnquiryDialog listing={listing} open={enquiryOpen} onOpenChange={setEnquiryOpen} />
      <ViewingDialog listing={listing} open={viewingOpen} onOpenChange={setViewingOpen} />
    </div>
  );
}
