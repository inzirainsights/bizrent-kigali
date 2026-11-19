import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { StateMessage } from "@/components/common/StateMessage";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/list-property")({
  head: () => ({
    meta: [
      { title: "List a property — BizRent" },
      { name: "description", content: "Landlord and agent tools for listing long-term rentals in Kigali are coming soon to BizRent." },
      { property: "og:title", content: "List a property — BizRent" },
      { property: "og:description", content: "Landlord tools are coming soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ListPropertyPage,
});

function ListPropertyPage() {
  const { t } = useI18n();
  return (
    <div className="container-page py-16">
      <StateMessage
        icon={Building2}
        title={t("list.title")}
        body={t("list.body")}
        action={<Button asChild><Link to="/rent">{t("list.cta")}</Link></Button>}
      />
    </div>
  );
}
