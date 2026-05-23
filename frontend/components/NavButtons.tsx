"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function NavButtonsGuest() {
  return (
    <>
      <SignInButton mode="modal">
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Iniciar sesión
        </button>
      </SignInButton>
      <Link
        href="/sign-up"
        className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
      >
        Registrarse
      </Link>
    </>
  );
}

export function HeroButtonsGuest() {
  return (
    <>
      <Link
        href="/sign-up"
        className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
      >
        Comenzar gratis
      </Link>
      <SignInButton mode="modal">
        <button className="border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors">
          Ver demo
        </button>
      </SignInButton>
    </>
  );
}
