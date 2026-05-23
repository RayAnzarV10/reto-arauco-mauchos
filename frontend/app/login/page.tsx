"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logos */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Image src="/mauchos_logo.png" alt="Mauchos" width={80} height={20} className="brightness-0 invert" />
          <div className="w-px h-5 bg-white/20" />
          <Image src="/Logo-Arauco.png" alt="ARAUCO" width={100} height={30} className="brightness-0 invert" />
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 flex flex-col gap-6">
          <div>
            <p className="text-[11px] tracking-[0.25em] font-semibold text-gray-500 uppercase mb-1">
              Acceso restringido
            </p>
            <h1 className="text-xl font-bold text-white">Ingresa la contraseña</h1>
          </div>

          <form action={action} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              autoFocus
              className="w-full rounded-xl bg-white/[0.06] border border-white/[0.10] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500 transition-colors"
            />

            {state?.error && (
              <p className="text-xs text-red-400">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 transition-colors px-4 py-3 text-sm font-semibold text-white"
            >
              {pending ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
