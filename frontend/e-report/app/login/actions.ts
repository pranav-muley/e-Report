"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  const res = await fetch("http://localhost:8081/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    return { error: "Invalid credentials" };
  }

  const setCookie = res.headers.get("set-cookie");

  if (setCookie) {
    (await cookies()).set({
      name: "refreshToken",
      value: setCookie.split("refreshToken=")[1]?.split(";")[0]!,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  redirect("/dashboard");
}
