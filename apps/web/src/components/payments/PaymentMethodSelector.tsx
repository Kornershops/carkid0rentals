'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Check } from 'lucide-react';

interface PaymentMethod {
  id: number;
  provider: string;
  type: string;
  last4: string;
  brand: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
}

interface PaymentMethodSelectorProps {
  onSelect: (methodId: number | null) => void;
  selectedMethodId?: number | null;
}

export function PaymentMethodSelector({ onSelect, selectedMethodId }: PaymentMethodSelectorProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddNew, setShowAddNew] = useState(false);

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
        
        // Auto-select default method
        const defaultMethod = data.methods?.find((m: PaymentMethod) => m.is_default);
        if (defaultMethod && !selectedMethodId) {
          onSelect(defaultMethod.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setLoading(false);
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
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>

      {/* Saved Methods */}
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
            selectedMethodId === method.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getBrandIcon(method.brand)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">
                    {method.brand} •••• {method.last4}
                  </p>
                  {method.is_default && (
                    <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                {method.expiry_month && method.expiry_year && (
                  <p className="text-sm text-gray-600">
                    Expires {method.expiry_month}/{method.expiry_year}
                  </p>
                )}
              </div>
            </div>
            {selectedMethodId === method.id && (
              <Check className="w-6 h-6 text-blue-600" />
            )}
          </div>
        </button>
      ))}

      {/* New Payment Method */}
      <button
        onClick={() => {
          onSelect(null);
          setShowAddNew(true);
        }}
        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
          selectedMethodId === null && showAddNew
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add New Payment Method</p>
              <p className="text-sm text-gray-600">Credit or debit card</p>
            </div>
          </div>
          {selectedMethodId === null && showAddNew && (
            <Check className="w-6 h-6 text-blue-600" />
          )}
        </div>
      </button>

      {methods.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-2">
          No saved payment methods. Add one to get started.
        </p>
      )}
    </div>
  );
}
