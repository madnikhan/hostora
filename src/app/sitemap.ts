import type { MetadataRoute } from "next";
import { listBlogPosts } from "@/lib/blog/store";
import { siteUrl } from "@/lib/company";
import { listSoroArticles } from "@/lib/seo/soroArticles";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [posts, soroArticles] = await Promise.all([
    listBlogPosts(),
    listSoroArticles(),
  ]);

  const nativeSlugs = new Set(posts.map((p) => p.slug.toLowerCase()));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/product`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/hardware`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/solutions`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/company`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const soroRoutes: MetadataRoute.Sitemap = soroArticles
    .filter((a) => a.slug && !nativeSlugs.has(a.slug.toLowerCase()))
    .map((article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: article.isoDate
        ? new Date(article.isoDate)
        : lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));

  return [...staticRoutes, ...blogRoutes, ...soroRoutes];
}
