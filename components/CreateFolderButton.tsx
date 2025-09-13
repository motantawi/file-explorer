"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateFolderButtonProps {
  folderId: string;
}

export function CreateFolderButton({ folderId }: CreateFolderButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsCreating(true);
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (response.ok) {
        router.refresh();
        setOpen(false);
        setName("");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create folder");
      }
    } catch (error) {
      alert("Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
      >
        + Folder
      </button>
      {open && (
        <form
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onSubmit={handleSubmit}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4">
            <h3 className="text-lg font-semibold">Create New Folder</h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Folder Name
              </label>
              <input
                autoFocus
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setName("");
                }}
                className="border px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || isCreating}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
