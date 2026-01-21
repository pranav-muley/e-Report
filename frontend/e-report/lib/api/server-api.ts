
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = "https://e-report-t9xh.onrender.com";

async function refreshAccessToken() {
  try {
    const res = await fetch(`${BASE_URL}/refresh/token`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Refresh token expired");
    }

    const data = await res.json();

    (await cookies()).set("accessToken", data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return data.accessToken;
  } catch (error) {
    // Clear cookies and redirect to login
    (await cookies()).delete("accessToken");
    redirect("/login");
  }
}

export async function serverFetch<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
  } = {}
): Promise<T> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  const makeRequest = (token?: string) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      credentials: "include",
    });

  let res = await makeRequest(accessToken);

  if (res.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      res = await makeRequest(accessToken);
    } catch (error) {
      // refreshAccessToken will redirect to login
      throw error;
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
}