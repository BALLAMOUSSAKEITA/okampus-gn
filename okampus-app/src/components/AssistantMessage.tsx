import type { ReactNode } from "react";
import Link from "next/link";

function renderInline(text: string): ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex).filter((part) => part.length > 0);

  return parts.map((part, index) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={index} className="font-semibold text-[#121117]">
          {boldMatch[1]}
        </strong>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const linkClass =
        "font-semibold text-[#121117] underline underline-offset-2 hover:text-[#14b887] transition-colors";

      if (href.startsWith("/")) {
        return (
          <Link key={index} href={href} className={linkClass}>
            {label}
          </Link>
        );
      }

      return (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
        </a>
      );
    }

    return part;
  });
}

export default function AssistantMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let listOrdered = false;

  const flushList = () => {
    if (listItems.length === 0) return;
    const ListTag = listOrdered ? "ol" : "ul";
    elements.push(
      <ListTag
        key={`list-${elements.length}`}
        className={`my-2 space-y-1 ${listOrdered ? "list-decimal pl-5" : "list-disc pl-5"}`}
      >
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ListTag>
    );
    listItems = [];
    listOrdered = false;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <p key={`h-${index}`} className="font-semibold text-[#121117] mt-3 first:mt-0 mb-1">
          {trimmed.slice(3)}
        </p>
      );
      return;
    }

    const boldHeaderMatch = trimmed.match(/^\*\*(.+)\*\*:?\s*$/);
    if (boldHeaderMatch) {
      flushList();
      elements.push(
        <p key={`h-${index}`} className="font-semibold text-[#121117] mt-3 first:mt-0 mb-1">
          {boldHeaderMatch[1]}
        </p>
      );
      return;
    }

    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
    if (bulletMatch) {
      listOrdered = false;
      listItems.push(bulletMatch[1]);
      return;
    }

    const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)/);
    if (orderedMatch) {
      listOrdered = true;
      listItems.push(orderedMatch[1]);
      return;
    }

    flushList();
    elements.push(
      <p key={`p-${index}`} className="my-1">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="text-sm leading-relaxed">{elements}</div>;
}
