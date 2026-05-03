"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Car, Envelope, Phone, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      document.cookie = "carkid0_auth=true; path=/";
      setIsLoading(false);
      router.push("/auth/kyc");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface border border-border rounded-3xl p-10 shadow-2xl max-w-md w-full font-inter antialiased"
    >
      <div className="flex flex-col items-center mb-10">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
            <Car size={28} weight="bold" className="text-white" />
          </div>
        </Link>
        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Identity Verification</h1>
        <p className="text-xs font-bold text-muted mt-3 text-center uppercase tracking-widest">
          Secure access to the CarKid0 Managed Fleet.
        </p>
      </div>

      <div className="flex bg-background p-1.5 rounded-2xl mb-8 border border-border shadow-inner">
        <button
          onClick={() => setAuthMode("phone")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${
            authMode === "phone" ? "bg-primary text-white shadow-lg" : "text-muted hover:text-foreground"
          }`}
        >
          <Phone size={18} weight="bold" /> SMS
        </button>
        <button
          onClick={() => setAuthMode("email")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${
            authMode === "email" ? "bg-primary text-white shadow-lg" : "text-muted hover:text-foreground"
          }`}
        >
          <Envelope size={18} weight="bold" /> Email
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-1">
            {authMode === "phone" ? "Mobile Network ID" : "Enterprise Email Address"}
          </label>
          <div className="relative">
            {authMode === "phone" ? (
              <div className="flex group">
                <span className="flex items-center justify-center bg-background border border-r-0 border-border rounded-l-2xl px-5 text-xs font-bold text-muted group-hover:border-primary/50 transition-all h-14">
                  +234
                </span>
                <input
                  type="tel"
                  placeholder="801 234 5678"
                  className="w-full bg-background border border-border rounded-r-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted/50 h-14"
                  required
                />
              </div>
            ) : (
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted/50 h-14"
                required
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-14 text-xs"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              AUTHENTICATING...
            </span>
          ) : (
            <>
              Initialize Session <CaretRight size={18} weight="bold" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-border">
        <p className="text-[9px] font-bold text-muted text-center uppercase tracking-widest leading-loose">
          Authorized fleet personnel only. By proceeding, you agree to our <span className="text-primary cursor-pointer">Security Protocol</span> and <span className="text-primary cursor-pointer">Data Governance</span>.
        </p>
      </div>
    </motion.div>
  );
}
