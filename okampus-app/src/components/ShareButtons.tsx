"use client";

import { useState } from "react";
import { buildFacebookShareUrl, copyPageUrl } from "@/lib/share";

type ShareButtonsProps = {
  url: string;
  title: string;
  className?: string;
};

export default function ShareButtons({ url, title, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyPageUrl(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const facebookUrl = buildFacebookShareUrl(url);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm font-semibold text-[#4d4c5c]">Partager :</span>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Partager ${title} sur Facebook`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#166fe5] transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#dcdce5] bg-white text-sm font-semibold text-[#121117] hover:bg-[#f4f4f8] transition-colors"
      >
        {copied ? "Lien copié !" : "Copier le lien"}
      </button>
    </div>
  );
}
