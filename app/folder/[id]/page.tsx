import { findFolder } from "@/lib/data";
import { CreateFolderButton } from "@/components/CreateFolderButton";
import { CreateFileButton } from "@/components/CreateFileButton";
import { FolderList } from "@/components/FolderList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackButton } from "@/components/BackButton";
import { SearchBar } from "@/components/SearchBar";
import { DragDropUpload } from "@/components/DragDropUpload";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default function FolderPage({ params }: Props) {
  const folder = findFolder(params.id);

  if (!folder) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Folder not found
        </h2>
        <p className="text-gray-600 mb-4">
          The folder you're looking for doesn't exist or may have been deleted.
        </p>
        <p className="text-sm text-gray-500 mb-4">Folder ID: {params.id}</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z"
            />
          </svg>
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <DragDropUpload folderId={params.id}>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="max-w-md">
          <SearchBar />
        </div>

        <Breadcrumb currentFolderId={params.id} />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <BackButton currentFolderId={params.id} />
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📁</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {folder.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {folder.children.length} items • Drop files here to upload
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <CreateFolderButton folderId={params.id} />
            <CreateFileButton folderId={params.id} />
          </div>
        </div>

        <FolderList nodes={folder.children} />
      </div>
    </DragDropUpload>
  );
}
