import Link from 'next/link';
import { Logo } from '../ui/logo';

export function Footer() {
  return (
    <footer className="border-t border-[#ebebeb] bg-white">
      <div className="max-w-[1140px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-[13px] text-[#999] leading-relaxed max-w-[200px]">
              Verified vehicle rentals across Africa.
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-medium text-[#1a1a1a] mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/listings" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Browse Vehicles</Link></li>
              <li><Link href="/how-it-works" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">How it Works</Link></li>
              <li><Link href="/driver/register" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Become a Driver</Link></li>
              <li><Link href="/lister/register" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">List Your Fleet</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-medium text-[#1a1a1a] mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">About</Link></li>
              <li><Link href="/help" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-medium text-[#1a1a1a] mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/legal" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal" className="text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#ebebeb] flex items-center justify-between">
          <p className="text-[12px] text-[#999]">
            © {new Date().getFullYear()} CarKid0 Rentals
          </p>
          <div className="flex items-center gap-5">
            <Link href="/legal" className="text-[12px] text-[#999] hover:text-[#1a1a1a] transition-colors">Privacy</Link>
            <Link href="/legal" className="text-[12px] text-[#999] hover:text-[#1a1a1a] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
