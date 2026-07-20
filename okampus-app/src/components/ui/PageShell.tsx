import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  bg?: "mist" | "white";
}

export default function PageShell({
  children,
  className = "",
  narrow = false,
  bg = "mist",
}: PageShellProps) {
  return (
    <div
      className={`min-h-screen ${bg === "white" ? "bg-white" : "bg-[#f4f4f8]"} ${className}`}
    >
      <div
        className={`mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 md:py-12 ${
          narrow ? "max-w-[800px]" : "max-w-[1200px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
