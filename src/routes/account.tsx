import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Heart, Inbox, LogOut, MessageSquare, UserRound, WifiOff } from "lucide-react";
import { StateMessage } from "@/components/common/StateMessage";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, listingKeys } from "@/lib/api";
import type { RenterRequest } from "@/lib/api/types";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { useI18n, type MessageKey } from "@/lib/i18n";
import { formatRwPhone } from "@/lib/phone";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — BizRent" },
      { name: "description", content: "Your saved places and the status of your enquiries and viewing requests on BizRent." },
      { property: "og:title", content: "My account — BizRent" },
      { property: "og:description", content: "Saved places and request statuses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { t } = useI18n();
  const { user, ready, signOut } = useAuth();
  const navigate = useNavigate();

  if (!ready) {
    return (
      <div className="container-page py-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-16">
        <StateMessage
          icon={UserRound}
          title={t("account.signInTitle")}
          body={t("signin.subtitle")}
          action={
            <Button asChild>
              <Link to="/sign-in" search={{ redirect: "/account" }}>{t("nav.signIn")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("account.title")}</h1>
          <p className="mt-1 text-muted-foreground">
            {t("account.signedInAs", { name: user.method === "phone" ? formatRwPhone(user.identifier) : user.identifier })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { signOut(); navigate({ to: "/" }); }}>
          <LogOut aria-hidden /> {t("nav.signOut")}
        </Button>
      </div>

      <Tabs defaultValue="saved" className="mt-6">
        <TabsList className="h-11 w-full sm:w-auto">
          <TabsTrigger value="saved" className="h-9 flex-1 px-4 sm:flex-none">
            <Heart className="mr-1.5 size-4" aria-hidden /> {t("account.saved")}
          </TabsTrigger>
          <TabsTrigger value="requests" className="h-9 flex-1 px-4 sm:flex-none">
            <Inbox className="mr-1.5 size-4" aria-hidden /> {t("account.requests")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="mt-6">
          <SavedList />
        </TabsContent>
        <TabsContent value="requests" className="mt-6">
          <RequestList userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SavedList() {
  const { t } = useI18n();
  const { savedIds } = useSaved();
  const q = useQuery({
    queryKey: listingKeys.byIds(savedIds),
    queryFn: () => api.getListingsByIds(savedIds),
    enabled: savedIds.length > 0,
  });

  if (savedIds.length === 0) {
    return (
      <StateMessage
        icon={Heart}
        title={t("account.noSaved")}
        action={<Button asChild><Link to="/rent">{t("account.browse")}</Link></Button>}
      />
    );
  }
  if (q.isError) {
    return (
      <StateMessage icon={WifiOff} tone="error" title={t("results.errorTitle")} body={t("results.errorBody")} action={<Button onClick={() => q.refetch()}>{t("common.retry")}</Button>} />
    );
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {q.data
        ? q.data.map((l) => <li key={l.id}><ListingCard listing={l} /></li>)
        : savedIds.map((id) => <li key={id}><ListingCardSkeleton /></li>)}
    </ul>
  );
}

const STATUS_KEY: Record<RenterRequest["status"], MessageKey> = {
  sent: "status.sent",
  pending: "status.pending",
  confirmed: "status.confirmed",
  declined: "status.declined",
};

function RequestList({ userId }: { userId: string }) {
  const { t, lang } = useI18n();
  const q = useQuery({ queryKey: listingKeys.myRequests(userId), queryFn: () => api.listMyRequests() });

  if (q.isPending) return <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>;
  if (q.isError)
    return <StateMessage icon={WifiOff} tone="error" title={t("results.errorTitle")} body={t("results.errorBody")} action={<Button onClick={() => q.refetch()}>{t("common.retry")}</Button>} />;
  if (q.data.length === 0)
    return <StateMessage icon={Inbox} title={t("account.noRequests")} action={<Button asChild><Link to="/rent">{t("account.browse")}</Link></Button>} />;

  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">{t("account.requestsNote")}</p>
      <ul className="space-y-3">
        {q.data.map((r) => {
          const Icon = r.kind === "viewing" ? CalendarDays : MessageSquare;
          return (
            <li key={r.id} className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
                  <Icon className="size-5 text-muted-foreground" aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{r.kind === "viewing" ? t("account.viewingReq") : t("account.enquiry")}</p>
                  <Link to="/listings/$id" params={{ id: r.listingId }} className="font-medium hover:underline">{r.listingTitle}</Link>
                  <p className="text-sm text-muted-foreground">
                    {t("account.sentOn", { date: formatDate(r.createdAt.slice(0, 10), lang) })}
                    {r.preferredDate && r.preferredTime && (
                      <> · {t("account.preferred", { date: formatDate(r.preferredDate, lang), time: t(`time.${r.preferredTime}`) })}</>
                    )}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "self-start rounded-full px-3 py-1 text-sm font-medium sm:self-center",
                  r.status === "confirmed" ? "bg-accent text-accent-foreground" : r.status === "declined" ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground",
                )}
              >
                {t(STATUS_KEY[r.status])}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
