"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = "https://e-report-t9xh.onrender.com"
// const BASE_URL = "localhost:8099";


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
    (await cookies()).delete("accessToken");
    redirect("/login");
  }
}

// JSON fetch
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
      throw error;
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
}

// Multipart fetch (for file uploads)
export async function serverFetchMultipart<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  // Debug: Log what we're sending
  console.log("=== serverFetchMultipart Debug ===");
  console.log("Endpoint:", endpoint);
  console.log("FormData contents:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}:`, {
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      console.log(`  ${key}:`, value);
    }
  }

  const makeRequest = (token?: string) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData,
      cache: "no-store",
      credentials: "include",
    });

  let res = await makeRequest(accessToken);

  console.log("Response status:", res.status);
  
  if (res.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      res = await makeRequest(accessToken);
      console.log("Response status after refresh:", res.status);
    } catch (error) {
      throw error;
    }
  }

  if (!res.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      console.error("API Error Response:", errorData);
    } catch (e) {
      console.error("Failed to parse error response:", e);
    }
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  const responseData = await res.json();
  console.log("Response data:", responseData);
  return responseData;
}