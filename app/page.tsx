import PromotionPageClient from "@/components/promotion-page-client";
import { getAllPromotions } from "@/lib/server-api";
import { isProduction } from "@/lib/env";

export const revalidate = 60; // ISR 60초

export default async function Page() {
  const { promotions, errors } = await getAllPromotions();
  const env = isProduction() ? "production" : "development";

  return (
    <PromotionPageClient
      initialPromotions={promotions}
      errors={errors}
      env={env}
    />
  );
}

