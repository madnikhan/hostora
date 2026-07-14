import { getBlogPost } from "@/lib/blog/store";
import { renderBlogOgCard } from "@/lib/blog/ogImage";

export const runtime = "nodejs";
export const alt = "Hostora article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return renderBlogOgCard(post);
}
