import { NextResponse } from "next/server";
import {
  isAppError,
  toUserMessage,
  type AppErrorCode,
} from "@/lib/errors";

const CODE_TO_STATUS: Record<AppErrorCode, number> = {
  VALIDATION: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  INTERNAL: 500,
};

/**
 * Turn any thrown value into a consistent JSON error response.
 * Use in API route catch blocks or via withApiErrorHandler.
 */
export function handleApiError(err: unknown): NextResponse {
  console.error("[API error]", err);

  const status = isAppError(err) ? CODE_TO_STATUS[err.code] : 500;
  const message = toUserMessage(err);
  const body: {
    error: string;
    code?: AppErrorCode;
    fieldErrors?: Record<string, string[]>;
  } = { error: message };

  if (isAppError(err)) {
    body.code = err.code;
    if (err.fieldErrors) body.fieldErrors = err.fieldErrors;
  }

  return NextResponse.json(body, { status });
}

type RouteContext = { params?: Promise<Record<string, string>> };
type RouteHandler = (
  request: Request,
  context?: RouteContext
) => Promise<NextResponse>;

/**
 * Wraps an API route handler so any thrown error is caught and returned
 * via handleApiError. Avoids try/catch in each route.
 */
export function withApiErrorHandler(fn: RouteHandler): RouteHandler {
  return async (request: Request, context?: RouteContext) => {
    try {
      return await fn(request, context);
    } catch (err) {
      return handleApiError(err);
    }
  };
}
