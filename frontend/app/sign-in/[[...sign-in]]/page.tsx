import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel izquierdo — formulario */}
      <div className="flex flex-col px-12 py-6">
        <Link href="/" className="flex items-center gap-3 mb-auto w-fit">
          <Image
            src="/Logo_del_ITESM.svg"
            alt="ITESM"
            width={36}
            height={36}
            className="brightness-0"
          />
          <div className="w-px h-5 bg-gray-300" />
          <Image
            src="/Logo-Arauco.png"
            alt="Arauco"
            width={110}
            height={34}
          />
        </Link>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
          </div>
        </div>
      </div>

      {/* Panel derecho — video */}
      <div className="relative hidden lg:block overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/background 2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/50" />
        <div className="absolute inset-0 flex items-end justify-end p-10">
          <p className="text-white text-2xl font-medium text-right leading-snug max-w-xs">
            Operando con <strong>inteligencia</strong>,<br />
            construyendo el <strong>futuro forestal</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
