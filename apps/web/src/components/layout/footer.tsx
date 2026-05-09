import Link from 'next/link';
import { Logo } from '../ui/logo';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #ebebeb', background: '#fff' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '64px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, marginBottom: 56 }}>
          <div>
            <Logo />
            <p style={{ marginTop: 16, fontSize: 13, color: '#999', lineHeight: 1.6, maxWidth: 200 }}>
              Verified vehicle rentals across Africa.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 16 }}>Platform</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link href="/listings" style={{ fontSize: 13, color: '#6b6b6b' }}>Browse Vehicles</Link></li>
              <li><Link href="/how-it-works" style={{ fontSize: 13, color: '#6b6b6b' }}>How it Works</Link></li>
              <li><Link href="/driver/register" style={{ fontSize: 13, color: '#6b6b6b' }}>Become a Driver</Link></li>
              <li><Link href="/lister/register" style={{ fontSize: 13, color: '#6b6b6b' }}>List Your Fleet</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 16 }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link href="/about" style={{ fontSize: 13, color: '#6b6b6b' }}>About</Link></li>
              <li><Link href="/help" style={{ fontSize: 13, color: '#6b6b6b' }}>Help Center</Link></li>
              <li><Link href="/contact" style={{ fontSize: 13, color: '#6b6b6b' }}>Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 16 }}>Legal</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link href="/legal" style={{ fontSize: 13, color: '#6b6b6b' }}>Privacy Policy</Link></li>
              <li><Link href="/legal" style={{ fontSize: 13, color: '#6b6b6b' }}>Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ paddingTop: 32, borderTop: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: '#999' }}>© 2026 CarKid0 Rentals</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/legal" style={{ fontSize: 12, color: '#999' }}>Privacy</Link>
            <Link href="/legal" style={{ fontSize: 12, color: '#999' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
