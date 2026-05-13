'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle,
  CreditCard,
  Car,
  Play,
  StopCircle,
  AlertTriangle,
  MessageCircle,
  Star,
  Gift,
} from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  data?: string;
  read: boolean;
  read_at?: string;
  created_at: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getIcon = (type: string) => {
    const iconClass = 'w-5 h-5';
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'payment_received':
        return <CreditCard className={`${iconClass} text-blue-600`} />;
      case 'vehicle_ready':
        return <Car className={`${iconClass} text-purple-600`} />;
      case 'rental_started':
        return <Play className={`${iconClass} text-green-600`} />;
      case 'rental_ended':
        return <StopCircle className={`${iconClass} text-gray-600`} />;
      case 'safehalt_violation':
        return <AlertTriangle className={`${iconClass} text-red-600`} />;
      case 'message_received':
        return <MessageCircle className={`${iconClass} text-blue-600`} />;
      case 'review_request':
        return <Star className={`${iconClass} text-yellow-600`} />;
      case 'promotional':
        return <Gift className={`${iconClass} text-pink-600`} />;
      default:
        return <CheckCircle className={`${iconClass} text-gray-600`} />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.data) {
      try {
        const data = JSON.parse(notification.data);
        if (data.booking_id) {
          window.location.href = `/booking/${data.booking_id}`;
        } else if (data.type === 'message') {
          window.location.href = '/messages';
        }
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div
      onClick={handleClick}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-medium text-gray-900 ${
                !notification.read ? 'font-semibold' : ''
              }`}
            >
              {notification.title}
            </p>
            {!notification.read && (
              <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.body}</p>
          <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
}
