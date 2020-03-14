import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);

  const itemId = uuid.v4();

  const parsedBody = JSON.parse(event.body);

  const newTodo = {
    todoId: itemId,
    ...parsedBody
  };

  await docClient
    .put({
      TableName: todosTable,
      Item: newTodo
    })
    .promise();

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      newTodo
    })
  };
};
