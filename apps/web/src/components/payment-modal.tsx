"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LockKey, CheckCircle } from "@phosphor-icons/react";
import { formatPrice } from "@/lib/currency";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  country: string;
}

export function PaymentModal({ isOpen, onClose, amount, currency, country }: PaymentModalProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const isEastAfrica = country === "Kenya"; // KES -> M-Pesa
  const paymentProvider = isEastAfrica ? "M-Pesa" : "Paystack";

  const handlePayment = () => {
    setStatus("processing");
    // Mock integration stub
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 2000);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === "processing" ? undefined : onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass overflow-hidden rounded-3xl border border-white/10 shadow-2xl relative">
              
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h2 className="text-lg font-black tracking-tight">Secure Escrow</h2>
                {status !== "processing" && (
                  <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="p-8">
                {status === "success" ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 text-emerald-500"
                    >
                      <CheckCircle size={64} weight="fill" />
                    </motion.div>
                    <h3 className="mb-2 text-2xl font-black">Payment Secured</h3>
                    <p className="text-sm text-slate-400">Escrow funds locked. Vehicle deployment initiated.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 text-center">
                      <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-500">Total Due</p>
                      <div className="text-4xl font-black text-indigo-400">
                        {formatPrice(amount, currency as any)}
                      </div>
                    </div>

                    <div className="mb-8 space-y-4 rounded-2xl bg-white/5 p-6 border border-white/10">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Escrow Deposit</span>
                        <span className="font-bold">{formatPrice(amount * 0.2, currency as any)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Rental Balance</span>
                        <span className="font-bold">{formatPrice(amount * 0.8, currency as any)}</span>
                      </div>
                      <div className="my-2 h-px w-full bg-white/10" />
                      <div className="flex justify-between text-xs font-bold text-emerald-400">
                        <span>Payment Provider</span>
                        <span>{paymentProvider} Secured</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={status === "processing"}
                      className="btn btn-accent relative w-full h-14 overflow-hidden rounded-xl font-bold transition-all disabled:opacity-80"
                    >
                      {status === "processing" ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Processing with {paymentProvider}...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <LockKey size={18} weight="bold" />
                          Pay with {paymentProvider}
                        </div>
                      )}
                    </button>
                    
                    <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-slate-500">
                      AES-256 Encrypted • Institutional Grade
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
