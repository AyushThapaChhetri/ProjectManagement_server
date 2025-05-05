export class BaseServerError {
  message: string;
  log?: Object;
  statusCode: number;
  constructor(statusCode: number, message: string, log?: Object) {
    this.statusCode = statusCode;
    this.message = message;
    this.log = log;
  }
}

export class BadRequestError extends BaseServerError {
  constructor(message: string, log?: Object) {
    super(400, message, log);
  }
}

export class UnauthorizedError extends BaseServerError {
  constructor(message: string, log?: Object) {
    super(401, message, log);
  }
}
export class ForbiddenError extends BaseServerError {
  constructor(message: string, log?: Object) {
    super(403, message, log);
  }
}
export class NotFoundError extends BaseServerError {
  constructor(message: string, log?: Object) {
    super(404, message, log);
  }
}
export class UserAlreadyExistError extends BaseServerError {
  constructor(message: string, log?: Object) {
    super(409, message, log);
  }
}
export class ValidationError extends BaseServerError {
  constructor(message: string, log?: Object) {
    super(422, message, log);
  }
}

export class ServerError extends BaseServerError {
  constructor(log?: Object) {
    super(500, "Something went wrong", log);
  }
}
