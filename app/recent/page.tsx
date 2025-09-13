import { getRecentFiles, findParentFolder } from "@/lib/data";
import { FileIcon } from "@/components/FileIcon";
import { formatFileSize } from "@/lib/data";
import Link from "next/link";

export default function RecentPage() {
  const recentFiles = getRecentFiles(20);

  if (recentFiles.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500">No recent files found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modified
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentFiles.map((file, index) => {
              const parent = findParentFolder(file.id);
              return (
                <tr
                  key={file.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileIcon filename={file.name} className="w-8 h-8 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {file.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parent ? (
                      <Link
                        href={
                          parent.id === "root" ? "/" : `/folder/${parent.id}`
                        }
                        className="hover:text-blue-600 hover:underline"
                      >
                        {parent.name}
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.size ? formatFileSize(file.size) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.modifiedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {recentFiles.map((file) => {
          const parent = findParentFolder(file.id);
          return (
            <div
              key={file.id}
              className="bg-white rounded-lg border p-4 space-y-2"
            >
              <div className="flex items-center space-x-3">
                <FileIcon filename={file.name} className="w-8 h-8" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {file.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {file.size ? formatFileSize(file.size) : "Unknown size"}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Location:{" "}
                  {parent ? (
                    <Link
                      href={parent.id === "root" ? "/" : `/folder/${parent.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {parent.name}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </span>
                <span>{new Date(file.modifiedAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
