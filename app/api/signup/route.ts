import ConnectToDatabase from "@/database";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: any = await req.json();
  console.log(body )
  console.log(body);

  if (body.email === '' || body.password === '' || body.name === '') {
    return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
  }

  try {
    await ConnectToDatabase();

     const isUniqueUser = await User.findOne({ email: body.email });
    if (isUniqueUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const user = new User({
        name: body.name,
        email: body.email,
        password : body.password
    });
    await user.save(); 

   

    return NextResponse.json({ message: "Signup successful", user }, { status: 200  , statusText : "OK"});
  } catch (error: any) {
    console.error(error); 
    return NextResponse.json({ message: "Error while creating the user", error: error.message }, { status: 500 });
  }
}
