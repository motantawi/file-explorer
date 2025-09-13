"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface DragDropUploadProps {
  folderId: string;
  children: React.ReactNode;
}

export function DragDropUpload({ folderId, children }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dragCounter = useRef(0);
  const router = useRouter();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/files/${folderId}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to upload ${file.name}:`, error.error);
          alert(`Failed to upload ${file.name}: ${error.error}`);
          return false;
        }
        return true;
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        router.refresh();
        console.log(`Successfully uploaded ${successCount} files`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}

      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-20 border-4 border-dashed border-blue-500 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Drop files here
            </h3>
            <p className="text-gray-600">
              Release to upload files to this folder
            </p>
          </div>
        </div>
      )}

      {/* Upload Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Uploading files...
            </h3>
            <p className="text-gray-600">
              Please wait while your files are being uploaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
