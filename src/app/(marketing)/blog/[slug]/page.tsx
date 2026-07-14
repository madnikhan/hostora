import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogBody } from "@/components/BlogBody";
import { FadeUp } from "@/components/FadeUp";
import { JsonLd } from "@/components/JsonLd";
import { getBlogPost, listBlogPosts } from "@/lib/blog/store";
import { company, siteUrl } from "@/lib/company";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function articleShareImages(slug: string, coverImage?: string | null) {
  if (coverImage) {
    return [
      {
        url: coverImage,
        alt: "Article cover",
      },
    ];
  }
  return [
    {
      url: `${siteUrl}/blog/${slug}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: "Hostora article",
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found" };
  const images = articleShareImages(post.slug, post.coverImage);
  const twitterImage = post.coverImage
    ? post.coverImage
    : `${siteUrl}/blog/${post.slug}/twitter-image`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${siteUrl}/blog/${post.slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [twitterImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const shareImage =
    post.coverImage || `${siteUrl}/blog/${post.slug}/opengraph-image`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: company.productBrand,
    },
    publisher: {
      "@type": "Organization",
      name: company.legalName,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    image: shareImage,
  };

  return (
    <div className="px-6 pb-28 pt-20">
      <JsonLd data={articleLd} />
      <article className="mx-auto max-w-3xl">
        <FadeUp>
          <p className="eyebrow">
            <Link href="/blog" className="hover:text-accent">
              Blog
            </Link>
          </p>
          <h1 className="display mt-4 text-4xl font-extrabold md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-muted">
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            {post.description}
          </p>
        </FadeUp>

        {post.coverImage ? (
          <FadeUp delay={0.04}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              className="mt-10 w-full object-cover"
              style={{ aspectRatio: "1200 / 630" }}
            />
          </FadeUp>
        ) : null}

        <FadeUp delay={0.06}>
          <BlogBody post={post} />
        </FadeUp>

        <FadeUp>
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="display text-2xl font-bold">
              Ready to run the floor?
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Book a Hostora demo — Restaurant, Takeaway, or Events pack, or a
              configured hotel F&amp;B / cart install, with optional Docker local
              server and floor hardware.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              Book a demo
            </Link>
          </div>
        </FadeUp>
      </article>
    </div>
  );
}
