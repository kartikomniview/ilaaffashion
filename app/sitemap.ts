import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllProducts, getCategories, productsHref } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/products", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const categories = getCategories().map((c) => ({
    url: `${site.url}${productsHref({ category: [c.slug] })}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const products = getAllProducts().map((p) => ({
    url: `${site.url}/products/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...categories, ...products];
}
