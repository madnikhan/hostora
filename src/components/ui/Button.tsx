import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: Props) {
  const styles =
    variant === "primary"
      ? "rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
      : variant === "secondary"
        ? "rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/30"
        : "text-sm font-semibold text-accent transition hover:text-accent-strong";

  return (
    <Link href={href} className={`inline-flex ${styles} ${className}`}>
      {children}
    </Link>
  );
}
