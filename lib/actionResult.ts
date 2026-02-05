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
 * Type-guard helper: on failure calls setError (and optionally setFieldErrors), returns false.
 * On success returns true and narrows result to ActionSuccess<T>.
 * Use after awaiting an action: if (!handleResult(result, setError, setFieldErrors)) return;
 */
export function handleResult<T>(
  result: ActionResult<T>,
  setError: (error: string) => void,
  setFieldErrors?: (fieldErrors: Record<string, string[]>) => void
): result is ActionSuccess<T> {
  if (result.success) return true;
  setError(result.error);
  if (setFieldErrors) setFieldErrors(result.fieldErrors ?? {});
  return false;
}

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
