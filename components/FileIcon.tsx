import { getFileExtension } from "@/lib/data";

interface FileIconProps {
  filename: string;
  className?: string;
}

export function FileIcon({ filename, className = "w-5 h-5" }: FileIconProps) {
  const extension = getFileExtension(filename);

  const getFileTypeColor = (ext: string) => {
    switch (ext) {
      case "pdf":
        return "text-red-600";
      case "doc":
      case "docx":
        return "text-blue-600";
      case "xls":
      case "xlsx":
        return "text-green-600";
      case "ppt":
      case "pptx":
        return "text-orange-600";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return "text-purple-600";
      case "mp4":
      case "avi":
      case "mov":
        return "text-pink-600";
      case "mp3":
      case "wav":
      case "flac":
        return "text-indigo-600";
      case "txt":
      case "md":
        return "text-gray-600";
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return "text-yellow-600";
      case "html":
      case "css":
        return "text-blue-500";
      case "json":
        return "text-green-500";
      case "zip":
      case "rar":
      case "7z":
        return "text-gray-800";
      default:
        return "text-gray-500";
    }
  };

  const getFileTypeIcon = (ext: string) => {
    switch (ext) {
      case "pdf":
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case "doc":
      case "docx":
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
          </svg>
        );
      case "mp4":
      case "avi":
      case "mov":
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
          </svg>
        );
      case "mp3":
      case "wav":
      case "flac":
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
          </svg>
        );
      case "zip":
      case "rar":
      case "7z":
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,17H12V15H14M14,13H12V11H14M14,9H12V7H14M14,5H12V3H14M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z" />
          </svg>
        );
      default:
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
    }
  };

  return (
    <div className={getFileTypeColor(extension)}>
      {getFileTypeIcon(extension)}
    </div>
  );
}
