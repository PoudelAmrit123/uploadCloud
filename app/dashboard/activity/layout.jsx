"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

function Layout({ children }) {
  return (
    <Suspense fallback={<Skeleton className="w-[100px] h-[20px] rounded-full" />}>
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        {/* Navigation Buttons */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-6">
          {/* Return to Dashboard Button */}
          <Link href="/dashboard">
            <Button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg">
              Return to Dashboard
            </Button>
          </Link>

          {/* Refresh Button */}
          <a href="/dashboard/activity">
            <Button className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg shadow-md hover:bg-gray-300 hover:text-black transition-all text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Refresh
            </Button>
          </a>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-5xl">
          {children}
        </div>
      </div>
    </Suspense>
  );
}

export default Layout;
