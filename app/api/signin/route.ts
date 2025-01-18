import ConnectToDatabase from "@/database";
import { CreateSession  ,CreateUserIdSession,clearSession } from "@/lib/sessions";
import { User } from "@/models/user.model";

import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
  
  const data = await req.json();


  
  const email = data.email;
  try {
    await ConnectToDatabase();
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { message: "The email is not registered" },
        { status: 400, statusText: "Bad Request" }
      );
    }

    
    //   TODO: Need to encrypt the user password and validat ( moongoose method can be createed for encryption and verify)

    if (user.password != data.password) {
      return NextResponse.json(
        { message: "The password is not correct" },
        { status: 400, statusText: "Bad Request" }
      );
    }
    // TODO: Create the session cookies

     const userId = user?._id
     console.log(userId)

           
    
           await clearSession()
           console.log("coming here in login api to create the session from userId ")
           await CreateSession(userId)   //Created the cookies 
           console.log("coming here in login api to create the userIdsession from userId ")
      await CreateUserIdSession(userId)




    return NextResponse.json(
      { message: "The login is successfull", user },
      { status: 200, statusText: "SUCCESS" }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Somthing went wrong while connecting to database for login" },
      { status: 400, statusText: "Bad Request" }
    );
  }
}
