// "use server"

import axios from "axios";
import { putObject } from "../../aws/s3/index";



        const baseURL = process.env.NODE_ENV === "production" 
        ? "http://cloud.matrixcloud.tech:3000" : "http://localhost:3000";
console.log(baseURL)

export async function uploadToS3Action(  formData: any, fileMetadata: any) {

  
  const file = formData.get("file") as File;
  console.log('this is what i want' ,file)
  console.log(
    "before upload to s3 action in the same function",
    fileMetadata.name
  );

  const fileNameJson = JSON.stringify(fileMetadata);
  console.log("came just before the putObject fucntion :::::: in the sme function")

  const uri = await putObject(file, fileMetadata.name);
  console.log('the uri value is ' , uri)
  return uri;
}



export async function uploadToApiGatewayAction(fileMetata: any ) {
  console.log('the file metadata to be uploaded using the api gateway is ' , fileMetata )

 const apiEndpoint = "https://u3rwrbvl76.execute-api.ap-south-1.amazonaws.com/dev/upload"
//  const fileMetadataSend = JSON.stringify(fileMetata)

 console.log('the fileMetadata that is send to the apigateway is : '  , fileMetata , {
  headers: { "Content-Type": "application/json" },
 })
   const response =  axios.post(apiEndpoint  , fileMetata)

  
   response.then( (response)=> ( console.log('the api endpoint is successfully called ', response.data))).catch( (error : any)=>( console.log(error)))

  //  console.log('the api endpoint response is:::451 '   , response)
  
}



export async function loginAction(formData: any) {
  try {
    const response = await axios.post(`${baseURL}/api/signin`, formData , {
      withCredentials : true,
    });
    // console.log("user action response from axios", response);
    return response;
  } catch (error: any) {
    console.error("Error in signinAction:", error.message);
    return;
  }
}

export async function SignupAction(formData: any) {

  try {
    const response = await axios.post(`${baseURL}/api/signup`, formData);
    // console.log("user action response from axios", response);
    //  return response
  } catch (error: any) {
    console.error("Error in signupAction:", error.message);
    return;
  }

  // console.log("the singup action is done");
}

export async function getUserDetailsAction(userId: string) {

  console.log("getUserDetails action page "  , userId)
  if(userId){

  
  try {
    console.log("coming here in unusal fashion")
     const response =  await axios.post(`${baseURL}/api/dashboard/${userId}` , userId)
     return response.data
    // return user
  } catch (error: any) {
    console.error("Error in getUserDetailsAction:", error.message);
    return;
  }
}
}


export async function updateUserDetailsAction() {
  //  await deleteSession()
   

}
