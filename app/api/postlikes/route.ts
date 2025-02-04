import { getPostsTotalLikes } from "@/aws/dynamoDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){

    try {
          const headerList = req.headers 
          const postId   = headerList.get("postID")
        const response =   await getPostsTotalLikes(postId)
          return NextResponse.json( {message : "The total likes for the post is successfully retrieved " , response} , {status : 200 , statusText : "OK"}  )
    } catch (error) {
        return NextResponse.json( {message : "Error while getting the total likes for the post " , error} , {status : 500 , statusText : "FAIL"}  )
        
    }
}