import { getUserLikePosts } from "@/aws/dynamoDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest  ){

              const headersList  = req.headers
              const userId=  headersList.get('userId')
              console.log("the userid is :::: " , userId)


              try {

               const response =   await   getUserLikePosts(userId)
               return NextResponse.json({message :"Success in fetching the user posts likes " , response} , {status : 200  , statusText : "OK"})
                
              } catch (error) {
                return NextResponse.json({message :"Error fetching the user likes posts "  ,error} , {status : 500 , statusText :"NOTOK"})
                
              }

}