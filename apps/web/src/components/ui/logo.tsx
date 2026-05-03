import { Stack } from "@phosphor-icons/react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <div className="relative">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 shadow-xl shadow-primary/20">
          <Stack size={22} weight="fill" className="text-primary-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-lg border-2 border-background" />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="text-[17px] font-black tracking-[-0.05em] uppercase text-foreground leading-none">
          CarKid<span className="text-accent italic font-black">0</span>
        </span>
        <span className="text-[7px] font-bold tracking-[0.4em] uppercase text-muted leading-none mt-1">
          Infrastructure
        </span>
      </div>
    </div>
  );
}
