import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";

import { GenerateUploadUrlRequest } from "../../requests/GenerateUploadUrlRequest";

import { generateUploadUrl } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const url: GenerateUploadUrlRequest = JSON.parse(event.body);
  
  
  const uploadUrl = await generateUploadUrl(event, url);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  };
};
