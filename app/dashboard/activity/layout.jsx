"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button"; 
import { Skeleton } from "@/components/ui/skeleton";
// import Loading from '@/app/dashboard/activity/loading'
function Layout({ children }) {
  return (

    <Suspense fallback={<Skeleton className="w-[100px] h-[20px] rounded-full"/>}>

    <div className="min-h-screen bg-gray-100 p-6">
      {/* Return to Dashboard Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all text-lg">
            Return to Dashboard
          </Button>
        </Link>
      </div>

      {/* Page Content */}
      <div className="bg-white rounded-lg shadow-md p-6">{children}</div>
    </div>
     </Suspense>
  );
}

export default Layout;
