'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Trash2, Plus, Check } from 'lucide-react';

interface PaymentMethod {
  id: number;
  provider: string;
  type: string;
  last4: string;
  brand: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  created_at: string;
}

export function SavedCards() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/methods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMethods(data.methods || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (methodId: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    setDeleting(methodId);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/methods/${methodId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMethods((prev) => prev.filter((m) => m.id !== methodId));
      }
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    } finally {
      setDeleting(null);
    }
  };

  const getBrandIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('visa')) return '💳';
    if (brandLower.includes('mastercard')) return '💳';
    if (brandLower.includes('amex')) return '💳';
    return '💳';
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h3>
        <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add New Card</span>
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-4">No saved payment methods</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg transition-all ${
                method.is_default
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getBrandIcon(method.brand)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {method.brand} •••• {method.last4}
                      </p>
                      {method.is_default && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          <Check className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    {method.expiry_month && method.expiry_year && (
                      <p className="text-sm text-gray-600">
                        Expires {method.expiry_month}/{method.expiry_year}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {method.provider.charAt(0).toUpperCase() + method.provider.slice(1)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(method.id)}
                  disabled={deleting === method.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete card"
                >
                  {deleting === method.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Secure:</strong> Your payment information is encrypted and stored securely.
          We never store your full card number.
        </p>
      </div>
    </div>
  );
}
