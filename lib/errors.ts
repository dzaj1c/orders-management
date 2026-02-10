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

/**
 * Build a single error message from Zod-style field errors for display (e.g. snackbar).
 * Falls back to defaultMessage when there are no field messages.
 */
export function formatFieldErrors(
  fieldErrors: Record<string, string[]>,
  defaultMessage = "Validation failed"
): string {
  const messages = Object.values(fieldErrors).flat().filter(Boolean);
  return messages.length > 0 ? messages.join(". ") : defaultMessage;
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
