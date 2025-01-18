import { deleteSession, deleteuserIdSession } from "@/lib/sessions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";

export  async function  POST(req : NextRequest){
    console.log("request is coming to the logout api server ")
    const cookiesStore = await  cookies()
    const isSession =  cookiesStore.get('session')
    
    if(!isSession){
        return NextResponse.json({message : "No session found to delete"}, {status : 401 , statusText : "Unauthorized"})
    }
    await deleteSession()

    
    return NextResponse.json({message : "Logout is sucessfull"} , {status : 200 , statusText : "ok"})
}