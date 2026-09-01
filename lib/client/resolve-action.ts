/**
 * Server Action calls can reject in the browser when Next.js aborts the
 * request (for example a proxy Origin / x-forwarded-host mismatch). Callers
 * must still leave loading/submitting states.
 */
export async function resolveAction<T>(
  run: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run();
  } catch {
    return fallback;
  }
}
