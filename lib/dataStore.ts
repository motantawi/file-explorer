/**
 * Data store operations for the file explorer
 */

import { FolderNode, FileNode, Node } from "./types";
import {
  validateName,
  validateUniqueNameInFolder,
  ValidationResult,
} from "./validation";

// Use globalThis to ensure data persists across module reloads in development
declare global {
  var __fileExplorerData: FolderNode | undefined;
}

// Instance tracking for debugging
const instanceId = Math.random().toString(36).substr(2, 9);
console.log(`DataStore instance created: ${instanceId}`);

// Initial data structure
const initialData: FolderNode = {
  id: "root",
  name: "My Files",
  type: "folder",
  createdAt: "2024-01-01T10:00:00Z",
  modifiedAt: "2024-01-01T10:00:00Z",
  children: [
    {
      id: "folder-1",
      name: "Documents",
      type: "folder",
      children: [
        {
          id: "file-1",
          name: "report.pdf",
          type: "file",
          size: 1024000,
          createdAt: "2024-01-01T11:00:00Z",
          modifiedAt: "2024-01-01T11:00:00Z",
          parentId: "folder-1",
        },
        {
          id: "file-2",
          name: "presentation.pptx",
          type: "file",
          size: 2048000,
          createdAt: "2024-01-01T12:00:00Z",
          modifiedAt: "2024-01-01T12:00:00Z",
          parentId: "folder-1",
        },
        {
          id: "folder-nested",
          name: "Nested Folder",
          type: "folder",
          children: [
            {
              id: "file-nested",
              name: "nested-file.txt",
              type: "file",
              size: 512,
              createdAt: "2024-01-01T14:00:00Z",
              modifiedAt: "2024-01-01T14:00:00Z",
              parentId: "folder-nested",
            },
            {
              id: "folder-deep",
              name: "Deep Folder",
              type: "folder",
              children: [
                {
                  id: "file-deep",
                  name: "deep-file.js",
                  type: "file",
                  size: 1024,
                  createdAt: "2024-01-01T15:00:00Z",
                  modifiedAt: "2024-01-01T15:00:00Z",
                  parentId: "folder-deep",
                },
              ],
              createdAt: "2024-01-01T14:30:00Z",
              modifiedAt: "2024-01-01T15:00:00Z",
              parentId: "folder-nested",
            },
          ],
          createdAt: "2024-01-01T13:30:00Z",
          modifiedAt: "2024-01-01T15:00:00Z",
          parentId: "folder-1",
        },
      ],
      createdAt: "2024-01-01T10:30:00Z",
      modifiedAt: "2024-01-01T15:00:00Z",
      parentId: "root",
    },
    {
      id: "folder-2",
      name: "Images",
      type: "folder",
      children: [
        {
          id: "file-3",
          name: "photo.jpg",
          type: "file",
          size: 512000,
          createdAt: "2024-01-01T13:00:00Z",
          modifiedAt: "2024-01-01T13:00:00Z",
          parentId: "folder-2",
        },
        {
          id: "file-4",
          name: "diagram.png",
          type: "file",
          size: 256000,
          createdAt: "2024-01-01T14:00:00Z",
          modifiedAt: "2024-01-01T14:00:00Z",
          parentId: "folder-2",
        },
      ],
      createdAt: "2024-01-01T11:00:00Z",
      modifiedAt: "2024-01-01T14:00:00Z",
      parentId: "root",
    },
    {
      id: "file-5",
      name: "readme.txt",
      type: "file",
      size: 1024,
      createdAt: "2024-01-01T15:00:00Z",
      modifiedAt: "2024-01-01T15:00:00Z",
      parentId: "root",
    },
    {
      id: "folder-3",
      name: "Test Folder",
      type: "folder",
      children: [
        {
          id: "file-6",
          name: "test.txt",
          type: "file",
          size: 512,
          createdAt: "2024-01-01T16:00:00Z",
          modifiedAt: "2024-01-01T16:00:00Z",
          parentId: "folder-3",
        },
      ],
      createdAt: "2024-01-01T16:00:00Z",
      modifiedAt: "2024-01-01T16:00:00Z",
      parentId: "root",
    },
  ],
};

// Initialize global data if not exists
if (!globalThis.__fileExplorerData) {
  globalThis.__fileExplorerData = initialData;
  console.log("Initialized global file explorer data");
} else {
  console.log("Using existing global file explorer data");
}

// Export the global data as root
export const root: FolderNode = globalThis.__fileExplorerData;

/**
 * Debug function to print the data tree
 */
export function debugDataTree(node: Node = root, depth = 0): void {
  const indent = "  ".repeat(depth);
  console.log(`${indent}${node.type}: ${node.name} (${node.id})`);
  if (node.type === "folder") {
    for (const child of node.children) {
      debugDataTree(child, depth + 1);
    }
  }
}

/**
 * Recursively find a node by ID
 */
