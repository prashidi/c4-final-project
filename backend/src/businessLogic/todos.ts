import "source-map-support/register";
import * as uuid from "uuid";
import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";

import { TodoItem } from "../models/TodoItem";
import { UploadUrl } from "../models/UploadUrl";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { GenerateUploadUrlRequest } from "../requests/GenerateUploadUrlRequest";
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodosAccess } from "../dataLayer/todosAccess";
import { getUserId } from "../lambda/utils";
import { createLogger } from "../utils/logger";
import * as AWSXRay from "aws-xray-sdk";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("generateUploadUrl");

const todoBucket = process.env.TODOS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new XAWS.S3({
  signatureVersion: "v4"
});

const todosAccess = new TodosAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  console.log("Business logic - get all todos");
  const items = await todosAccess.getAllTodos(userId);
  console.log(items);
  return items;
}

export async function createTodo(
  event: APIGatewayProxyEvent,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4();

  const userId = getUserId(event);
  const createdAt = new Date(Date.now()).toISOString();

  const todoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: `https://${todoBucket}.s3.amazonaws.com/${todoId}`,
    ...createTodoRequest
  };

  await todosAccess.createTodo(todoItem);

  return todoItem;
}

export async function generateUploadUrl(
  event: APIGatewayProxyEvent,
  generateUploadUrlRequest: GenerateUploadUrlRequest
): Promise<UploadUrl> {
  const todoId = event.pathParameters.todoId;
  const attachmentId = uuid.v4();
  logger.info("Generating upload URL:", {
    todoId: todoId,
    attachmentId: attachmentId
  });

  const uploadUrl = s3.getSignedUrl("putObject", {
    Bucket: todoBucket,
    Key: attachmentId,
    Expires: urlExpiration,
    ...generateUploadUrlRequest
  });

  await todosAccess.updateTodoAttachmentUrl(todoId, attachmentId);

  return uploadUrl;
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> { 

  await todosAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {

  const updatedToto = {
    todoId,
    ... updateTodoRequest
  }

  await todosAccess.updateTodo(todoId, updatedToto)

  return updatedToto
}

