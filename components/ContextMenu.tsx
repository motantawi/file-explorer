"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FileNode, FolderNode } from "@/lib/data";

interface ContextMenuProps {
  item: FileNode | FolderNode;
  onClose: () => void;
  position: { x: number; y: number };
}

export function ContextMenu({ item, onClose, position }: ContextMenuProps) {
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const router = useRouter();

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === item.name) {
      setShowRename(false);
      return;
    }

    try {
      const response = await fetch(`/api/${item.type}s/${item.id}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to rename");
      }
    } catch (error) {
      alert("Failed to rename");
    }

    setShowRename(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/${item.type}s/${item.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete");
      }
    } catch (error) {
      alert("Failed to delete");
    }

    onClose();
  };

  if (showRename) {
    return (
      <div
        className="fixed bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-48"
        style={{ left: position.x, top: position.y }}
      >
        <form onSubmit={handleRename} className="space-y-3">
          <h4 className="font-medium text-gray-900">Rename {item.type}</h4>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onBlur={() => setShowRename(false)}
          />
          <div className="flex gap-2">
            <button type="submit" className="btn text-xs px-2 py-1">
              Rename
            </button>
            <button
              type="button"
              onClick={() => setShowRename(false)}
              className="btn-secondary text-xs px-2 py-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-50 min-w-32"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={() => setShowRename(true)}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Rename
      </button>

      <button
        onClick={handleDelete}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete
      </button>

      {item.type === "file" && (
        <a
          href={`/${item.name}`}
          download={item.name}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
          onClick={onClose}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download
        </a>
      )}

      <div className="border-t border-gray-200 mt-2 pt-2">
        <button
          onClick={onClose}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
