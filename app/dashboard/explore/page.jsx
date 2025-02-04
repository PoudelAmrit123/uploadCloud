"use client";

import  ExplorePageComponent from '@/components/explore/page'

// import React, { useEffect, useState } from "react";

// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Heart, Download } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import Link from "next/link";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useParams } from "next/navigation";

function ExplorePage() {
  
  return (
    <ExplorePageComponent />
  )

  // const USERID = Cookies.get("userId");

  // const [LikedPost, setLikedPosts] = React.useState(new Set());
  // const testImage = "https://placehold.co/600x400?text=Hello+World";
  // const testVideo = "https://placehold.co/600x400?text=Hello+World";
  // const [publicFileMetadata, setPublicFileMetadata] = useState([]);

  // useEffect(() => {
  //   console.log("Fetching the data from the public S3 object...");

  //   const fetchPublicMetadata = async () => {
  //     try {
  //      // const response = await getAllPublicData();



  //        await  axios.get("/api/publicdata").then( response => (
         

  //         setPublicFileMetadata(response.data.response.Items)
          
          
  //       )
  //       ).catch( err => console.log(err))


  //       await axios.get('/api/userpostslike' , {
  //         headers :{
  //           "userId"  : USERID
  //         }
  //       }).then( (response )=> {
  //         console.log("the post the user likes are " , response)
  //         console.log("the likes response is  " , response.data.response.Items)
          

  //         const likedPostId = new Set( response.data.response.Items.map( (postId)=> postId.file_id.S) )
  //         setLikedPosts(likedPostId)
  //         console.log("the liked post " , LikedPost)
          
          
  //       })
       
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchPublicMetadata();
  // }, [USERID]);

  // const handlePostLike = async (postId) => {
  //   console.log("the post likes is ", postId);
  //   console.log("the userId that post likes is  " , USERID);
    
  //   // await  updateItemWithUserIdAndIncrementLikes(postId , userId)
  // //  await  uploadUserIdForThePostLike(postId , userId )
  

  //  const data = {
  //   postId ,
  //   USERID
  //  }
  //   const response =  await axios.post("/api/likes" , data)

      
  //     console.log(response.status)
  //     if(response.status === 200){
  //         setLikedPosts( (prev)=> ( new Set(prev).add(postId)))
  //     }

    
  // };

  // const handlePostUnLike = async (postId) => {
  //   console.log("the post likes is ", postId);
  //   // console.log("the userId that post likes is  ", userId);
   
     
  //    const data = {
  //     postId ,
  //     USERID
  //    }

  //     const response =   await axios.post("/api/unlike" ,  data)
  //   if (  response.status === 200 ) {
  //     setLikedPosts( (prev)=> {

  //       const newLikedPosts = new Set(prev);
  //       newLikedPosts.delete(postId);
  //       return newLikedPosts;



  //     })
  //   }
     
     
        
    
   
    
  // };
  // return (
  //   <div className="max-w-5xl mx-auto p-4">
  //     <h1 className="text-2xl font-semibold font-serif mb-4">
  //       Explore Public Uploads
  //     </h1>

  //     {publicFileMetadata.length === 0 ? (
  //       <p className="text-gray-500 text-center">No public uploads yet...</p>
  //     ) : (
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //         {publicFileMetadata.map((file, index) => (
  //           <div
  //             key={index}
  //             className="border rounded-lg p-3 shadow-md bg-white"
  //           >
  //             {/* Display Image or Video */}
  //             <div className="relative w-full h-48 rounded-lg overflow-hidden">
  //               {file.file_type.S.startsWith("image/") ? (
  //                 <Image
  //                   src={testImage}
  //                   // src={file.uri.S}
  //                   alt={file.name.S}
  //                   // alt={file.name.S}
  //                   layout="fill"
  //                   objectFit="cover"
  //                 />
  //               ) : file.file_type.S.startsWith("video/") ? (
  //                 <video
  //                   className="w-full h-full object-cover"
  //                   controls
  //                   // src={file.uri.S}
  //                   src={testVideo}
  //                 />
  //               ) : (
  //                 <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
  //                   Unsupported File
  //                 </div>
  //               )}
  //             </div>

  //             {/* File Details */}
  //             <div className="mt-2">
  //               <p className="text-lg font-semibold">{file.name.S}</p>
  //               <p className="text-sm text-gray-500">
  //                 {/* <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL/api/user?=${file.user_id.S}}`}> */}
  //                 {/* <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/explore/userId=${file.user_id.S}`}> */}
  //                 <Link href={`/dashboard/explore/${file.user_id.S}`}>
  //                   Uploaded by:{" "}
  //                   <span className="font-medium">{file.user_id.S}</span>
  //                 </Link>
  //               </p>
  //               <p className="text-sm text-gray-400">
  //                 {formatDistanceToNow(new Date(file.createdAt.S))} ago
  //               </p>
  //             </div>

  //             {/* Actions */}
  //             <div className="flex items-center justify-between mt-3">
  //               {!LikedPost.has(file.file_id.S) ? (
  //                 <Button
  //                   onClick={() =>
  //                     handlePostLike(file.file_id.S)
  //                   }
  //                   variant="ghost"
  //                   className="flex items-center gap-2"
  //                 >
  //                   <Heart className="w-5 h-5 text-gray-500" />
  //                   <span>Like</span>
  //                 </Button>
  //               ) : (
  //                 <Button
  //                   onClick={() =>
  //                     handlePostUnLike(file.file_id.S)
  //                   }
  //                   variant="ghost"
  //                   className="flex items-center gap-2"
  //                 >
  //                   <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    
  //                 </Button>
  //               )}

  //               <Button
  //                 variant="outline"
  //                 className="flex items-center gap-2"
  //                 onClick={() => window.open(file.uri.S, "_blank")}
  //               >
  //                 <Download className="w-5 h-5" />
  //                 <span>Download</span>
  //               </Button>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

 
}

export default ExplorePage;


