/**
 * Common utility functions for the file explorer
 */

import { Node, FolderNode } from "./types";

/**
 * Generate a unique ID with prefix
 */
export function generateId(prefix: string = "item"): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (typeof obj === "object") {
    const cloned = {} as any;
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  return obj;
}

/**
 * Check if an object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInMs = now.getTime() - target.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return target.toLocaleDateString();
}

/**
 * Sort nodes with folders first, then files
 */
export function sortNodes(nodes: Node[]): Node[] {
  return [...nodes].sort((a, b) => {
    // Folders first
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;

    // Then sort by name alphabetically
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

/**
 * Get the full path of a node
 */
export function getNodePath(
  node: Node,
  findParent: (id: string) => FolderNode | null
): string {
  const path: string[] = [node.name];
  let currentParent = node.parentId ? findParent(node.parentId) : null;

  while (currentParent && currentParent.id !== "root") {
    path.unshift(currentParent.name);
    currentParent = currentParent.parentId
      ? findParent(currentParent.parentId)
      : null;
  }

  return path.join(" / ");
}

/**
 * Check if a node is a descendant of another node
 */
export function isDescendant(
  nodeId: string,
  ancestorId: string,
  findParent: (id: string) => FolderNode | null
): boolean {
  if (nodeId === ancestorId) return false;

  let currentParent = findParent(nodeId);
  while (currentParent) {
    if (currentParent.id === ancestorId) return true;
    currentParent = currentParent.parentId
      ? findParent(currentParent.parentId)
      : null;
  }

  return false;
}

/**
 * Calculate folder size recursively
 */
export function calculateFolderSize(folder: FolderNode): number {
  let totalSize = 0;

  for (const child of folder.children) {
    if (child.type === "file") {
      totalSize += child.size || 0;
    } else {
      totalSize += calculateFolderSize(child);
    }
  }

  return totalSize;
}

/**
 * Count items in folder recursively
 */
export function countFolderItems(folder: FolderNode): {
  files: number;
  folders: number;
} {
  let files = 0;
  let folders = 0;

  for (const child of folder.children) {
    if (child.type === "file") {
      files++;
    } else {
      folders++;
      const childCounts = countFolderItems(child);
      files += childCounts.files;
      folders += childCounts.folders;
    }
  }

  return { files, folders };
}

/**
 * Validate URL/email formats
 */
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key: string, value: any): boolean => {
    if (typeof window === "undefined") return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * CSS class name utilities
 */
export function classNames(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
