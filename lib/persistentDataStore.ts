/**
 * Persistent data store that uses localStorage for persistence
 */

import { FolderNode, FileNode, Node } from "./types";
import {
  validateName,
  validateUniqueNameInFolder,
  ValidationResult,
} from "./validation";

// Storage key for localStorage
const STORAGE_KEY = "fileExplorerData";

// Initial data structure
const initialRoot: FolderNode = {
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
          name: "screenshot.png",
          type: "file",
          size: 256000,
          createdAt: "2024-01-01T14:00:00Z",
          modifiedAt: "2024-01-01T14:00:00Z",
          parentId: "folder-2",
        },
      ],
      createdAt: "2024-01-01T10:30:00Z",
      modifiedAt: "2024-01-01T14:00:00Z",
      parentId: "root",
    },
    {
      id: "folder-3",
      name: "Downloads",
      type: "folder",
      children: [
        {
          id: "file-5",
          name: "installer.exe",
          type: "file",
          size: 5120000,
          createdAt: "2024-01-01T15:00:00Z",
          modifiedAt: "2024-01-01T15:00:00Z",
          parentId: "folder-3",
        },
        {
          id: "file-6",
          name: "music.mp3",
          type: "file",
          size: 3072000,
          createdAt: "2024-01-01T16:00:00Z",
          modifiedAt: "2024-01-01T16:00:00Z",
          parentId: "folder-3",
        },
      ],
      createdAt: "2024-01-01T10:30:00Z",
      modifiedAt: "2024-01-01T16:00:00Z",
      parentId: "root",
    },
  ],
};

/**
 * Load data from localStorage or return initial data
 */
function loadData(): FolderNode {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    return initialRoot;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load data from localStorage:", error);
  }

  return initialRoot;
}

/**
 * Save data to localStorage
 */
function saveData(data: FolderNode): void {
  if (typeof window === "undefined") {
    return; // Can't save on server-side
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save data to localStorage:", error);
  }
}

// Load initial data
export let root: FolderNode = loadData();

/**
 * Refresh root data from storage (useful for client-side updates)
 */
export function refreshRoot(): void {
  root = loadData();
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
 * Get recent files (last 10 modified)
 */
export function getRecentFiles(): FileNode[] {
  const allFiles = getAllFiles();
  return allFiles
    .sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )
    .slice(0, 10);
}

/**
 * Search nodes by name
 */
export function searchNodes(query: string): Node[] {
  const results: Node[] = [];
  const searchTerm = query.toLowerCase();

  const searchRecursive = (node: Node): void => {
    if (node.name.toLowerCase().includes(searchTerm)) {
      results.push(node);
    }

    if (node.type === "folder") {
      for (const child of node.children) {
        searchRecursive(child);
      }
    }
  };

  searchRecursive(root);
  return results;
}

/**
 * Create a new file
 */
export function createFile(
  parentFolderId: string,
  fileName: string,
  fileSize: number
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
    size: fileSize,
    createdAt: now,
    modifiedAt: now,
    parentId: parentFolderId,
  };

  parent.children.push(newFile);
  parent.modifiedAt = now;

  // Save to localStorage
  saveData(root);

  return { success: true, fileId };
}

/**
 * Create a new folder
 */
export function createFolder(
  parentFolderId: string,
  folderName: string
): { success: boolean; error?: string; folderId?: string } {
  console.log("createFolder called with:", { parentFolderId, folderName });

  const parent = findFolder(parentFolderId);
  console.log("createFolder - parent found:", parent);

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

  console.log("createFolder - new folder created:", newFolder);
  console.log("createFolder - parent children now:", parent.children.length);

  // Save to localStorage
  saveData(root);

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
    return { success: false, error: "Node not found in parent folder" };
  }

  parent.children.splice(nodeIndex, 1);
  parent.modifiedAt = new Date().toISOString();

  // Save to localStorage
  saveData(root);

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

  const parent = findParentFolder(nodeId);
  if (!parent) {
    return { success: false, error: "Parent folder not found" };
  }

  // Check for duplicate names (excluding the current node)
  const siblings = parent.children.filter((child) => child.id !== nodeId);
  const uniqueValidation = validateUniqueNameInFolder(newName, {
    ...parent,
    children: siblings,
  });
  if (!uniqueValidation.isValid) {
    return { success: false, error: uniqueValidation.errors.join(", ") };
  }

  node.name = newName;
  node.modifiedAt = new Date().toISOString();
  parent.modifiedAt = node.modifiedAt;

  // Save to localStorage
  saveData(root);

  return { success: true };
}
