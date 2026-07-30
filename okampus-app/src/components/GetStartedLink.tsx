"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface GetStartedLinkProps {
  href?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export default function GetStartedLink({
  href,
  className,
  children,
  onClick,
}: GetStartedLinkProps) {
  const { user, isLoaded, isAuthenticated } = useAuth();

  const target = href ?? (isAuthenticated ? "/assistant" : "/inscription");
  const label =
    children ??
    (isLoaded && isAuthenticated ? "Mon espace" : "Commencer");

  return (
    <Link href={target} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}
