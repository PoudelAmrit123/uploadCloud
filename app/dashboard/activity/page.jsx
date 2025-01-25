"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Image, Video, Edit3, Trash2, Search } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import {
  setUserEmail,
  setUserId,
  setUserName,
  setFiles,
} from "@/lib/features/userDetails/userSlice";

import { useDebounce } from "use-debounce";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { deleteObject } from "@/aws/s3";

import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

// import { revalidateTag } from "next/cache";
import { deleteFromDynamoDB, updateFromDynamoDB } from "../../../aws/dynamoDb/index";

const formatDaysOld = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} old`;
};
const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://cloud.matrixcloud.tech:3000"
    : "http://localhost:3000";
console.log(baseURL);

function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fileMetadata, setFileMetadata] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editedValue , setEditedValue] = useState(null)
  const [isDialogOpen, setShowDialog] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchUserDetail = async () => {
      const response = await fetch(
        `${baseURL}/api/dashboard/${userId}`
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   method: "GET",
        //   credentials: "include", // Include the cookie in the request
        // }
      );
      const data = await response.json();
      setUsername(data.user.name);
      setEmail(data.user.email);
    };

    const fetchUserMetadata = async () => {
      setLoading(true);
      const response = await axios.get(
        `https://u3rwrbvl76.execute-api.ap-south-1.amazonaws.com/dev/download?userID=${userId}`
      );
      setFileMetadata(response.data?.body?.response.Items || []);
      setLoading(false);
    };

    fetchUserMetadata();
    fetchUserDetail();
  }, [userId]);

  // File filter logic

  const [debounceQuery] = useDebounce(searchQuery, 300);

  const filteredFiles = fileMetadata.filter((file) => {
    const fileName = (file?.name?.S || "").toLowerCase();
    const fileType = (file?.file_type?.S || "").toLowerCase();
    return (
      fileName.includes(debounceQuery.toLowerCase()) ||
      fileType.includes(debounceQuery.toLowerCase())
    );
  });

 

  if (loading) {
    return <div className="text-center mt-10">Loading The Activity...</div>;
  }

  if (fileMetadata.length === 0) {
    return <div className="text-center mt-10">No Activity Available</div>;
  }

  const handleFileAction = (url, action) => {};


















  const handleEditOnClick = (fileId , fileName) => {
    setEditId(fileId);
    setEditedValue(fileName)
    setEditDialogOpen(true);

    console.log("Edit file with ID:", fileId);
    console.log("Edit file user is ,", userId);
  };

  const handleEditedLogic =  async ()=>{
    //TODO:call the dynampDb sdk to update the vlaue right 

    const newFileName = editedValue
    const fileid = editId

          console.log(newFileName)
          console.log(fileid)
          console.log(userId)

          
     const response =  await  updateFromDynamoDB(newFileName , fileid , userId)
     console.log(response)


  }






















  const handleDeleteonClick = (fileId) => {
    setDeleteId(fileId);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    console.log("Delete file with ID:", deleteId);
    console.log("the user id is :", userId);
    console.log(fileMetadata.file_type);
    console.log(fileMetadata[0].key_name.S);
    const keyName = fileMetadata[0].key_name.S;

    //UserId--> partitions key
    //deleteId --->file_id sortkey
    // file_type =---> secondary inddex

    console.log(deleteId, userId);

    await deleteFromDynamoDB(deleteId, userId);
    console.log("DynamoDB metadata deleted successfully.");

    // TODO: User ID is passed for revalidating the path
    await deleteObject(keyName, userId);
    console.log("S3 object deleted successfully.");
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold font-serif">
            Activity of {username}
          </h1>
          <p className="text-sm text-gray-600">Email: {email}</p>
        </div>
        <p className="text-lg font-thin font-serif">
          Total Files: {fileMetadata?.length}
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by file name(abc.png) or type (e.g.image,video)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        {filteredFiles.map((file, index) => {
          const fileUrl = file?.uri;
          const fileType = file?.file_type?.S;
          const fileName = file?.name?.S;
          const fileSize = parseInt(file?.size?.N) / 1024 / 1024;
          const createdAt = formatDaysOld(file?.createdAt?.S);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* File Icon and Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex justify-center items-center bg-gray-100 rounded-lg">
                  {fileType.startsWith("image/") ? (
                    <Image className="text-blue-500" />
                  ) : (
                    <Video className="text-green-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{fileName}</h2>
                  <p className="text-sm text-gray-600">
                    {fileSize.toFixed(2)} MB
                  </p>
                  <p className="text-sm text-gray-500">{createdAt}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                {(fileType?.startsWith("image/") ||
                  fileType?.startsWith("video/")) && (
                  <button
                    onClick={() => handleFileAction(fileUrl, "preview")}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Preview
                  </button>
                )}
                <button
                  onClick={() => handleFileAction(fileUrl, "download")}
                  className="text-green-500 hover:text-green-600"
                >
                  Download
                </button>

                {/* Edit Button */}

                <Dialog>
                  <DialogTrigger asChild>

                    <button
                      onClick={() => handleEditOnClick(file?.file_id?.S , fileName)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit File Name</DialogTitle>
                          <DialogDescription>
                          Make changes to your File name. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={editedValue}  onChange={ (e)=>  setEditedValue(e.target.value)}className="col-span-3" />
          </div>          


                        <DialogFooter>
                          <DialogClose>
                            <Button variant="ghost">Cancel</Button>
                            
                    <Button   type="submit"  onClick={handleEditedLogic} >Save changes</Button>
                          </DialogClose>
        </DialogFooter>

                      </DialogContent>









                </Dialog>

                {/* Delete BTn*/}

                <AlertDialog open={isDialogOpen} onOpenChange={setShowDialog}>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => handleDeleteonClick(file?.file_id?.S)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your fileMetada and remove your data from cloud.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setShowDialog(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
