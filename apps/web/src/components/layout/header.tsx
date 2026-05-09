"use client";

import Link from 'next/link';
import { useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { Logo } from '../ui/logo';
import { useStore } from '@/store/use-store';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useStore();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#ebebeb]">
      <div className="max-w-[1140px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-[60px]">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/listings" className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
              Browse
            </Link>
            <Link href="/how-it-works" className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
              How it Works
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <Link href="/dashboard/customer" className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/auth/login" className="text-[13px] font-medium text-[#1a1a1a] hover:text-[#6b6b6b] transition-colors">
              Sign in
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1a1a1a]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-[#ebebeb]">
            <nav className="flex flex-col gap-4">
              <Link href="/listings" className="text-sm font-medium text-[#1a1a1a]" onClick={() => setIsMobileMenuOpen(false)}>
                Browse
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-[#1a1a1a]" onClick={() => setIsMobileMenuOpen(false)}>
                How it Works
              </Link>
              <Link href="/auth/login" className="text-sm font-medium text-[#1a1a1a] pt-4 border-t border-[#ebebeb]" onClick={() => setIsMobileMenuOpen(false)}>
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
