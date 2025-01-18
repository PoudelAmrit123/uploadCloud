"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import axios from "axios";

export default function HeaderComponent() {
  const pathname = usePathname();
 

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Application Name */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Uploadhere
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
              {/* Activity Button */}
              <Link href="/activity">
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
                onClick={async () => {
                  try {
                      await axios.post("/api/logout")
                    .then( (responce)=>{
                         console.log(responce.data)
                        
                    })
                    const router = useRouter()
                    router.push('/')
                    console.log('from the axios logout ' , responce.ok);

                    

                  } catch (error) {
                    console.error("Error logging out:", error);
                  }
                }}
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
