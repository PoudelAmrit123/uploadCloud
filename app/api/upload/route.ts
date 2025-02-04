import { NextRequest, NextResponse } from "next/server";

import { putObject } from "@/aws/s3"; 





export async function POST(req: NextRequest) {


      const formData = await req.formData()
      const filedata   = formData.get('file')
      const fileMetadataName   = formData.get('name')
      // const fileMetadataName = JSON.parse(fileMetadataNameNotFormated as string)

      console.log(':::::::::::::the file data is api call::::::::::: ' , fileMetadataName)
      

      
     
    const data =   await putObject(filedata , fileMetadataName )
       if(!data){

         return NextResponse.json({ message : "Uploaded UnsuccessFully" },{status : 500})
       } 

       return NextResponse.json({ message : "Uploaded SuccessFully" , data},{status : 200})

      
   

}
