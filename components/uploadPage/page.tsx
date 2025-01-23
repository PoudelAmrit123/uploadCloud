"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Copy } from "lucide-react";
import {
  uploadToS3Action,
  uploadToApiGatewayAction,
} from "../../app/action/index";
import React from "react";

export default function UploadPage({ userid }: any) {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = React.useState<any>(null);
  const [uri, setUri] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState(null);

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

  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata" , fileMetadata.name)

    setFile(null);

   

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
    setUri(data.uri)
    console.log('the data is from upload page after coming round trip '  , data)
    console.log('the uri data is from upload page after coming round trip '  , data.uri)
    
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
    console.log("uri", uri);

    //  TODO: temporary function in here

    // TODO: Metadata including the uri and userID(demo for now ) to uploaded to POST  endpoint of the aws APIGATEWAY triggering lambda funciotn that will store the information in dynamoDb.

    const userID = userid;
  
    const completeMetada = {
      ...fileMetadata,
      uri,
      userID,
    };
    console.log("::::::complete metadata to be store ::::::", completeMetada);

    // await uploadToApiGatewayAction(completeMetada);
    if( !userid === null){
      await uploadToApiGatewayAction(completeMetada)

    }

    console.log("logged in to save the metadata information");
  };

  const handleCopyToClipboard = () => {
    if (uri) {
      navigator.clipboard.writeText(uri);
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

        {uri && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800">
              Uploaded File Link:
            </h2>
            <div className="flex items-center mt-2 bg-gray-100 p-2 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-600 truncate flex-1">{uri}</p>
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
      </div>
    </div>
  );
}
