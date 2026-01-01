/**
 * Logo Component
 *
 * Independent logo component that displays the DevKnife branding
 * Extracted from Sidebar to be used in Header
 */

import { Wrench } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Wrench className="h-5 w-5" />
      </div>
      <div className="overflow-hidden">
        <h1 className="text-lg font-bold whitespace-nowrap">
          DevKnife
        </h1>
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          Developer Tools
        </p>
      </div>
    </div>
  );
}
