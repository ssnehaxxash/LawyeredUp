
'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CollapsibleSidebarButtonProps = {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  side: 'left' | 'right';
  className?: string;
};

export function CollapsibleSidebarButton({ isCollapsed, onToggleCollapse, side, className }: CollapsibleSidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleCollapse}
      className={cn(
        "h-8 w-8 rounded-full border bg-background hover:bg-muted",
        side === 'left' ? ' -right-4' : '-left-4',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          "h-4 w-4 transition-transform",
          (side === 'left' && isCollapsed) && 'rotate-180',
          (side === 'right' && !isCollapsed) && 'rotate-180'
        )}
      />
    </Button>
  );
}
