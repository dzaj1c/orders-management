/**
 * Structured errors for the app. Repositories and services throw AppError;
 * API and actions catch and map to HTTP / result shape.
 */

export const APP_ERROR_CODES = [
  "VALIDATION",
  "NOT_FOUND",
  "CONFLICT",
  "UNAUTHORIZED",
  "INTERNAL",
] as const;

export type AppErrorCode = (typeof APP_ERROR_CODES)[number];

export interface AppError {
  code: AppErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export function appError(
  code: AppErrorCode,
  message: string,
  fieldErrors?: Record<string, string[]>
): AppError {
  return { code, message, ...(fieldErrors && { fieldErrors }) };
}

export function isAppError(x: unknown): x is AppError {
  return (
    typeof x === "object" &&
    x !== null &&
    "code" in x &&
    "message" in x &&
    typeof (x as AppError).message === "string" &&
    APP_ERROR_CODES.includes((x as AppError).code)
  );
}

export function toUserMessage(err: unknown): string {
  if (isAppError(err)) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
