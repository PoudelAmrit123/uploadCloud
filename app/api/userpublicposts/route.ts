import { getUserPublicPosts } from "@/aws/dynamoDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest ){
    try{ 

             
       const headerList =  req.headers
       const userId =   headerList.get('userId')

      const response =   await getUserPublicPosts(userId)
        return NextResponse.json( { message : "User public data is successfully retririved " , response } , {status : 200 , statusText : "OK"} )

    }catch(error){
        return NextResponse.json({message : "An error occurred while fetching the user data" , error} , {status : 500 , statusText : "INTERNAL_SERVER_ERROR"})
    }
}