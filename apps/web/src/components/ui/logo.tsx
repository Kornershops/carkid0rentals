export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0 select-none ${className}`}>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#1a1a1a]">
        CarKid0
      </span>
    </span>
  );
}
