/**
 * Application constants and configuration
 */

// Application metadata
export const APP_CONFIG = {
  name: "File Explorer",
  version: "1.0.0",
  description: "Professional File Management System",
  author: "File Explorer Team",
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Sidebar settings
  sidebar: {
    collapsedWidth: "4rem", // 64px
    expandedWidth: "16rem", // 256px
    animationDuration: "300ms",
  },

  // Mobile breakpoints (matching Tailwind CSS)
  breakpoints: {
    mobile: "0px",
    tablet: "768px",
    desktop: "1024px",
  },

  // File grid settings
  grid: {
    minItemWidth: "200px",
    gap: "1rem",
    padding: "1.5rem",
  },

  // Modal settings
  modal: {
    maxWidth: "600px",
    backdropBlur: "4px",
  },
} as const;

// File system limits
export const FILE_LIMITS = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxFileName: 255,
  maxFolderName: 255,
  maxSearchResults: 50,
  recentFilesLimit: 20,
} as const;

// Supported file formats for preview
export const PREVIEW_SUPPORT = {
  images: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
  videos: ["mp4", "webm", "ogg"],
  audio: ["mp3", "wav", "ogg"],
  text: ["txt", "md", "json", "js", "ts", "html", "css", "xml"],
  documents: ["pdf"],
} as const;

// Animation durations
export const ANIMATIONS = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
  sidebar: "300ms",
  modal: "200ms",
  hover: "150ms",
} as const;

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  tooltip: 20,
  modal: 40,
  sidebar: 50,
  notification: 100,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  fileNotFound: "File not found",
  folderNotFound: "Folder not found",
  parentNotFound: "Parent folder not found",
  nameRequired: "Name is required",
  nameTooLong: "Name is too long",
  nameInvalid: "Name contains invalid characters",
  fileExists: "A file with this name already exists",
  folderExists: "A folder with this name already exists",
  fileTooLarge: "File is too large",
  uploadFailed: "Upload failed",
  deleteFailed: "Delete failed",
  renameFailed: "Rename failed",
  createFailed: "Creation failed",
  networkError: "Network error occurred",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  fileCreated: "File created successfully",
  folderCreated: "Folder created successfully",
  fileUploaded: "File uploaded successfully",
  fileDeleted: "File deleted successfully",
  folderDeleted: "Folder deleted successfully",
  fileRenamed: "File renamed successfully",
  folderRenamed: "Folder renamed successfully",
} as const;
