import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  centered?: boolean;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  centered = false,
}: PageHeaderProps) {
  return (
    <div
      className={`mb-8 md:mb-12 ${centered ? "text-center max-w-3xl mx-auto" : "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"}`}
    >
      <div className={centered ? "" : "max-w-2xl"}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d4c5c] mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[32px] md:text-[48px] font-bold leading-[1.13] tracking-[-0.01em] text-[#121117]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base md:text-lg text-[#4d4c5c] leading-[1.5]">{description}</p>
        )}
      </div>
      {action && (
        <div
          className={
            centered
              ? "mt-6 flex flex-wrap justify-center gap-3"
              : "flex flex-wrap items-center gap-3 shrink-0"
          }
        >
          {action}
        </div>
      )}
    </div>
  );
}
