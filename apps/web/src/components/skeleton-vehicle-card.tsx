"use client";

import { motion } from "framer-motion";

export function SkeletonVehicleCard() {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Image Skeleton */}
      <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-surface)', overflow: 'hidden' }}>
        <SkeletonPulse />
      </div>

      {/* Content Skeleton */}
      <div style={{ padding: '14px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <SkeletonPulse width="40%" height={12} style={{ marginBottom: 6 }} />
          <SkeletonPulse width="70%" height={20} />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <SkeletonPulse width={60} height={20} borderRadius={4} />
          <SkeletonPulse width={50} height={20} borderRadius={4} />
          <SkeletonPulse width={70} height={20} borderRadius={4} />
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-primary)' }}>
          <div>
            <SkeletonPulse width={50} height={10} style={{ marginBottom: 4 }} />
            <SkeletonPulse width={80} height={24} />
          </div>
          <SkeletonPulse width={32} height={32} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}

function SkeletonPulse({ width = '100%', height = '100%', borderRadius = 0, style }: { width?: string | number; height?: string | number; borderRadius?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width,
        height,
        borderRadius,
        background: 'var(--border-primary)',
        ...style
      }}
    />
  );
}
