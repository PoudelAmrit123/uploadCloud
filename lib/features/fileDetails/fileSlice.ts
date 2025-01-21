import {createSlice} from "@reduxjs/toolkit"
import { stat } from "fs"

 const fileIntialState = {
    size : null ,
    user_id : null ,
    file_id : null ,
    file_type : null ,
    createdAt : null ,
    name : null ,
    typedata : null ,
    width : null ,
    height: null ,
    uri: null ,    
 }

  const fileSlice = createSlice({
    name : 'fileSlice' ,
    reducers : {
        setFileDetails : (state , action )=>{
            state.size = action.payload.size
            state.user_id = action.payload.user_id
            state.file_id = action.payload.file_id
            state.file_type = action.payload.file_type
            state.createdAt = action.payload.createdAt
            state.name = action.payload.name
            state.typedata = action.payload.typedata
            state.width = action.payload.width
            state.height = action.payload.height
            state.uri = action.payload.uri

        }
    },
    initialState : fileIntialState
  })


export const {setFileDetails} =  fileSlice.actions

export default fileSlice.reducer