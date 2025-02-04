"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

function Page() {
  const USERID = Cookies.get("userId");
  const params = useParams();
  const userid = params?.userid; // Use optional chaining
  const testImage = "https://placehold.co/600x400?text=Hello+World";
  const testVideo = "https://placehold.co/600x400?text=Hello+World";
  const [publicFiles, setPublicFiles] = useState([]);
  const [LikedPost, setLikedPosts] = useState(new Set());
   const [postLikesCount, setPostLikesCount] = useState({});

  useEffect(() => {
    console.log("Fetching public posts for user:", userid);

    const fetchThatUserPublicData = async () => {
      try {
        const response = await axios.get("/api/userpublicposts", {
          headers: {
            userId: userid,
          },
        })
        // .then(response => (
          
        //   // console.log(response)

        //     response.data.response.Items.forEach( async(file )=> {
        //       const postId = file.file_id.S ;
        //      const likedResponse  =   await axios.get("/api/postlikes" , {
        //         headers : {
        //           "fileID" : postId 
        //         }
        //       })

        //       setLikedPosts( (prev)=> (
        //         {
        //           ...prev,
        //           [postId] : likedResponse.data.response.Count
        //         }

        //       ))

        //     })
        // ))

        if (response.status === 200) {
          console.log("User public posts:", response.data.response.Items);
          setPublicFiles(response.data.response.Items);
        }

        const likesResponse = await axios.get("/api/userpostslike", {
          headers: {
            userId: USERID,
          },
        });

        const likedPostId = new Set(
          likesResponse.data.response.Items.map((file) => file.file_id.S)
        );
        setLikedPosts(likedPostId);
      } catch (error) {
        console.error("Error fetching user public posts:", error);
      }
    };

    fetchThatUserPublicData();
  }, [userid, USERID]);

  const handlePostLike = async (postId) => {
    const data = {
      postId,
      USERID,
    };
    const response = await axios.post("/api/likes", data);
    if (response.status === 200) {
      setLikedPosts((prev) => new Set([...prev, postId]));
    }
  };

  const handlePostUnLike = async (postId) => {
    const data = {
      postId,
      USERID,
    };
    const response = await axios.post("/api/unlike", data);
    if (response.status === 200) {
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold font-serif mb-4">
        Public Posts by User {userid}
      </h1>

      {publicFiles.length === 0 ? (
        <p className="text-gray-500 text-center">No public uploads yet...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicFiles.map((file) => (
            <div
              key={file.file_id.S}
              className="border rounded-lg p-3 shadow-md bg-white"
            >
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                {file.file_type?.S.startsWith("image/") ? (
                  <Image
                    src={testImage}
                    alt={file.name.S}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : file.file_type?.S.startsWith("video/") ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src={testVideo}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                    Unsupported File
                  </div>
                )}
              </div>

              <div className="mt-2">
                <p className="text-lg font-semibold">{file.name.S}</p>
                <p className="text-sm text-gray-500">
                  <Link href={`/dashboard/explore/${file.user_id.S}`}>
                    Uploaded by:{" "}
                    <span className="font-medium">{file.user_id.S}</span>
                  </Link>
                </p>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(file.createdAt.S))} ago
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                {!LikedPost.has(file.file_id.S) ? (
                  <Button
                    onClick={() => handlePostLike(file.file_id.S)}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5 text-gray-500" />
                    <span>Like</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePostUnLike(file.file_id.S)}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open(file.uri.S, "_blank")}
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;