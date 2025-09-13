/**
 * Main library exports - Centralized imports for the file explorer
 *
 * This file provides a clean interface for importing library functions
 * and maintains a clear separation of concerns.
 */

// Data layer exports
export * from "./data";
export * from "./types";
export * from "./dataStore";

// Utility exports
export * from "./fileUtils";
export * from "./validation";
export * from "./utils";
export * from "./constants";

// React hooks
export * from "./hooks";

// Organized re-exports by category
export {
  // Core data operations
  root,
  findNode,
  findFolder,
  findFile,
  findParentFolder,
  getAllFiles,
  getRecentFiles,
  searchNodes,
  createFile,
  createFolder,
  deleteNode,
  renameNode,
} from "./dataStore";

export {
  // File utilities
  getFileExtension,
  getFileTypeInfo,
  formatFileSize,
  isFileCategory,
  getFilesByCategory,
  FILE_TYPE_MAP,
} from "./fileUtils";

export {
  // Validation functions
  validateName,
  validateFileSize,
  validateUniqueNameInFolder,
  validateNodeStructure,
  VALIDATION_RULES,
} from "./validation";

export {
  // Common utilities
  generateId,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  capitalize,
  truncateText,
  formatRelativeTime,
  sortNodes,
  getNodePath,
  isDescendant,
  calculateFolderSize,
  countFolderItems,
  classNames,
  storage,
  validators,
} from "./utils";

export {
  // Application constants
  APP_CONFIG,
  UI_CONFIG,
  FILE_LIMITS,
  PREVIEW_SUPPORT,
  ANIMATIONS,
  Z_INDEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "./constants";

export {
  // React hooks
  useSidebar,
  useSearch,
  useFileOperations,
  useModal,
  useFileViewer,
  useDragAndDrop,
  useFolderNavigation,
  usePreferences,
} from "./hooks";
