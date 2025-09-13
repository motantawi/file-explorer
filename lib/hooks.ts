/**
 * Custom React hooks for the file explorer
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileNode, FolderNode, Node, searchNodes, findFolder } from "./data";

// Hook for managing sidebar state
export function useSidebar() {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleDesktop = useCallback(() => {
    setIsDesktopCollapsed((prev) => !prev);
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Close mobile sidebar on route change
  const router = useRouter();
  useEffect(() => {
    setIsMobileOpen(false);
  }, [router]);

  return {
    isDesktopCollapsed,
    isMobileOpen,
    toggleDesktop,
    openMobile,
    closeMobile,
  };
}

// Hook for managing search functionality
export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Node[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate async search (in real app, this might be an API call)
    setTimeout(() => {
      const searchResults = searchNodes(searchQuery);
      setResults(searchResults);
      setIsSearching(false);
    }, 150);
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsSearching(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
  };
}

// Hook for managing file/folder operations
export function useFileOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const executeOperation = useCallback(
    async (
      operation: () => Promise<{ success: boolean; error?: string }>,
      successMessage?: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();

        if (result.success) {
          router.refresh();
          if (successMessage) {
            // In a real app, you might show a toast notification here
            console.log(successMessage);
          }
          return true;
        } else {
          setError(result.error || "Operation failed");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    executeOperation,
    clearError,
  };
}

// Hook for managing modal state
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

// Hook for managing file viewer
export function useFileViewer() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const openFile = useCallback((file: FileNode) => {
    setSelectedFile(file);
  }, []);

  const closeFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return {
    selectedFile,
    openFile,
    closeFile,
    isOpen: selectedFile !== null,
  };
}

// Hook for managing drag and drop state
export function useDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter((prev) => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetDrag = useCallback(() => {
    setIsDragging(false);
    setDragCounter(0);
  }, []);

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    resetDrag,
  };
}

// Hook for managing folder navigation
export function useFolderNavigation(currentFolderId: string) {
  const [currentFolder, setCurrentFolder] = useState<FolderNode | null>(null);
  const router = useRouter();

  useEffect(() => {
    const folder = findFolder(currentFolderId);
    setCurrentFolder(folder);
  }, [currentFolderId]);

  const navigateToFolder = useCallback(
    (folderId: string) => {
      const href = folderId === "root" ? "/" : `/folder/${folderId}`;
      router.push(href);
    },
    [router]
  );

  const navigateBack = useCallback(() => {
    if (currentFolder?.parentId) {
      navigateToFolder(currentFolder.parentId);
    }
  }, [currentFolder, navigateToFolder]);

  return {
    currentFolder,
    navigateToFolder,
    navigateBack,
    canGoBack: currentFolder?.parentId !== undefined,
  };
}

// Hook for managing local storage preferences
export function usePreferences() {
  const [preferences, setPreferences] = useState(() => {
    if (typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem("fileExplorerPreferences");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const updatePreference = useCallback((key: string, value: any) => {
    setPreferences((prev: any) => {
      const updated = { ...prev, [key]: value };

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "fileExplorerPreferences",
          JSON.stringify(updated)
        );
      }

      return updated;
    });
  }, []);

  const getPreference = useCallback(
    (key: string, defaultValue?: any) => {
      return preferences[key] ?? defaultValue;
    },
    [preferences]
  );

  return {
    preferences,
    updatePreference,
    getPreference,
  };
}
