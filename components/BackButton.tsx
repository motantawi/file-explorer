"use client";

import Link from "next/link";
import { findParentFolder } from "@/lib/data";

interface BackButtonProps {
  currentFolderId: string;
}

export function BackButton({ currentFolderId }: BackButtonProps) {
  if (currentFolderId === "root") {
    return null; // No back button for root
  }

  const parent = findParentFolder(currentFolderId);
  if (!parent) {
    return null;
  }

  const href = parent.id === "root" ? "/" : `/folder/${parent.id}`;

  return (
    <Link
      href={href}
      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </Link>
  );
}
