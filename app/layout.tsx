"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import MobileSidebar from "@/components/MobileSidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>File Explorer - Professional File Management</title>
        <meta
          name="description"
          content="A modern, professional file explorer built with Next.js, TypeScript, and Tailwind CSS"
        />
      </head>
      <body className="h-full bg-gray-50">
        <div className="flex h-full">
          {/* Desktop Sidebar */}
          <CollapsibleSidebar
            isCollapsed={isDesktopSidebarCollapsed}
            onToggle={() =>
              setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
            }
          />

          {/* Mobile Sidebar */}
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Mobile Header */}
            <div className="md:hidden">
              <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <div className="text-xl mr-2">📁</div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    File Explorer
                  </h1>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
