"use server";

import { cookies } from "next/headers";

const BASE_URL = "https://e-report-t9xh.onrender.com";

export async function serverFetch<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
  } = {}
): Promise<T> {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
