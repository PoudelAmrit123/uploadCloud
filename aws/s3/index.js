"use server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";














import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";

console.log("key id ::", process.env.AWS_ACCESS_KEY_ID);
console.log("secret key::", process.env.AWS_SECRET_ACCESS_KEY);

const baseURL = process.env.NODE_ENV === "production" 
        ? "http://cloud.matrixcloud.tech:3000" : "http://localhost:3000";

const bucketName = "uploadherebucket";
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


export async function getSignedFileUrl(keyname) {
  console.log("came here in getSignedFileUrl");

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: keyname,
  });
  // TODO: THe url is not returing error in some credentials(check )
  const uri = await getSignedUrl(s3Client, command );

  return uri;
}

export async function putObject(fileData, oldkeyName) {
  console.log("the type of the file just before storing to s3 ", fileData.type);

  const buffer = await fileData.arrayBuffer(); // Convert to ArrayBuffer
  const fileBuffer = Buffer.from(buffer); // Convert to Buffer

  // const fileBuffer = fileData

  const keyName = Date.now().toString() + "-" + oldkeyName;

  console.log("came here in putObject", keyName);
  console.log(fileData);
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Body: fileBuffer,
        Key: keyName,
      })
    );

    const uri = await getSignedFileUrl(keyName);
    const data = {
      uri,
      keyName,
    };
    console.log("the final data from put object is :", data);
    return data;
  } catch (error) {
    console.log("Error putting the file into the s3", error.message);
  }
}



export async function deleteObject(keyname , userId) {
  console.log("came here in deleteObject");

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "uploadherebucket",
        Key: keyname,
      })
    );
    const response = {
      success: true,
    };


     revalidatePath(`${baseURL}/dashboard/activity`)

    return response;
  } catch (error) {
    console.log("Error deleting the object :", error);
    const response = {
      success: false,
      error: error.message,
    };
    return response;
  }
}

