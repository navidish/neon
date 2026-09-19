import { AlertCircle } from "lucide-react";

export function ErrorMessage({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="error-box flex items-start gap-2" role="alert">
      <AlertCircle size={17} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
