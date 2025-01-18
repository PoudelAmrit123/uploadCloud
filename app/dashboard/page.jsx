"use client"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import UploadPage from "@/components/uploadPage/page";

function Page() {
  const [userId, setUserId] = useState(null); // State to store userId
  const router = useRouter();

  useEffect(() => {
    // Simulating async loading of userId (e.g., from cookies or an API)
    const storedUserId = Cookies.get("userId");
    setUserId(storedUserId); // Update state with the userId from cookies

    // If userId is not found, redirect to home
    if (!storedUserId) {
      router.push('/');
    }
  }, [router]); // Run once after component mounts

  if (userId === null) {
    // Optionally, you can render a loading spinner or message until userId is set
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello Mr.{userId}</h1>
      <UploadPage />
    </div>
  );
}

export default Page;
