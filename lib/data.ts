/**
 * Main data module - Re-exports all data-related functionality
 * This maintains backward compatibility while using the new modular structure
 */

// Re-export types
export type {
  FileNode,
  FolderNode,
  Node,
  BaseNode,
  SearchResult,
  FileUploadResult,
  FolderCreationResult,
  FileCategory,
  FileTypeInfo,
} from "./types";

// Re-export file utilities
export {
  FILE_TYPE_MAP,
  getFileExtension,
  getFileTypeInfo,
  isFileCategory,
  getFilesByCategory,
  formatFileSize,
} from "./fileUtils";

// Re-export validation
export {
  VALIDATION_RULES,
  validateName,
  validateFileSize,
  validateUniqueNameInFolder,
  validateNodeStructure,
  type ValidationResult,
} from "./validation";

// Re-export data store functions
export {
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

// Additional utility functions for backward compatibility
export function searchFiles(query: string): import("./types").FileNode[] {
  const { searchNodes } = require("./dataStore");
  const searchResults = searchNodes(query);
  return searchResults.filter((node: any) => node.type === "file");
}
