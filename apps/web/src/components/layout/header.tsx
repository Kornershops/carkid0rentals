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
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #ebebeb' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          <Link href="/listings" style={{ fontSize: 13, fontWeight: 500, color: '#6b6b6b' }}>
            Browse
          </Link>
          <Link href="/how-it-works" style={{ fontSize: 13, fontWeight: 500, color: '#6b6b6b' }}>
            How it Works
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 24 }}>
          {isAuthenticated && (
            <Link href="/dashboard/customer" style={{ fontSize: 13, fontWeight: 500, color: '#6b6b6b' }}>
              Dashboard
            </Link>
          )}
          <Link href="/auth/login" style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
            Sign in
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
          style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} color="#1a1a1a" /> : <List size={20} color="#1a1a1a" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" style={{ padding: '24px 48px', borderTop: '1px solid #ebebeb' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/listings" style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }} onClick={() => setIsMobileMenuOpen(false)}>Browse</Link>
            <Link href="/how-it-works" style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }} onClick={() => setIsMobileMenuOpen(false)}>How it Works</Link>
            <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 16, marginTop: 8 }}>
              <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }} onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
