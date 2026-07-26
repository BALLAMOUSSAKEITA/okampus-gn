"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface GetStartedLinkProps {
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export default function GetStartedLink({ href, className, children, onClick }: GetStartedLinkProps) {
  const { user, isLoaded } = useAuth();
  const target = href ?? (isLoaded && user ? "/" : "/inscription");

  return (
    <Link href={target} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
