"use server"
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
// import  '../../envConfig'

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

console.log("key id ::", process.env.AWS_ACCESS_KEY_ID);
console.log("secret key::", process.env.AWS_SECRET_ACCESS_KEY);

const bucketName = "uploadherebucket";
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials :{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
  
});

export async function getSignedFileUrl(keyname) {
  console.log("came here in getSignedFileUrl");

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: keyname,
  });
  // TODO: THe url is not returing error in some credentials(check )
  const uri = await getSignedUrl(s3Client, command);

  return uri;
}

export async function putObject(fileData, oldkeyName) {
  console.log('the type of the file just before storing to s3 ' , fileData.type)

  const buffer = await fileData.arrayBuffer(); // Convert to ArrayBuffer
  const fileBuffer = Buffer.from(buffer); // Convert to Buffer

  // const fileBuffer = fileData
 
  const keyName = Date.now().toString() + "-" +oldkeyName  ;
 
  console.log("came here in putObject", keyName);
  console.log(fileData);
  try {
    await s3Client.send(
      new PutObjectCommand({ Bucket: bucketName, Body: fileBuffer, Key: keyName })
    );

    const uri = await getSignedFileUrl(keyName);
    return uri;
  } catch (error ) {
    console.log("Error putting the file into the s3", error.message);
  }
}

