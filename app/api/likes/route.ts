import { getPostsTotalLikes, uploadUserIdForThePostLike } from "@/aws/dynamoDb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
  try {

     const data =  await  req.json()
     console.log('the data is :::: ', data)
     const userId  = data.USERID
     const postId  = data.postId

     const response =  await uploadUserIdForThePostLike(postId , userId)

     return NextResponse.json({messsage : "THe post likes is successfully uploaded" , response} , {status : 200 , statusText : "LIKEOK"}  )


    
    
  } catch (error : any) {
    return NextResponse.json( {message : "Error while liking the post " , error} ,  {status : 500 , statusText : "LIKENOTOK"})
    
  }

}


export async function GET( req : NextRequest ){
  try {
              const headersList =     req.headers;
      const postId = headersList.get('postId')
      console.log("the header value is "  , postId)
              // const {postId} =  await  req.json()
     
       
       const response = await getPostsTotalLikes(postId)

       return NextResponse.json( {message : "The total likes for the post is fetched successfully" , response} , {status : 200 , statusText : "TOTALLIKEOK"}  )
    
  } catch (error) {
    return NextResponse.json( {message : "Error while fetching the total likes for the post " , error} ,  {status : 500 , statusText : "TOTALLIKEOK"})
    
  }
}