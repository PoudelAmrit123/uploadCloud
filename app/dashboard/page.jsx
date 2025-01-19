"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import UploadPage from "@/components/uploadPage/page";
import { useSelector, useDispatch } from "react-redux";

import {
  setUserEmail,
  setUserId,
  setUserName,
} from "@/lib/features/userDetails/userSlice";

function Page() {
  const [userId, setUserIdState] = useState(null); // State to store userId
  const [username, setUsernameState] = React.useState([]);
  const [email, setEmailState] = React.useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const userIdInstant = Cookies.get("userId");

  // TODO1: Create the redux store to store the information

  useEffect(() => {
        

    const storedUserId = Cookies.get("userId");
    setUserIdState(storedUserId);
    // if(storedUserId === undefined){
    //        setUserId(storedUserId)
    // }
    // dispatch(setUserId(storedUserId))

    if (!storedUserId) {
      router.push("/");
      return;
    }
    // dispatch(setUserId(storedUserId))
  }, [router]);

  React.useEffect(() => {
    const fetchUserDetail = async () => {
      const response = await fetch(
        `http://localhost:3000/api/dashboard/${userIdInstant}`
      );
      const data = await response.json();

      setUsernameState(data.user.name);
      setEmailState(data.user.email);

      // dispatch(setUserName(data.user.name));
      // dispatch(setUserEmail(data.user.email));
    };

    fetchUserDetail();
  }, []);

  // dispatch(setUserId(userId));


  // dispatch(setUserId("1234"))
  // dispatch(setUserName("user name"))
  // dispatch(setUserEmail("email@gmail.com"))
  if (userId === null  || username === null ||  email === null) {
    return <div>Loading...</div>;
  }

  // TODO: Implement the Redux Store to store the data information
  console.log('dashboard page ::',userId)
  console.log('dashboard page ::',username)
  console.log('dashboard page ::',email)

  

  if(userId != null && username != null && email != null){
        

  return (
    <div>
      <h1>Hello Mr.{username}</h1>
      <UploadPage userid={userId} />
    </div>
  );
  }
  
 
}

export default Page;
