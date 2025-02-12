"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { TrendingUp, UploadCloudIcon } from "lucide-react";

          // const baseURL = process.env.NODE_ENV === "production" 
       //   //          ?  "http://cloud.matrixcloud.tech:3000" : "http://localhost:3000";
          // console.log(baseURL)

export default function HeaderComponent() {
  const pathname = usePathname();
  const handleLogoutButton = async ()=>{
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }

  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Application Name */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          <div>
            Uploadnow <UploadCloudIcon className="ml-2 h-6 w-6" />
          </div>
          {/* Uploadhere */}
        </Link>

        {/* Navigation Buttons */}
        <nav className="flex items-center space-x-4">
          {pathname === "/" ? (
            <Link href="/signin">
              <Button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
                type="button"
              >
                Login
              </Button>
            </Link>
          ) : pathname === "/dashboard" ? (
            <>

            {/* Explre Page*/ }
            <Link
            href="/dashboard/explore"
            >
              <Button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
                  type="button"
                >
                  <TrendingUp />Explore
                </Button>
            </Link>
              {/* Activity Button */}
              <Link href="/dashboard/activity">
                <Button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
                  type="button"
                >
                  Activity
                </Button>
              </Link>

              
              {/* Logout Button */}
              <Button
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                onClick={()=> handleLogoutButton()}
                type="button"
              >
                Logout
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
