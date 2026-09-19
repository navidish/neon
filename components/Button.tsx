import { LoaderCircle } from "lucide-react";

export function Button({
  children,
  loading = false,
  disabled = false,
  variant = "primary",
  type = "button",
  onClick
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={variant === "primary" ? "primary-button w-full" : "secondary-button w-full"}
    >
      {loading && <LoaderCircle size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
