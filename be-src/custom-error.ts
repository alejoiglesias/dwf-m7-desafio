export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handleError(error: any, message: string) {
  if (!(error instanceof CustomError)) {
    throw new CustomError(message, 500);
  }
  throw error;
}
