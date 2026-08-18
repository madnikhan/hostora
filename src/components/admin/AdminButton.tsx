type Props = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function AdminButton({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    variant === "primary"
      ? "bg-[#E8A54B] text-[#0B0B0C] hover:bg-[#F0B95F]"
      : variant === "secondary"
        ? "border border-white/15 text-white/80 hover:border-white/30"
        : "text-[#E8A54B] hover:underline";
  return (
    <button
      className={`rounded px-4 py-2 text-sm font-medium transition disabled:opacity-40 ${base} ${className}`}
      {...props}
    />
  );
}
