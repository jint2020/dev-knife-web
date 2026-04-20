import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  dark?: boolean;
}

export function Logo({ dark = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0071e3] text-white">
        <Wrench className="h-5 w-5" />
      </div>
      <div className="overflow-hidden">
        <h1
          className={cn(
            'whitespace-nowrap text-lg font-semibold tracking-[-0.28px]',
            dark ? 'text-white' : 'text-[#1d1d1f]'
          )}
        >
          DevKnife
        </h1>
        <p className={cn('whitespace-nowrap text-xs', dark ? 'text-white/70' : 'text-black/60')}>
          Developer Tools
        </p>
      </div>
    </div>
  );
}
