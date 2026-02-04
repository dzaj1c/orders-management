/**
 * Shared utilities, helpers, and cross-cutting code.
 */
export { supabaseClient } from "./supabaseClient";
export {
  appError,
  isAppError,
  toUserMessage,
  APP_ERROR_CODES,
  type AppError,
  type AppErrorCode,
} from "./errors";

