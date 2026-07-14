import { ImageResponse } from "next/og";
import type { BlogPost } from "@/lib/blog/types";

export const ogSize = { width: 1200, height: 630 };

export function renderBlogOgCard(post: BlogPost | null) {
  const title = post?.title?.trim() || "Hostora";
  const description =
    post?.description?.trim().slice(0, 140) ||
    "Hospitality operations software";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0C",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#E8A54B",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Hostora
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#F4F1EA",
              fontSize: title.length > 80 ? 44 : 54,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxHeight: 280,
              overflow: "hidden",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "rgba(244, 241, 234, 0.65)",
              fontSize: 28,
              lineHeight: 1.35,
              maxHeight: 90,
              overflow: "hidden",
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "rgba(232, 165, 75, 0.85)",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          hostorasoft.co.uk/blog
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
