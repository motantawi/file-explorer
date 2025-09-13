"use client";

import Link from "next/link";
import { findNode, findParentFolder, root } from "@/lib/data";

interface BreadcrumbProps {
  currentFolderId: string;
}

export function Breadcrumb({ currentFolderId }: BreadcrumbProps) {
  const getBreadcrumbPath = (folderId: string) => {
    const path: { id: string; name: string }[] = [];

    // Special case for root
    if (folderId === "root") {
      return [{ id: "root", name: root.name }];
    }

    // Build path by traversing up the hierarchy
    const buildPath = (nodeId: string): void => {
      const node = findNode(nodeId);
      if (!node) return;

      // Add current node to path
      path.unshift({ id: node.id, name: node.name });

      // Find parent and recursively build path
      const parent = findParentFolder(nodeId);
      if (parent && parent.id !== "root") {
        buildPath(parent.id);
      }
    };

    buildPath(folderId);

    // Always add root at the beginning
    path.unshift({ id: "root", name: root.name });

    return path;
  };

  const breadcrumbPath = getBreadcrumbPath(currentFolderId);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbPath.map((item, index) => (
        <div key={item.id} className="flex items-center">
          {index > 0 && <span className="mx-2 text-gray-400">/</span>}
          {index === breadcrumbPath.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <Link
              href={item.id === "root" ? "/" : `/folder/${item.id}`}
              className="hover:text-blue-600 hover:underline"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
