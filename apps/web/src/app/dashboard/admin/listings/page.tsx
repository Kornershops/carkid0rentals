'use client';

import { useState, useEffect } from 'react';
import { Check, X, Plus, Eye } from '@phosphor-icons/react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface AdminListing {
  id: string;
  title: string;
  brand: string;
  category: string;
  pricePerDay: number;
  location: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
  listerRole: string;
  listerName: string;
  createdAt: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('carkid0_token');
      const res = await fetch(`${API_BASE}/listings?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setListings(data.listings || []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const token = localStorage.getItem('carkid0_token');
    await fetch(`${API_BASE}/listings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const filtered = filter === 'all' ? listings : listings.filter(l => l.status === filter);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success" size="sm">Approved</Badge>;
      case 'rejected': return <Badge variant="error" size="sm">Rejected</Badge>;
      default: return <Badge variant="warning" size="sm">Pending</Badge>;
    }
  };

  return (
    <div className="py-8">
      <Container size="lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 mb-1">Manage Listings</h1>
            <p className="text-sm text-gray-600">{listings.length} total · {listings.filter(l => l.status === 'pending').length} pending review</p>
          </div>
          <Link href="/lister/fleet/add">
            <Button><Plus size={16} weight="bold" /> Add Listing</Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm rounded-full transition ${filter === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500 py-12 text-center">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">No listings found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(listing => (
              <Card key={listing.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{listing.title}</h3>
                      {statusBadge(listing.status)}
                      <Badge variant="default" size="sm">{listing.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {listing.listerName} · {listing.location}, {listing.country} · ₦{listing.pricePerDay}/day
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/listings/${listing.id}`}>
                      <Button variant="secondary" size="sm"><Eye size={14} /></Button>
                    </Link>
                    {listing.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => updateStatus(listing.id, 'approved')}>
                          <Check size={14} weight="bold" /> Approve
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => updateStatus(listing.id, 'rejected')}>
                          <X size={14} weight="bold" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
