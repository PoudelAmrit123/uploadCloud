import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/sessions";
import { cookies } from "next/headers";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
export async function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  
  console.log('next url ', req.nextUrl.pathname);
  console.log('url', req.url);

  // Prevent middleware reprocessing for static assets and specific paths like `/dashboard` or `/api/dashboard`
  if (
    // req.nextUrl.pathname.startsWith("/_next/") || // Static assets like JS, CSS, etc.
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/api/dashboard")
  ) {
    return NextResponse.next();
  }

  // If no session, allow the user to proceed without redirection
  if (!session) {
    console.log('no session find so deleting the userId cookies ')
    const cookiesStore = await cookies();
    cookiesStore.delete("userId");
    return NextResponse.next();
  }

  try {
    const { userId, expiresAt }: any = await decrypt(session);

    // Check if the session has expired
    if (new Date(expiresAt) <= new Date()) {
      console.error("Session expired");
      const cookiesStore = await cookies();
      cookiesStore.delete("userId");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("Middleware userID:", userId);

    // Redirect to `/dashboard` if not already heading there
    if (!req.nextUrl.pathname.startsWith("/dashboard")) {
      const response = NextResponse.redirect(new URL("/dashboard", req.url));

      // Add `userId` to the response cookies
      // response.cookies.set("userId", userId, {
      //   // httpOnly: true,
      //   // secure: true,
      //   expires: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
      // });

      return response;
    }
  } catch (error) {
    console.error("Invalid or expired session:", error);
  }

  // If decryption fails, redirect to the home page
  return NextResponse.redirect(new URL("/", req.url));
}




 // TODO: Now if the userID exist then create a new respose that will be at /api/dashboard where the userId is passed as the header and from that api we get the userId value and find out all the user information from the local database and also trigger the apigateway of the aws so that lambda funcion will get the userID value and query the request to the mongodb where we have list our metadata along with the file url soted and userId (local). the userId is that we get from the header is used to query the dynamoBD(aws) to find all the informton about  that user upload activity and lambda function returned the resposen throught that api gatwway and we display that informatin on dashboard/myactivity section



 //TODO: Changing the way as passing the userId in the header and redireatin to /api/dasboard api work but it is not redirected to /dashboard page so instaed of getting the vlaue (userId) from api to frontend we will first get the userID from the cookies itself ( we have to set the userId as cookies again ) and get it extracted from the frontend and usev this userId to make the post api call to our other funciton
