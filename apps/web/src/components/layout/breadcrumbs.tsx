import Link from 'next/link';
import { CaretRight, House } from '@phosphor-icons/react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {showHome && (
        <>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Home"
          >
            <House size={16} weight="bold" />
          </Link>
          <CaretRight size={12} weight="bold" className="text-gray-400" />
        </>
      )}
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-gray-900 font-semibold' : 'text-gray-600 font-medium'}>
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <CaretRight size={12} weight="bold" className="text-gray-400" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
