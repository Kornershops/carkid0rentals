"use client";

import dynamic from "next/dynamic";

const ComparisonBar = dynamic(() => import("@/components/comparison-bar"), {
  ssr: false,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ComparisonBar />
    </>
  );
}
