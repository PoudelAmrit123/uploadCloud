import { getAllPublicData } from "@/aws/dynamoDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest ){


    try {

        console.log("Hello from the Get all public Data APi ")

        const response = await getAllPublicData()
      return   NextResponse.json( {message : "The Public S3 Object fetch is successfull" , response }  , {status  :200 , statusText : "OK"})

    } catch (error  : any ) {

        console.log("Error while fetching the public data " , error)
        return NextResponse.json( {message : "Error while fetching the public data" , error } , {status  :400 , statusText : "Bad Request"})

    }




}