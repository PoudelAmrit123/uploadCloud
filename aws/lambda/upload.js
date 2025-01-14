import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const typedata = event.type;
    const name = event.name;
    const size = event.size;
    const file_type = event.fileType;
    const width = event.width;
    const user_id = event.userID;
    const uri = event.uri;
    const height = event.height;
    const file_id = uuidv4();

    
    const createdAt = new Date().toISOString();  

    const fileMetadata = {
      typedata,
      name,
      size,
      file_type,
      width,
      user_id,
      uri,
      height,
      file_id,
      createdAt,  
    };

    const params = {
      TableName: "MetadataTable", 
      Item: fileMetadata,
    };

    await dynamoDB.put(params).promise();

    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Received successfully!",
        data: fileMetadata,
      }),
    };

    return response;
  } catch (error) {
    console.error("Error processing event:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "An error occurred.",
        error: error.message,
      }),
    };
  }
};
