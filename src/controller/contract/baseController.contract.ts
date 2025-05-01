import { Response } from "express";
import { Controller, Example } from "tsoa";

export class ApiResponse<T> {
  @Example(200)
  statusCode!: number;
  message!: string;
  data!: T;
}

export default class BaseController extends Controller {
  postOk<T>(params: { message: string; data: T }): ApiResponse<T> {
    return { ...params, statusCode: 200 };
  }

  // postOk(params: { message: string; data: Object }) {
  //   return { ...params, statusCode: 200 };
  // }
  // getOk(params: { message: string; data: Object }) {
  //   return { ...params, statusCode: 200 };
  // }

  getOk<T>(params: { message: string; data: T }): ApiResponse<T> {
    return { ...params, statusCode: 200 };
  }
}
