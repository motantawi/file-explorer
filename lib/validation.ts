/**
 * Validation utilities for file explorer
 */

import { Node, FolderNode } from "./types";

// Validation constants
export const VALIDATION_RULES = {
  MAX_NAME_LENGTH: 255,
  MIN_NAME_LENGTH: 1,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  FORBIDDEN_CHARACTERS: /[<>:"/\\|?*\x00-\x1f]/,
  RESERVED_NAMES: [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ] as string[],
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate file or folder name
 */
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];

  // Check if name is provided
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
    return { isValid: false, errors };
  }

  const trimmedName = name.trim();

  // Check length
  if (trimmedName.length < VALIDATION_RULES.MIN_NAME_LENGTH) {
    errors.push("Name is too short");
  }

  if (trimmedName.length > VALIDATION_RULES.MAX_NAME_LENGTH) {
    errors.push(
      `Name is too long (max ${VALIDATION_RULES.MAX_NAME_LENGTH} characters)`
    );
  }

  // Check forbidden characters
  if (VALIDATION_RULES.FORBIDDEN_CHARACTERS.test(trimmedName)) {
    errors.push('Name contains forbidden characters: < > : " / \\ | ? *');
  }

  // Check reserved names (Windows)
  const nameUpper = trimmedName.toUpperCase().split(".")[0];
  if (VALIDATION_RULES.RESERVED_NAMES.includes(nameUpper)) {
    errors.push(`"${trimmedName}" is a reserved name`);
  }

  // Check for leading/trailing periods or spaces
  if (trimmedName.startsWith(".") || trimmedName.endsWith(".")) {
    errors.push("Name cannot start or end with a period");
  }

  if (trimmedName.startsWith(" ") || trimmedName.endsWith(" ")) {
    errors.push("Name cannot start or end with a space");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): ValidationResult {
  const errors: string[] = [];

  if (size > VALIDATION_RULES.MAX_FILE_SIZE) {
    errors.push(
      `File is too large (max ${
        VALIDATION_RULES.MAX_FILE_SIZE / (1024 * 1024)
      }MB)`
    );
  }

  if (size < 0) {
    errors.push("Invalid file size");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if name already exists in parent folder
 */
export function validateUniqueNameInFolder(
  name: string,
  parentFolder: FolderNode,
  excludeId?: string
): ValidationResult {
  const errors: string[] = [];

  const existingNode = parentFolder.children.find(
    (child) =>
      child.name.toLowerCase() === name.toLowerCase() && child.id !== excludeId
  );

  if (existingNode) {
    errors.push(`A ${existingNode.type} with this name already exists`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate node structure
 */
export function validateNodeStructure(node: Node): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!node.id) errors.push("Node ID is required");
  if (!node.name) errors.push("Node name is required");
  if (!node.type) errors.push("Node type is required");
  if (!node.createdAt) errors.push("Creation date is required");
  if (!node.modifiedAt) errors.push("Modified date is required");

  // Validate name
  const nameValidation = validateName(node.name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }

  // Validate dates
  try {
    new Date(node.createdAt);
  } catch {
    errors.push("Invalid creation date format");
  }

  try {
    new Date(node.modifiedAt);
  } catch {
    errors.push("Invalid modification date format");
  }

  // Type-specific validation
  if (node.type === "file" && node.size !== undefined) {
    const sizeValidation = validateFileSize(node.size);
    if (!sizeValidation.isValid) {
      errors.push(...sizeValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
