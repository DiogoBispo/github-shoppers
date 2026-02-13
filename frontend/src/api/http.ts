export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

type HttpMethod = "GET" | "POST";

export async function api<T>(
  path: string,
  options?: { method?: HttpMethod; body?: unknown; auth?: boolean },
): Promise<T> {
  const method = options?.method ?? "GET";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      data?.error?.message ?? data?.message ?? `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}
