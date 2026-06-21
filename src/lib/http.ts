export class ExternalCallError extends Error {
  constructor(
    message: string,
    public status?: number,
    public providerMessage?: string
  ) {
    super(message);
  }
}

export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new ExternalCallError(
        `External call failed with HTTP ${response.status}`,
        response.status,
        body.slice(0, 500)
      );
    }
    return response;
  } catch (error) {
    if (error instanceof ExternalCallError) throw error;
    if ((error as Error).name === "AbortError") {
      throw new ExternalCallError(`External call timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
