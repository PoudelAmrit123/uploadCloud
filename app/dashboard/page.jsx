"use client"
import { useEffect , useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import React from "react";
import { useRouter } from "next/navigation";

   function  page() {
    const router = useRouter()

    

  const userId = Cookies.get("userId");
  console.log('from the dasboard ',userId)
  if(!userId){
    router.push('/')
  }
    return (

    <div> Dashboard page</div>
  )
}

export default page