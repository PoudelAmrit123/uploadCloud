"use server";
import {
  DynamoDBClient,
  DeleteItemCommand,
  UpdateItemCommand,
  ScanCommand,
  PutItemCommand,
  QueryCommand,

} from "@aws-sdk/client-dynamodb";
import { revalidatePath } from "next/cache";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://cloud.matrixcloud.tech:3000"
    : "http://localhost:3000";

const tableName = "MetadataTable";
const postTableName = "postLikes"
const dbClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function deleteFromDynamoDB(file_id, user_id) {
  try {
    const input = {
      TableName: tableName,
      Key: {
        user_id: {
          S: user_id,
        },
        file_id: {
          S: file_id,
        },
      },
    };

    const command = new DeleteItemCommand(input);
    const response = await dbClient.send(command);
    console.log("Item deleted successfully:", response);

    return response;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}
                                                                                                                                       


export async function updateFromDynamoDB(newFileName, fileID, userID) {



    console.log('the updateFromDynamoDB')
  try {
    const input = {
      TableName: tableName,
      Key: {
        user_id: {
          S: userID,
        },
        file_id: {
          S: fileID,
        },
      },

      UpdateExpression: "SET #name = :newFileName",
      ExpressionAttributeNames: {
        "#name": "name",  
      },
      ExpressionAttributeValues: {
        ":newFileName": { S: newFileName },
      },
      ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(input);
    const response = await dbClient.send(command);

    

    return response;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}


export async function getAllPublicData(){

  try {
    const input = {
     
      TableName: tableName,
      FilterExpression: "is_public = :public" , 
      ExpressionAttributeValues: { 
        ":public": { S : "public"},
      },
      
     }
  
      const command = new ScanCommand(input)
     const response = await dbClient.send(command)

     console.log("the response from the dynamoDb is :::::" , response)
  
  
    return response
  } catch (error) {
    console.log("Error getting all public data:" , error)
    throw error;
    
  }
   
}

//*-------------------------------------------------**********************-------------------------------------
//*-------------------------------------------------**********************-------------------------------------
//*-------------------------------------------------**********************-------------------------------------
//*-------------------------------------------------**********************-------------------------------------




//*Changing the logic as the sort_key should be provided in updateItems Command 
export async function  updateItemWithUserIdAndIncrementLikes(postId  , userId){
  console.log("the uploading post is " , postId)
  console.log("the uploading post userID is " , userId)

 try {
  const Input = {
    TableName : postTableName ,
    Key : {
      file_id : { S : postId},
      
    },
    UpdateExpression: "SET user_ids =  list_append(if_not_exists(user_ids, :empty_set)  , :user_id) , likes_count = if_not_exists(likes_count , :zero) + :increment ",
    ExpressionAttributeValues : {
     ":empty_set" : {L : []},
     ":user_id" : { L : [{S : userId}]},
     ":zero" : { N  : "0"},
     ":increment" : {N : "1" },
    } , 
   ConditionExpression: "NOT contains(user_ids, :user_id)",
   ReturnValues: "UPDATED_NEW",
  

 }
 const command = new UpdateItemCommand(Input)
 const respone =dbClient.send(command)
 return respone
  
 } catch (error) {

  console.log("error updating the likes " , error)
  
 }

 
// 
}

//* User like the post 

export async function uploadUserIdForThePostLike(postid , userId){
  try {
  //  console.log("before uploading to the postLikeTable postid" , postid)
  //  console.log("before uploading to the postLikeTable userID" , userId)
  //  return

      const Input = {
        TableName : postTableName ,
        Item : {
          file_id : {
            S : postid
           },
           user_ids : {
            S : userId
           },
           liked_at: { 
            S: new Date().toISOString() 
          }
        } , 
        ConditionExpression : "attribute_not_exists(user_id)"
      } 

      


      const command  = new PutItemCommand(Input)
      const respone  = await dbClient.send(command)
      return respone
    
  } catch (error) {
    console.log("error while uploading the user Post likes information " , error)
    return 
    
  }
}

//*user unlike the post 

export async function  uploadUserIdForThePostUnlike(postId  , userId){
  try {
    const input = {
      TableName : postTableName ,
      Key : {
        file_id : { S : postId},
        user_ids : { S : userId},
      } , 
      
    }
    const command = new DeleteItemCommand(input)
    const respone = dbClient.send(command)
    return respone
    
  } catch (error) {
    console.log("error while uploading the user likes informtaino " , error)
    
  }


}

export async function  getPostsTotalLikes( postid ){
  try {
   const input = {
      TableName : postTableName ,
      // Key : {
      //   file_id : { S : postid},
      // },
      KeyConditionExpression: "file_id = :postId",
      ExpressionAttributeValues: {
        ":postId" : {S : postid}
      },
      ProjectionExpression: "likes_count"
    }
    const command = new QueryCommand(input)
    const response = await dbClient.send(command)
    console.log("the total likes for the post are " , response)
    return response
    
  } catch (error) {
    console.log("error while getting the likes count " , error)
    
  }

}


//*Get the user likes posts 
export async function getUserLikePosts(userId){
  try {

    const input = {
      TableName : postTableName,
      
      IndexName : "UserLikesIndex",
      
      KeyConditionExpression : "user_ids = :userId",
      ExpressionAttributeValues : {
        ":userId" : { S : userId}
      }

    }
    const command  = new QueryCommand(input)
    const responce = dbClient.send(command)
    return responce

  }catch (error){
    console.log("error while getting the users  likes posts " , error)

  }
}


//* get user public s3 object 
export async function getUserPublicPosts(userId) {
  try {
    const input = {
      TableName: tableName,
      KeyConditionExpression: "user_id = :userId",
      FilterExpression: "is_public = :public",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
        ":public": { S: "public" },
      },
    };
    const command = new QueryCommand(input);
    const response = await dbClient.send(command);
    return response;
  } catch (error) {
    console.log("Error getting public posts:", error);
    throw error;
  }
}