export function findNode(id: string, currentNode: Node = root): Node | null {
  if (currentNode.id === id) {
    return currentNode;
  }

  if (currentNode.type === "folder") {
    for (const child of currentNode.children) {
      const found = findNode(id, child);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find a folder by ID
 */
export function findFolder(id: string): FolderNode | null {
  const node = findNode(id);
  return node?.type === "folder" ? node : null;
}

/**
 * Find a file by ID
 */
export function findFile(id: string): FileNode | null {
  const node = findNode(id);
  return node?.type === "file" ? node : null;
}

/**
 * Find parent folder of a node
 */
export function findParentFolder(nodeId: string): FolderNode | null {
  const node = findNode(nodeId);
  if (!node?.parentId) return null;

  return findFolder(node.parentId);
}

/**
 * Get all files recursively
 */
export function getAllFiles(currentNode: Node = root): FileNode[] {
  const files: FileNode[] = [];

  if (currentNode.type === "file") {
    files.push(currentNode);
  } else {
    for (const child of currentNode.children) {
      files.push(...getAllFiles(child));
    }
  }

  return files;
}

/**
 * Get recent files (sorted by modification date)
 */
export function getRecentFiles(limit: number = 10): FileNode[] {
  const allFiles = getAllFiles();
  return allFiles
    .sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )
    .slice(0, limit);
}

/**
 * Search for nodes by name
 */
export function searchNodes(query: string, currentNode: Node = root): Node[] {
  const results: Node[] = [];
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) return results;

  function search(node: Node) {
    if (node.name.toLowerCase().includes(searchTerm)) {
      results.push(node);
    }

    if (node.type === "folder") {
      for (const child of node.children) {
        search(child);
      }
    }
  }

  search(currentNode);
  return results;
}

/**
 * Create a new file in a folder
 */
export function createFile(
  parentFolderId: string,
  fileName: string,
  size?: number,
  data?: string,
  url?: string
): { success: boolean; error?: string; fileId?: string } {
  const parent = findFolder(parentFolderId);
  if (!parent) {
    return { success: false, error: "Parent folder not found" };
  }

  // Validate file name
  const nameValidation = validateName(fileName);
  if (!nameValidation.isValid) {
    return { success: false, error: nameValidation.errors.join(", ") };
  }

  // Check for duplicate names
  const uniqueValidation = validateUniqueNameInFolder(fileName, parent);
  if (!uniqueValidation.isValid) {
    return { success: false, error: uniqueValidation.errors.join(", ") };
  }

  const now = new Date().toISOString();
  const fileId = `file-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const newFile: FileNode = {
    id: fileId,
    name: fileName,
    type: "file",
    size: size || fileName.length * 8, // Estimate size for text files
    createdAt: now,
    modifiedAt: now,
    parentId: parentFolderId,
    data: data,
    url: url,
  };

  parent.children.push(newFile);
  parent.modifiedAt = now;

  return { success: true, fileId };
}

/**
 * Create a new folder
 */
export function createFolder(
  parentFolderId: string,
  folderName: string
): { success: boolean; error?: string; folderId?: string } {
  const parent = findFolder(parentFolderId);
  if (!parent) {
    return { success: false, error: "Parent folder not found" };
  }

  // Validate folder name
  const nameValidation = validateName(folderName);
  if (!nameValidation.isValid) {
    return { success: false, error: nameValidation.errors.join(", ") };
  }

  // Check for duplicate names
  const uniqueValidation = validateUniqueNameInFolder(folderName, parent);
  if (!uniqueValidation.isValid) {
    return { success: false, error: uniqueValidation.errors.join(", ") };
  }

  const now = new Date().toISOString();
  const folderId = `folder-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const newFolder: FolderNode = {
    id: folderId,
    name: folderName,
    type: "folder",
    children: [],
    createdAt: now,
    modifiedAt: now,
    parentId: parentFolderId,
  };

  parent.children.push(newFolder);
  parent.modifiedAt = now;

  // Ensure the global reference is updated
  globalThis.__fileExplorerData = root;

  return { success: true, folderId };
}

/**
 * Delete a node by ID
 */
export function deleteNode(nodeId: string): {
  success: boolean;
  error?: string;
} {
  if (nodeId === "root") {
    return { success: false, error: "Cannot delete root folder" };
  }

  const parent = findParentFolder(nodeId);
  if (!parent) {
    return { success: false, error: "Parent folder not found" };
  }

  const nodeIndex = parent.children.findIndex((child) => child.id === nodeId);
  if (nodeIndex === -1) {
    return { success: false, error: "Node not found" };
  }

  parent.children.splice(nodeIndex, 1);
  parent.modifiedAt = new Date().toISOString();

  return { success: true };
}

/**
 * Rename a node
 */
export function renameNode(
  nodeId: string,
  newName: string
): { success: boolean; error?: string } {
  const node = findNode(nodeId);
  if (!node) {
    return { success: false, error: "Node not found" };
  }

  if (nodeId === "root") {
    return { success: false, error: "Cannot rename root folder" };
  }

  // Validate new name
  const nameValidation = validateName(newName);
  if (!nameValidation.isValid) {
    return { success: false, error: nameValidation.errors.join(", ") };
  }

  // Check for duplicate names in parent folder
  const parent = findParentFolder(nodeId);
  if (parent) {
    const uniqueValidation = validateUniqueNameInFolder(
      newName,
      parent,
      nodeId
    );
    if (!uniqueValidation.isValid) {
      return { success: false, error: uniqueValidation.errors.join(", ") };
    }
  }

  node.name = newName;
  node.modifiedAt = new Date().toISOString();

  return { success: true };
}
