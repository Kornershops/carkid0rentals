"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsible?: boolean;
}

export function Sidebar({ items, collapsible = true }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  
  return (
    <aside
      className={`
        bg-white border-r border-gray-200 transition-all duration-200 ease-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Content */}
        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Collapse Toggle */}
        {collapsible && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <CaretRight size={20} weight="bold" />
              ) : (
                <>
                  <CaretLeft size={20} weight="bold" />
                  <span className="ml-2 text-sm font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
