import type { AppErrorCode } from "@/lib/errors";
import { isAppError, toUserMessage } from "@/lib/errors";

export type ActionSuccess<T> = { success: true; data: T };
export type ActionFailure = {
  success: false;
  error: string;
  code?: AppErrorCode;
  fieldErrors?: Record<string, string[]>;
};
export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

/**
 * Wraps an async service call: on success returns { success: true, data };
 * on throw catches, converts AppError (or unknown) to { success: false, error, code?, fieldErrors? }.
 * Use in server actions so the frontend never needs try/catch.
 */
export async function withResult<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    if (isAppError(err)) {
      return {
        success: false,
        error: err.message,
        code: err.code,
        ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
      };
    }
    return {
      success: false,
      error: toUserMessage(err),
      code: "INTERNAL",
    };
  }
}
