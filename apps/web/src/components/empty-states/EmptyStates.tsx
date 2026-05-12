'use client';

import { Search, Calendar, Car, FileText, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon || <Search className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action && (
        <button onClick={action.onClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {action.label}
        </button>
      )}
    </div>
  );
}

export function NoBookingsEmpty({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="w-8 h-8 text-gray-400" />}
      title="No bookings yet"
      description="Start your journey by browsing available vehicles and making your first booking."
      action={{ label: 'Browse Vehicles', onClick: onBrowse }}
    />
  );
}

export function NoVehiclesEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={<Car className="w-8 h-8 text-gray-400" />}
      title="No vehicles listed"
      description="Add your first vehicle to start earning from rentals."
      action={{ label: 'Add Vehicle', onClick: onAdd }}
    />
  );
}

export function NoResultsEmpty() {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-gray-400" />}
      title="No results found"
      description="Try adjusting your filters or search terms."
    />
  );
}

export function NoDocumentsEmpty({ onUpload }: { onUpload: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8 text-gray-400" />}
      title="No documents uploaded"
      description="Upload your verification documents to complete your profile."
      action={{ label: 'Upload Documents', onClick: onUpload }}
    />
  );
}

export function ErrorEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-8 h-8 text-red-400" />}
      title="Something went wrong"
      description="We couldn't load this content. Please try again."
      action={{ label: 'Retry', onClick: onRetry }}
    />
  );
}
