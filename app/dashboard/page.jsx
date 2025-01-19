"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import UploadPage from "@/components/uploadPage/page";


function Page() {
  const [userId, setUserId] = useState(null); // State to store userId
  const [username, setUsername] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const router = useRouter();

   const userIdInstant = Cookies.get("userId");

      // TODO1: Create the redux store to store the information 
      
  useEffect(() => {
    const storedUserId = Cookies.get("userId");
    setUserId(storedUserId);

    if (!storedUserId) {
      router.push("/");
    }
  }, [router]);

  React.useEffect(() => {
    const fetchUserDetail = async () => {
      const response = await fetch(
        `http://localhost:3000/api/dashboard/${userIdInstant}`
      );
      const data = await response.json();

      setUsername(data.user.name);
      setEmail(data.user.email);
    };

    fetchUserDetail();
  }, []);

  if (userId === null) {
    return <div>Loading...</div>;
  }

  // TODO: Implement the Redux Store to store the data information

  return (
    <div>
      <h1>Hello Mr.{username}</h1>
      <UploadPage userid={userId} />
    </div>
  );
}

export default Page;
