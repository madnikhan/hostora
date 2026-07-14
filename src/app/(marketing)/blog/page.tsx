import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { listBlogPosts } from "@/lib/blog/store";

export const metadata: Metadata = {
  title: "Blog — hospitality ops insights",
  description:
    "Hostora articles on restaurant POS, kitchen display, hotel F&B ops, takeaways, and floor systems — practical guidance for operators across the US, UK and Europe.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await listBlogPosts();

  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <p className="eyebrow">Blog</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Floor ops, explained.
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Practical pieces for restaurants, takeaways, events, hotel F&amp;B,
            and food carts — written for operators, not for software fashion.
          </p>
        </FadeUp>

        <ul className="mt-16 space-y-12">
          {posts.map((post, i) => (
            <FadeUp key={post.slug} delay={(i % 4) * 0.04}>
              <li>
                <article>
                  <p className="text-xs text-muted">
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="display mt-3 text-2xl font-bold md:text-3xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-muted leading-relaxed">
                    {post.description}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-accent"
                  >
                    Read article →
                  </Link>
                </article>
              </li>
            </FadeUp>
          ))}
        </ul>

        {posts.length === 0 ? (
          <p className="mt-16 text-muted">
            Articles are on the way. Meanwhile,{" "}
            <Link href="/contact" className="text-accent">
              book a demo
            </Link>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
