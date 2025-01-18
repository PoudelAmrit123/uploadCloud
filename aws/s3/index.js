import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
  } from "@aws-sdk/client-s3";
  
  import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
   console.log(process.env.AWS_ACCESS_KEY_ID)
  
  const bucketName = "uploadherebucket";
  const s3Client = new S3Client(
      {region: "ap-south-1" , 
          credentials : {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ,
            },
          
            
          }
      
  );
  
  export async function getSignedFileUrl( keyname){
      console.log('came here in getSignedFileUrl' )
  
      const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: keyname,
        });
      // TODO: THe url is not returing error in some credentials(check )
      const uri =  await  getSignedUrl(s3Client , command , { expiresIn: 3600 })

     return uri;
  }
  
  export async function putObject(fileData, keyName) {
      console.log('came here in putObject' , keyName)
           console.log(fileData)
            try {
              await s3Client.send(
                  new PutObjectCommand({ Bucket: bucketName, Body: fileData, Key: keyName })
                );
              
                const uri = await getSignedFileUrl(keyName)
                return uri;
              
            } catch (error) {
              console.log("Error putting the file into the "  ,error)
              
            }
    
  
  
  
  }