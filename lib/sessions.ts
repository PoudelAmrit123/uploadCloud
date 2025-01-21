import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET 
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload : any){

   return  new SignJWT(payload).setProtectedHeader({alg : 'HS256'}).setIssuedAt().setExpirationTime('60m')
.sign(encodedKey)

}

export async function decrypt(session : any){
    const {payload}  = await jwtVerify(session, encodedKey, { algorithms: ['HS256'] })

    return payload 
}



export async function CreateSession(userId : string){
 const expiresAt = new Date(Date.now() + 60*10*   60 *1000)
//  const expiresAt = new Date(Date.now() + 7 )

 
     const cookieStore = await cookies()
       const  session = await encrypt({userId , expiresAt})
     cookieStore.set('session' , session , {
        domain : ".matrixcloud.tech",
        httpOnly : true ,
        expires : expiresAt ,
        secure : false,
        sameSite : "lax"
     })
}

export async function clearSession() {
  const cookieStore =  await cookies();
  cookieStore.delete('session');
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
  }

  export async function deleteuserIdSession() {
    const cookieStore = await cookies()
    cookieStore.delete('userId')
  }


export async function CreateUserIdSession(userId : any){

  const expiresAt = new Date(Date.now() + 60* 10 * 60 * 1000)
  const cookieStore = await cookies()
  cookieStore.set('userId', userId, {
    
    expires: expiresAt,
    
  });

}