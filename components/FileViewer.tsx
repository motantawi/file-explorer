"use client";

import { useState, useEffect } from "react";
import { getFileExtension } from "@/lib/data";
import type { FileNode } from "@/lib/data";

interface FileViewerProps {
  file: FileNode;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [loading, setLoading] = useState(true);
  const extension = getFileExtension(file.name);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [file.id]);

  const renderPreview = () => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const videoExtensions = ["mp4", "webm", "ogg"];
    const audioExtensions = ["mp3", "wav", "ogg"];
    const textExtensions = [
      "txt",
      "md",
      "json",
      "js",
      "ts",
      "html",
      "css",
      "xml",
    ];

    // Enhanced image detection: check extension AND if file has image data
    const isImageByExtension = imageExtensions.includes(extension);
    const isImageByData = file.data && file.data.startsWith("data:image/");
    const isImage = isImageByExtension || isImageByData;

    if (isImage) {
      // Check if we have actual image data
      if (file.data) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Image Preview
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    // Create download link for the image
                    const link = document.createElement("a");
                    link.href = file.data!;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={() => {
                    // Open image in new tab for full size view
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(`
                        <html>
                          <head><title>${file.name}</title></head>
                          <body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                            <img src="${file.data}" alt="${file.name}" style="max-width:100%;max-height:100%;object-fit:contain;" />
                          </body>
                        </html>
                      `);
                    }
                  }}
                  className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                >
                  🔍 Full Size
                </button>
              </div>
            </div>

            {/* Actual Image Display */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <img
                src={file.data}
                alt={file.name}
                className="max-w-full max-h-96 mx-auto rounded shadow-lg object-contain"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                }}
              />
            </div>

            {/* Image Metadata */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                File Information
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Name:</span> {file.name}
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {extension.toUpperCase()} Image
                </p>
                <p>
                  <span className="font-medium">Size:</span>{" "}
                  {file.size
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : "Unknown"}
                </p>
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
      } else {
        // Fallback for images without data (demo mode)
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-8xl mb-6">🖼️</div>
            <div className="bg-gray-100 rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Image File
              </h3>
              <p className="text-gray-600 mb-3">{file.name}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Type: {extension.toUpperCase()} Image</p>
                <p>
                  Size:{" "}
                  {file.size
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : "Unknown"}
                </p>
                <p>
                  Dimensions: Estimated {Math.floor(Math.random() * 1000 + 500)}
                  x{Math.floor(Math.random() * 1000 + 500)}px
                </p>
              </div>
            </div>
          </div>
        );
      }
    }

    if (videoExtensions.includes(extension)) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-8xl mb-6">🎬</div>
          <div className="bg-gray-100 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Video File
            </h3>
            <p className="text-gray-600 mb-3">{file.name}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Type: {extension.toUpperCase()} Video</p>
              <p>
                Size:{" "}
                {file.size
                  ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                  : "Unknown"}
              </p>
              <p>Duration: Estimated {Math.floor(Math.random() * 300 + 30)}s</p>
              <p>Resolution: Estimated 1920x1080</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
                ▶️ Play
              </button>
              <button className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors">
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (audioExtensions.includes(extension)) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-8xl mb-6">🎵</div>
          <div className="bg-gray-100 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Audio File
            </h3>
            <p className="text-gray-600 mb-3">{file.name}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Type: {extension.toUpperCase()} Audio</p>
              <p>
                Size:{" "}
                {file.size
                  ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                  : "Unknown"}
              </p>
              <p>Duration: Estimated {Math.floor(Math.random() * 240 + 60)}s</p>
              <p>Bitrate: Estimated 320 kbps</p>
            </div>
            <div className="mt-4 bg-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  ▶️
                </button>
                <div className="flex-1 bg-gray-300 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
                </div>
                <span className="text-sm text-gray-600">1:23 / 3:45</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (extension === "pdf") {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-8xl mb-6">📄</div>
          <div className="bg-gray-100 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              PDF Document
            </h3>
            <p className="text-gray-600 mb-3">{file.name}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Type: PDF Document</p>
              <p>
                Size:{" "}
                {file.size
                  ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                  : "Unknown"}
              </p>
              <p>Pages: Estimated {Math.floor(Math.random() * 50 + 1)}</p>
              <p>Created: {new Date(file.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 space-y-2">
              <button className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors">
                📖 Open PDF Viewer
              </button>
              <button className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors">
                ⬇️ Download PDF
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (textExtensions.includes(extension)) {
      const generateSampleContent = () => {
        switch (extension) {
          case "js":
          case "ts":
            return `// ${file.name}
function processFile(file) {
  const result = {
    name: file.name,
    size: file.size,
    type: file.type
  };
  
  return result;
}

export default processFile;`;
          case "json":
            return `{
  "name": "${file.name}",
  "version": "1.0.0",
  "description": "Sample JSON file",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "npm test"
  },
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0"
  }
}`;
          case "html":
            return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.name}</title>
</head>
<body>
  <h1>Welcome to ${file.name}</h1>
  <p>This is a sample HTML file.</p>
</body>
</html>`;
          case "css":
            return `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}

.button {
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}`;
          case "md":
            return `# ${file.name}

## Overview
This is a sample Markdown file demonstrating various formatting options.

## Features
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- \`Code snippets\` for technical terms

## Code Example
\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`

## Links
[Visit our website](https://example.com)

> This is a blockquote with important information.`;
          default:
            return `This is the content of ${file.name}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

File details:
- Name: ${file.name}
- Type: ${extension.toUpperCase()}
- Size: ${file.size ? `${file.size} bytes` : "Unknown"}
- Created: ${new Date(file.createdAt).toLocaleString()}`;
        }
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {extension.toUpperCase()} File Content
            </h3>
            <div className="flex space-x-2">
              <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                📝 Edit
              </button>
              <button className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors">
                📋 Copy
              </button>
            </div>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded text-sm font-mono max-h-96 overflow-auto">
            <pre className="whitespace-pre-wrap">{generateSampleContent()}</pre>
          </div>
        </div>
      );
    }

    // Default preview for unsupported files
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-gray-600 mb-2">
          Preview not available for this file type
        </p>
        <p className="text-sm text-gray-500">File: {file.name}</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {extension === "pdf" && "📄"}
              {(["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
                extension
              ) ||
                (file.data && file.data.startsWith("data:image/"))) &&
                "🖼️"}
              {["mp4", "webm", "ogg"].includes(extension) && "🎬"}
              {["mp3", "wav", "ogg"].includes(extension) && "🎵"}
              {!(
                extension === "pdf" ||
                ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
                  extension
                ) ||
                (file.data && file.data.startsWith("data:image/")) ||
                ["mp4", "webm", "ogg"].includes(extension) ||
                ["mp3", "wav", "ogg"].includes(extension)
              ) && "📄"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {file.name}
              </h2>
              <p className="text-sm text-gray-500">
                {file.size && `${(file.size / 1024).toFixed(1)} KB`} •
                {extension.toUpperCase()} file
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(80vh-100px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <div className={loading ? "hidden" : "block"}>{renderPreview()}</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Created: {new Date(file.createdAt).toLocaleDateString()}
            {file.modifiedAt !== file.createdAt && (
              <span className="ml-4">
                Modified: {new Date(file.modifiedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button onClick={onClose} className="btn text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
