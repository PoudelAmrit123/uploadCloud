import { uploadUserIdForThePostUnlike } from "@/aws/dynamoDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest ){

    try {

        const {USERID , postId} = await req.json()
        await uploadUserIdForThePostUnlike(postId , USERID)

        return NextResponse.json({message : "The post is unliked successfully"} , {status : 200 , statusText : "UNLIKEOK"})
    } catch (error) {
        return NextResponse.json({message : "An error occured while unliking  the post " , error} , {status : 500 , statusText : "UNLIKE_NOTOK"})
        
    }

}