"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function page() {

    const userId = Cookies.get('userId')
    const [userPostLikeMetadata , setUserPostLikeMetadata] = useState([])

    useEffect( ()=>{

        const fetchUserLikesDetails = async()=>{

          const response =    await axios.get('/api/userpostslike' , {
                headers : {
                    "userId" :  userId
                }
            })
            console.log("the response of likes is " , response)
            setUserPostLikeMetadata(response.data.response.Items)

        }


        fetchUserLikesDetails()} , [] )
  return (
    <>
    <div>Welcome To USER LIKE POSTS </div>
    <div>Working on IT  </div>
    
    
    </>
  )
}

export default page