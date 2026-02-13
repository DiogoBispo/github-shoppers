export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR"
  | "DB_ERROR";

export class AppError extends Error {
  public readonly status: number;
  public readonly code: AppErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(params: {
    status: number;
    code: AppErrorCode;
    message: string;
    details?: Record<string, unknown>;
  }) {
    super(params.message);
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}
