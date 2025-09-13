"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateFileButtonProps {
  folderId: string;
}

export function CreateFileButton({ folderId }: CreateFileButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (name.trim()) {
        formData.append("name", name.trim());
      }

      const response = await fetch(`/api/files/${folderId}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.refresh();
        setOpen(false);
        setName("");
        setFile(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create file");
      }
    } catch (error) {
      alert("Failed to create file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        + File
      </button>
      {open && (
        <form
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onSubmit={handleSubmit}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-semibold">Create New File</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  File Name
                </label>
                <input
                  autoFocus
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter file name (e.g., document.txt)"
                />
              </div>

              <div className="text-center text-gray-500">or</div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setName("");
                  setFile(null);
                }}
                className="border px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={(!name.trim() && !file) || isUploading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
