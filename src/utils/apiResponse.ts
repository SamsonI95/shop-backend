export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

export function ok<T>(message: string, data?: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, message, data, meta };
}

export function fail(message: string, meta?: Record<string, unknown>): ApiResponse<null> {
  return { success: false, message, data: null, meta };
}
