/**
 * Header Component (Top Header)
 * 
 * Layout: Search on left, actions on right
 * - Search bar: Positioned at the left edge with pl-4 spacing
 * - Action icons: Fixed at the right edge (Github + Theme Toggle)
 * 
 * HEIGHT: h-14 (56px) - CRITICAL for alignment
 * Together with TabBar (h-10) = h-24 total, matching Sidebar Logo area
 */

import { Github } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    // HEIGHT: h-14 (56px) - CRITICAL for alignment with Sidebar Logo area
    <header className="h-14 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
      <div className="flex h-full items-center justify-between px-4">
        {/* Search - Left Side */}
        <div className="flex-shrink-0">
          <CommandPalette />
        </div>

        {/* Actions - Right Side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


