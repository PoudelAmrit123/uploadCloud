
import { NextRequest, NextResponse } from "next/server";

export function GET(req : NextRequest){
 console.log("the request is coming from the dashboard api");

const userId = req.headers.get('userId')
if(!userId){
    return NextResponse.json({message : "The userId is not present in the request header"}, {status : 200 , statusText : "CHECK"})
}

 return NextResponse.json({message : "The api request is coming fine for the userID" , userId} , {status : 200})
}