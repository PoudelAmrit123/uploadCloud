
import ConnectToDatabase from "@/database";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export  async function GET(req : NextRequest , {params} : any ){
 console.log("the request is coming from the dashboard api");
  
  const { id } = params;

if(!id){
    return NextResponse.json({message : "The userId is not present in the request header"}, {status : 200 , statusText : "CHECK"})
}

  try {
    await ConnectToDatabase()
    const user = await User.findById(id);
    if(!user){
      return NextResponse.json({message : "No user found for the given userId"}, {status : 404})
    }
    return NextResponse.json({user} , {status : 200})  
    
  } catch (error : any) {
    console.log("error message :"  , error.message)
    return NextResponse.json({message : "Error while fetching the data from the database  "} , {status : 400})
    
  }

 }