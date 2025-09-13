/**
 * File type utilities and constants
 */

import { FileCategory, FileTypeInfo } from "./types";

// File type definitions with categories and styling
export const FILE_TYPE_MAP: Record<string, FileTypeInfo> = {
  // Images
  jpg: {
    category: "image",
    icon: "🖼️",
    color: "text-purple-600",
    extensions: ["jpg", "jpeg"],
  },
  jpeg: {
    category: "image",
    icon: "🖼️",
    color: "text-purple-600",
    extensions: ["jpg", "jpeg"],
  },
  png: {
    category: "image",
    icon: "🖼️",
    color: "text-purple-600",
    extensions: ["png"],
  },
  gif: {
    category: "image",
    icon: "🖼️",
    color: "text-purple-600",
    extensions: ["gif"],
  },
  svg: {
    category: "image",
    icon: "🖼️",
    color: "text-purple-600",
    extensions: ["svg"],
  },
  webp: {
    category: "image",
    icon: "🖼️",
    color: "text-purple-600",
    extensions: ["webp"],
  },

  // Videos
  mp4: {
    category: "video",
    icon: "🎬",
    color: "text-pink-600",
    extensions: ["mp4"],
  },
  avi: {
    category: "video",
    icon: "🎬",
    color: "text-pink-600",
    extensions: ["avi"],
  },
  mov: {
    category: "video",
    icon: "🎬",
    color: "text-pink-600",
    extensions: ["mov"],
  },
  webm: {
    category: "video",
    icon: "🎬",
    color: "text-pink-600",
    extensions: ["webm"],
  },
  mkv: {
    category: "video",
    icon: "🎬",
    color: "text-pink-600",
    extensions: ["mkv"],
  },

  // Audio
  mp3: {
    category: "audio",
    icon: "🎵",
    color: "text-indigo-600",
    extensions: ["mp3"],
  },
  wav: {
    category: "audio",
    icon: "🎵",
    color: "text-indigo-600",
    extensions: ["wav"],
  },
  flac: {
    category: "audio",
    icon: "🎵",
    color: "text-indigo-600",
    extensions: ["flac"],
  },
  ogg: {
    category: "audio",
    icon: "🎵",
    color: "text-indigo-600",
    extensions: ["ogg"],
  },

  // Documents
  pdf: {
    category: "document",
    icon: "📄",
    color: "text-red-600",
    extensions: ["pdf"],
  },
  doc: {
    category: "document",
    icon: "📘",
    color: "text-blue-600",
    extensions: ["doc", "docx"],
  },
  docx: {
    category: "document",
    icon: "📘",
    color: "text-blue-600",
    extensions: ["doc", "docx"],
  },
  xls: {
    category: "document",
    icon: "📊",
    color: "text-green-600",
    extensions: ["xls", "xlsx"],
  },
  xlsx: {
    category: "document",
    icon: "📊",
    color: "text-green-600",
    extensions: ["xls", "xlsx"],
  },
  ppt: {
    category: "document",
    icon: "📋",
    color: "text-orange-600",
    extensions: ["ppt", "pptx"],
  },
  pptx: {
    category: "document",
    icon: "📋",
    color: "text-orange-600",
    extensions: ["ppt", "pptx"],
  },

  // Code files
  js: {
    category: "code",
    icon: "⚡",
    color: "text-yellow-600",
    extensions: ["js"],
  },
  ts: {
    category: "code",
    icon: "⚡",
    color: "text-yellow-600",
    extensions: ["ts"],
  },
  jsx: {
    category: "code",
    icon: "⚛️",
    color: "text-blue-400",
    extensions: ["jsx"],
  },
  tsx: {
    category: "code",
    icon: "⚛️",
    color: "text-blue-400",
    extensions: ["tsx"],
  },
  html: {
    category: "code",
    icon: "🌐",
    color: "text-orange-500",
    extensions: ["html", "htm"],
  },
  css: {
    category: "code",
    icon: "🎨",
    color: "text-blue-500",
    extensions: ["css"],
  },
  scss: {
    category: "code",
    icon: "🎨",
    color: "text-pink-500",
    extensions: ["scss", "sass"],
  },
  json: {
    category: "code",
    icon: "⚙️",
    color: "text-green-500",
    extensions: ["json"],
  },
  xml: {
    category: "code",
    icon: "⚙️",
    color: "text-gray-500",
    extensions: ["xml"],
  },

  // Text files
  txt: {
    category: "text",
    icon: "📝",
    color: "text-gray-600",
    extensions: ["txt"],
  },
  md: {
    category: "text",
    icon: "📝",
    color: "text-gray-600",
    extensions: ["md", "markdown"],
  },

  // Archives
  zip: {
    category: "archive",
    icon: "🗜️",
    color: "text-yellow-700",
    extensions: ["zip"],
  },
  rar: {
    category: "archive",
    icon: "🗜️",
    color: "text-yellow-700",
    extensions: ["rar"],
  },
  tar: {
    category: "archive",
    icon: "🗜️",
    color: "text-yellow-700",
    extensions: ["tar", "gz"],
  },
};

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
}

/**
 * Get file type information
 */
export function getFileTypeInfo(filename: string): FileTypeInfo {
  const extension = getFileExtension(filename);
  return (
    FILE_TYPE_MAP[extension] || {
      category: "other",
      icon: "📄",
      color: "text-gray-500",
      extensions: [extension],
    }
  );
}

/**
 * Check if file is of specific category
 */
export function isFileCategory(
  filename: string,
  category: FileCategory
): boolean {
  const fileInfo = getFileTypeInfo(filename);
  return fileInfo.category === category;
}

/**
 * Get files by category
 */
export function getFilesByCategory(
  files: any[],
  category: FileCategory
): any[] {
  return files.filter(
    (file) => file.type === "file" && isFileCategory(file.name, category)
  );
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown size";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
