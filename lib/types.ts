/**
 * Type definitions for the file explorer
 */

export interface BaseNode {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  parentId?: string;
}

export interface FileNode extends BaseNode {
  type: "file";
  size?: number;
  data?: string; // Base64 encoded file data for images and other files
  url?: string; // For file URLs if using external storage
}

export interface FolderNode extends BaseNode {
  type: "folder";
  children: Array<FolderNode | FileNode>;
}

export type Node = FolderNode | FileNode;

export interface SearchResult {
  node: Node;
  parentPath: string;
  matchType: "name" | "content";
}

export interface FileUploadResult {
  success: boolean;
  error?: string;
  fileId?: string;
}

export interface FolderCreationResult {
  success: boolean;
  error?: string;
  folderId?: string;
}

// File type categories for better organization
export type FileCategory =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "code"
  | "archive"
  | "text"
  | "other";

export interface FileTypeInfo {
  category: FileCategory;
  icon: string;
  color: string;
  extensions: string[];
}
