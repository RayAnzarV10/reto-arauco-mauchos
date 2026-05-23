import Link from "next/link";

export function NavButtonsGuest() {
  return (
    <Link
      href="/dashboard"
      className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
    >
      Entrar
    </Link>
  );
}

export function HeroButtonsGuest() {
  return (
    <Link
      href="/dashboard"
      className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
    >
      Ir al Dashboard
    </Link>
  );
}
