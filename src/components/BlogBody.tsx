import type { BlogPost } from "@/lib/blog/types";
import { isHtmlBody } from "@/lib/blog/types";

/** Trusted HTML from seed/Soro; strip script tags as a basic guard. */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/\son\w+=([^\s>]+)/gi, "");
}

function plainToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function BlogBody({ post }: { post: BlogPost }) {
  const html = isHtmlBody(post.body)
    ? sanitizeHtml(post.body)
    : plainToHtml(post.body);

  return (
    <div
      className="blog-prose mt-10 max-w-none text-base leading-relaxed text-muted [&_a]:font-medium [&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:display [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:my-1 [&_p]:my-4 [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
