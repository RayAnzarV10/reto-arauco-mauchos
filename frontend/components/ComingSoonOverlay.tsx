export function ComingSoonOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Contenido original — oculto pero preservado en el DOM */}
      <div className="pointer-events-none select-none opacity-30 blur-sm">
        {children}
      </div>

      {/* Sábana */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-lg px-10 py-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <p className="text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
              En desarrollo
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900">Próximamente</p>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Este módulo estará disponible en la siguiente entrega. El contenido ya está listo.
          </p>
        </div>
      </div>
    </div>
  );
}
