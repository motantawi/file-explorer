import { findFolder } from "@/lib/data";
import { CreateFolderButton } from "@/components/CreateFolderButton";
import { CreateFileButton } from "@/components/CreateFileButton";
import { FolderList } from "@/components/FolderList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { DragDropUpload } from "@/components/DragDropUpload";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function Home() {
  const folder = findFolder("root");

  if (!folder) {
    return <div>Error: Root folder not found</div>;
  }

  return (
    <DragDropUpload folderId="root">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="max-w-md">
          <SearchBar />
        </div>

        <Breadcrumb currentFolderId="root" />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
          <div className="flex gap-2">
            <CreateFolderButton folderId="root" />
            <CreateFileButton folderId="root" />
          </div>
        </div>

        <FolderList nodes={folder.children} />
      </div>
    </DragDropUpload>
  );
}
