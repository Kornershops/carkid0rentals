"use client";

import { useState, Suspense } from "react";
import { Envelope, Phone, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { useStore } from "@/store/use-store";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthenticated, setRedirectTo } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      setRedirectTo(redirectUrl);
    }

    setTimeout(() => {
      document.cookie = "carkid0_auth=true; path=/";
      setAuthenticated(true);
      setIsLoading(false);
      router.push("/auth/kyc");
    }, 1500);
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=900&fit=crop&q=80"
          alt="Premium vehicle"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 to-gray-900/50" />
        <div className="relative z-10 p-12 max-w-md">
          <Logo />
          <h2 className="text-4xl font-bold tracking-tight text-white mt-8 mb-4 leading-tight">
            Drive First Class.<br />
            <span className="text-blue-400">Pay Economy.</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Rent premium vehicles across 7 cities in Nigeria. From gig-economy sedans to luxury SUVs.
          </p>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="w-full lg:max-w-[480px] flex flex-col justify-center px-8 md:px-12 py-12">
        <div className="mb-8">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Sign in</h1>
          <p className="text-sm text-gray-600">
            Enter your phone number or email to continue.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6 border border-gray-200">
          {[
            { id: "phone" as const, icon: <Phone size={16} weight="bold" />, label: "Phone" },
            { id: "email" as const, icon: <Envelope size={16} weight="bold" />, label: "Email" },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setAuthMode(m.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                authMode === m.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {authMode === "phone" ? "Phone Number" : "Email Address"}
            </label>
            {authMode === "phone" ? (
              <div className="flex">
                <span className="flex items-center px-4 text-sm font-semibold bg-gray-100 border border-gray-200 border-r-0 rounded-l-lg text-gray-500">
                  +234
                </span>
                <input
                  type="tel"
                  placeholder="801 234 5678"
                  required
                  className="flex-1 h-11 px-4 text-sm font-medium bg-white border border-gray-200 rounded-r-lg text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            ) : (
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full h-11 px-4 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gray-900 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Sending code...
              </span>
            ) : (
              <>Continue <CaretRight size={16} weight="bold" /></>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 leading-relaxed mt-4">
          By continuing, you agree to our{' '}
          <Link href="/legal" className="text-gray-900 font-medium hover:underline">Terms of Service</Link> and{' '}
          <Link href="/legal" className="text-gray-900 font-medium hover:underline">Privacy Policy</Link>.
        </p>

        <div className="mt-auto pt-8">
          <p className="text-sm text-gray-500">
            New to CarKid0?{' '}
            <Link href="/auth/login" className="text-gray-900 font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
