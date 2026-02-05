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
