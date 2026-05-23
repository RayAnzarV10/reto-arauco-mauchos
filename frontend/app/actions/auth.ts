"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(_: unknown, formData: FormData) {
  const password = formData.get("password");

  if (password === "Mauchos123") {
    const jar = await cookies();
    jar.set("mauchos-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });
    redirect("/dashboard");
  }

  return { error: "Contraseña incorrecta" };
}
