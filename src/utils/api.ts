export const isSuccessStatus = (status?: number): boolean =>
  typeof status === 'number' && status >= 200 && status < 300;

// Generated client may throw on 2xx with no body (e.g., 202/204) — handle as success.
export const extractErrorResponse = (error: unknown): Response | undefined => {
  if (error instanceof Response) return error;
  if ((error as any)?.value instanceof Response) return (error as any).value;
  if (Array.isArray(error) && error[0]?.value instanceof Response) return error[0].value;
  return undefined;
};
