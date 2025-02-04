"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Copy } from "lucide-react";
import {
  uploadToS3Action,
  uploadToApiGatewayAction,
} from "../../app/action/index";
import React from "react";
import { useRouter } from "next/navigation";

export default function UploadPage({ userid }: any) {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = React.useState<any>(null);
  const [uriState, setUriState] = React.useState<string | null>(null);
  const [visibility, setVisibility] = React.useState("private");
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showloginPrompt , setShowLoginPrompt] = React.useState(false)
  const router = useRouter(); 
  // const [keyName, setKeyName] = React.useState<string | null>(null);

  {
    error && <h1>`Error ${error}`</h1>;
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);

    if (selectedFile) {
      const fileType = selectedFile.type;

      if (fileType.startsWith("image/")) {
        // Handle image metadata extraction
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const metadata = {
              type: "image",
              name: selectedFile.name,
              size: selectedFile.size,
              fileType: selectedFile.type,
              width: img.width,
              height: img.height,
            };
            setFileMetadata(metadata);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(selectedFile);
      } else if (fileType.startsWith("video/")) {
        // Handle video metadata extraction
        const metadata = {
          type: "video",
          name: selectedFile.name,
          size: selectedFile.size,
          fileType: selectedFile.type,
        };
        setFileMetadata(metadata);
      } else {
        alert("Unsupported file type. Please upload an image or video.");
        setFile(null);
        setFileMetadata(null);
      }
    }
  };


  const handleLoginRedirect =  ()=>{

    router.push('/signin')
    setShowLoginPrompt(false)
    return 

  }

  const handleCancelPrompt = ()=>{
    setShowLoginPrompt(false)
    return
  }

  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) return;

    if(visibility === "public" && !userid){
    
      // router.push('/signin')
      setShowLoginPrompt(true);
      return ;
    }

    
    const formData = new FormData();
    formData.append("file", file);
    console.log('::::::::::::::::::::file metadata  name before api call:::::::::::::::::::: ' , fileMetadata.name)
    formData.append("name" , fileMetadata.name)

    // setFile(null);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

   

    // Upload to S3

   try {

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const {uri , keyName} = data.data
    
    // setKeyName(keyName)
       console.log('the uri value from the response',uri)
       console.log('the keyname value from response',keyName)

       const userID = userid;
       console.log("fileMetadata:", fileMetadata);

  
       const completeMetada = {
         ...fileMetadata,
         uri,
         userID,
         keyName,
         visibility

       };

       console.log("uri", uriState);

   

   
    console.log("::::::complete metadata to be store ::::::", completeMetada);
    setUriState(uri)

    await uploadToApiGatewayAction(completeMetada);

    // TODO: Dispatch the fileMetadata to the redux 
    
   } catch (error) {
    console.error('Error uploading file:', error);
    return 
    
   }
   // TODO: Changed the upload logic from server Action to API 
    //  const uploadedUri: any = await uploadToS3Action(formData, fileMetadata);
    // setUri(uploadedUri);
    // if(uri === null){
    //   console.log("returing here ")
    //   return
    // }
   
  };

  const handleCopyToClipboard = () => {
    if (uriState) {
      navigator.clipboard.writeText(uriState);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Upload and Share
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Upload an image or video file here...
        </p>
        {/* encType="multipart/form-data" */}
        <form onSubmit={handleSubmit}   className="space-y-4">
          <label className="block text-gray-700 font-medium">
            Select a file
          </label>
          <div className="relative">
            <Input
              type="file"
              placeholder="Upload a file"
              accept=".jpg,.jpeg,.png,.mp4"
              className="file:bg-gray-200 file:font-medium file:cursor-pointer file:border-none file:rounded-md file:mr-4"
              onChange={handleFileChange}
            />
          </div>


             { /*DropDown*/}

            <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-50"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={!file}
            className={`w-full ${
              !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}
          >
            <CloudUpload className="mr-2" />
            {!file ? "Select a file to upload" : "Upload File"}
          </Button>
        </form>

        {uriState && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800">
              Uploaded File Link:
            </h2>
            <div className="flex items-center mt-2 bg-gray-100 p-2 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-600 truncate flex-1">{uriState}</p>
              <Button
                onClick={handleCopyToClipboard}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1"
              >
                <Copy className="mr-1" size={16} />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}

         {/* Modal for login prompt */}

{showloginPrompt && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md max-w-sm w-full shadow-lg">
              <h2 className="text-xl font-bold mb-4">Log in to Upload  file Publicly</h2>
              <p className="text-gray-600 mb-4">You need to be logged in to upload file publicly.</p>
              <div className="flex justify-between">
                <Button
                  onClick={handleLoginRedirect}
                  className="bg-blue-500 text-white"
                >
                  Log in
                </Button>
                <Button
                  onClick={handleCancelPrompt}
                  className="bg-gray-500 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
