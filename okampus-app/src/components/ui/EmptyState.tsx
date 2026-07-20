import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card p-10 md:p-14 text-center">
      {icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#f4f4f8] text-[#121117]">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-bold text-[#121117]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[#4d4c5c] leading-relaxed">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
