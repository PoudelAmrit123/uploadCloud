import json
import boto3

client = boto3.client('dynamodb')
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    
    # TODO: We have implement mapping in integration method to just pass the header and params so importing like this by not using #  the usual command   i.e event.get("queryStringParameters", {})
    userId = event.get('userId')
    
    fileType = event.get('fileType')  
    
    tableName = "MetadataTable"
    indexName = "file-type-index"
    
    # return {
    #     "body" : userId ,
    #     "about" : fileType
    # }
    

    try:
        if userId and not fileType:
            # Query by userId only
            responseByUserId = client.query(
                TableName=tableName,
                KeyConditionExpression="user_id = :user_id_val",
                ExpressionAttributeValues={
                    ":user_id_val": {"S": userId},
                }
            )
            print(responseByUserId)

        if userId and fileType:
            # Query by userId and fileType prefix
            responseByUserIdAndFileType = client.query(
                TableName=tableName,
                IndexName=indexName,  # Specify the LSI name
                KeyConditionExpression="user_id = :user_id_val AND begins_with(file_type, :file_type_val)",
                ExpressionAttributeValues={
                    ":user_id_val": {"S": userId},  # Partition key
                    ":file_type_val": {"S": fileType}  # Prefix for LSI sort key
                }
            )
            print(responseByUserIdAndFileType)

        return {
            'statusCode': 200,
            'body': {
                'message': "Query executed successfully",
                'response': responseByUserIdAndFileType if fileType else responseByUserId
            }
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': "Error querying DynamoDB",
                'error': str(e)
            })
        }
