"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api/server-api";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  try {
    const res = await serverFetch<{ token?: string }>(
      "/login",
      {
        method: "POST",
        body: { email, password },
      }
    );

    // If backend sets cookie itself, you may not even need this
    // Otherwise set it manually if token is returned
    if (res.token) {
      (await cookies()).set("refreshToken", res.token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }

    redirect("/dashboard");
  } catch {
    return { error: "Invalid credentials" };
  }
}


export async function logoutAction() {
  try {
    await serverFetch("/logout", { method: "POST" });
  } catch {
    // backend logout failure shouldn't block client logout
  }

  (await cookies()).delete("refreshToken");
  redirect("/login");
}