import { createSlice } from "@reduxjs/toolkit";


const userInitalState = {
    userId : "this" ,
    name : "" ,
    email : "" ,

}

 const userSlice = createSlice({
    name : 'userSlice' ,
    initialState :  userInitalState ,
    reducers : {
     setUserId : (state , action) => {
         state.userId = action.payload.userId
        
     },

     setUserName : (state , action)=>{
        console.log("the requst is comign to setusername redux function")
        state.name = action.payload.name
     },
     setUserEmail : (state , action)=>{
        state.email = action.payload.email
     }

    }
})

export  const {setUserEmail , setUserId , setUserName} = userSlice.actions
export  default userSlice.reducer