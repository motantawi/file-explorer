"use client";

import Link from "next/link";
import { useState } from "react";
import type { FolderNode, FileNode } from "@/lib/data";
import { FileIcon } from "@/components/FileIcon";
import { formatFileSize } from "@/lib/data";
import { FileViewer } from "@/components/FileViewer";

export function FolderList({ nodes }: { nodes: Array<FolderNode | FileNode> }) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  if (!nodes.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📁</div>
        <p className="text-gray-500">This folder is empty</p>
      </div>
    );
  }

  // Sort nodes: folders first, then files, both alphabetically
  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-2">
      {/* Desktop/Tablet Grid View */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedNodes.map((node) => {
          if (node.type === "folder") {
            return (
              <Link
                key={node.id}
                href={`/folder/${node.id}`}
                className="group block border rounded-lg p-4 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="text-blue-600 group-hover:text-blue-700">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-blue-700 truncate w-full">
                    {node.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {node.children.length} items
                  </span>
                </div>
              </Link>
            );
          }
          return (
            <div
              key={node.id}
              className="group border rounded-lg p-4 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => setSelectedFile(node)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <FileIcon filename={node.name} className="w-12 h-12" />
                <span className="font-medium text-gray-900 truncate w-full text-sm">
                  {node.name}
                </span>
                {node.size && (
                  <span className="text-xs text-gray-500">
                    {formatFileSize(node.size)}
                  </span>
                )}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-blue-600">
                    Click to preview
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile List View */}
      <div className="sm:hidden space-y-2">
        {sortedNodes.map((node) => {
          if (node.type === "folder") {
            return (
              <Link
                key={node.id}
                href={`/folder/${node.id}`}
                className="group flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <div className="text-blue-600 group-hover:text-blue-700">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                    {node.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {node.children.length} items
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          }
          return (
            <div
              key={node.id}
              className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedFile(node)}
            >
              <FileIcon filename={node.name} className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {node.name}
                </div>
                {node.size && (
                  <div className="text-sm text-gray-500">
                    {formatFileSize(node.size)}
                  </div>
                )}
              </div>
              <div className="text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* File Viewer Modal */}
      {selectedFile && (
        <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </div>
  );
}
