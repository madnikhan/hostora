import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { SoroBlogEmbed } from "@/components/SoroBlogEmbed";
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
  const hostoraNotes = posts.filter(
    (p) => p.source === "hostora" || p.source === "seed" || !p.source,
  );

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

        <SoroBlogEmbed />

        {hostoraNotes.length > 0 ? (
          <section className="mt-20 border-t border-border pt-12">
            <FadeUp>
              <h2 className="display text-2xl font-bold md:text-3xl">
                Hostora notes
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                Articles published on Hostora — stable URLs on this site.
              </p>
            </FadeUp>
            <ul className="mt-10 space-y-10">
              {hostoraNotes.map((post, i) => (
                <FadeUp key={post.slug} delay={(i % 4) * 0.04}>
                  <li>
                    <article>
                      <p className="text-xs text-muted">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                      <h3 className="display mt-3 text-xl font-bold md:text-2xl">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition hover:text-accent"
                        >
                          {post.title}
                        </Link>
                      </h3>
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
          </section>
        ) : null}
      </div>
    </div>
  );
}
