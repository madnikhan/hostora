import { FadeUp } from "@/components/FadeUp";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  centered?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  centered = false,
}: Props) {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-border px-6 pb-16 pt-20 md:pb-20 md:pt-24">
      <div
        className={`relative z-10 mx-auto max-w-5xl ${centered ? "text-center" : ""}`}
      >
        <FadeUp>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="display mt-4 text-5xl font-extrabold tracking-tight md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {description}
            </p>
          ) : null}
          {children ? (
            <div
              className={`mt-10 flex flex-wrap gap-4 ${centered ? "justify-center" : ""}`}
            >
              {children}
            </div>
          ) : null}
        </FadeUp>
      </div>
    </section>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
