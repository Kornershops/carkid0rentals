import Link from 'next/link';
import { Logo } from '../ui/logo';

export function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Browse Vehicles', href: '/listings' },
        { name: 'How it Works', href: '/how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Locations', href: '/locations' },
      ],
    },
    {
      title: 'For Users',
      links: [
        { name: 'Become a Driver', href: '/driver/register' },
        { name: 'List Your Fleet', href: '/lister/register' },
        { name: 'Hauling Services', href: '/hauling' },
        { name: 'Help Center', href: '/help' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/legal/privacy' },
        { name: 'Terms of Service', href: '/legal/terms' },
        { name: 'Cookie Policy', href: '/legal/cookies' },
        { name: 'Insurance', href: '/legal/insurance' },
      ],
    },
  ];
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} CarKid0 Rentals. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link
              href="/legal/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
