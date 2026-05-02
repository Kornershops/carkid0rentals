"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Car, Mail, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call & set mock cookie
    setTimeout(() => {
      document.cookie = "carkid0_auth=true; path=/";
      setIsLoading(false);
      // Route to KYC next step after successful login
      router.push("/auth/kyc");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Car className="text-white w-6 h-6" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted mt-2 text-center">
          Sign in to access your dashboard and manage rentals.
        </p>
      </div>

      <div className="flex bg-surface/50 p-1 rounded-xl mb-6 border border-border">
        <button
          onClick={() => setAuthMode("phone")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
            authMode === "phone" ? "bg-background shadow text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <Phone className="w-4 h-4" /> Phone
        </button>
        <button
          onClick={() => setAuthMode("email")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
            authMode === "email" ? "bg-background shadow text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <Mail className="w-4 h-4" /> Email
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
            {authMode === "phone" ? "Phone Number" : "Email Address"}
          </label>
          <div className="relative">
            {authMode === "phone" ? (
              <div className="flex">
                <span className="flex items-center justify-center bg-surface border border-r-0 border-border rounded-l-xl px-4 text-sm text-muted">
                  +234
                </span>
                <input
                  type="tel"
                  placeholder="801 234 5678"
                  className="w-full bg-background border border-border rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            ) : (
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-6 bg-foreground text-background rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
              Sending Code...
            </span>
          ) : (
            <>
              Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-muted text-center mt-8">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </motion.div>
  );
}
