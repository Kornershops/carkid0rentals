"use client";

import Link from 'next/link';
import { useState } from 'react';
import { List, X, User } from '@phosphor-icons/react';
import { Logo } from '../ui/logo';
import { Button } from '../ui/button';
import { useStore } from '@/store/use-store';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role } = useStore();
  
  const navigation = [
    { name: 'Browse', href: '/listings' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Locations', href: '/locations' },
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {role && (
              <Link href={`/${role}/dashboard`}>
                <Button variant="ghost" size="sm">
                  <User size={16} weight="bold" />
                  Dashboard
                </Button>
              </Link>
            )}
            <Link href="/auth/login">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} weight="bold" />
            ) : (
              <List size={24} weight="bold" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                {role && (
                  <Link href={`/${role}/dashboard`}>
                    <Button variant="ghost" size="md" fullWidth>
                      <User size={16} weight="bold" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/auth/login">
                  <Button variant="primary" size="md" fullWidth>
                    Sign In
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
