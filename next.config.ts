import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["placehold.co"], 
  },
  // env : {
  //   NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === "production" ? "http://3.109.153.57" : "http://localhost:3000",
  // }

  env : {
    NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === "production" ?  "https://cloud.matrixcloud.tech/" : "http://localhost:3000" ,
    MONGO_URI: process.env.NODE_ENV === "production" ? "mongodb://mongo:27017" : "mongodb+srv://username:usernamepassword@cluster0.eh8a7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",


  },
  
};

export default nextConfig;
