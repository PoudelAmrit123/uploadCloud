"use client"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import UploadPage from "@/components/uploadPage/page";

function Page() {
  const [userId, setUserId] = useState(null); // State to store userId
  const router = useRouter();

  useEffect(() => {
    
    const storedUserId = Cookies.get("userId");
    setUserId(storedUserId); 

    
    if (!storedUserId) {
      router.push('/');
    }
  }, [router]); 

  if (userId === null) {
    
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello Mr.{userId}</h1>
      <UploadPage   userid = {userId}/>
    </div>
  );
}

export default Page;
