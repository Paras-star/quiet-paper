import type { MetadataRoute } from "next";
import { PRIVACY_PATH, SITE_ORIGIN, SITE_URL, TERMS_PATH } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_ORIGIN}${PRIVACY_PATH}`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_ORIGIN}${TERMS_PATH}`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
