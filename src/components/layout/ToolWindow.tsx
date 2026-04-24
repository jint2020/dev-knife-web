import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tab } from '@/store/types';
import { cn } from '@/lib/utils';

interface ToolWindowProps {
  tab: Tab;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  children: ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onFocus: () => void;
}

const TRAFFIC_CLOSE = 'bg-[#ff5f57]';
const TRAFFIC_MINIMIZE = 'bg-[#febc2e]';
const TRAFFIC_MAXIMIZE = 'bg-[#28c840]';

const MIN_WIDTH = 360;
const MIN_HEIGHT = 240;
const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 480;

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_CURSORS: Record<ResizeDir, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize',
};

export function ToolWindow({
  tab,
  isActive,
  isMinimized,
  isMaximized,
  zIndex,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
}: ToolWindowProps) {
  const { t } = useTranslation();
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: DEFAULT_WIDTH, h: DEFAULT_HEIGHT });
  const windowRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  // Reset position when maximized
  useEffect(() => {
    if (isMaximized) {
      setDrag(null);
    }
  }, [isMaximized]);

  // Reset size on double-click restore or when re-opened
  useEffect(() => {
    if (!isMaximized && !isMinimized) {
      // Keep current size; only reset if was maximized
    }
  }, [isMaximized, isMinimized]);

  // ---- Drag (title bar) ----
  const handleTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Don't start drag if clicking a button
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;
      if (isMaximized) return;

      onFocus();
      draggingRef.current = true;

      const startX = e.clientX;
      const startY = e.clientY;
      const startDrag = drag ?? { x: 0, y: 0 };
      const el = windowRef.current;
      if (el) el.setPointerCapture(e.pointerId);

      const handleMove = (ev: PointerEvent) => {
        setDrag({
          x: startDrag.x + (ev.clientX - startX),
          y: startDrag.y + (ev.clientY - startY),
        });
      };

      const handleUp = () => {
        draggingRef.current = false;
        if (el) el.releasePointerCapture(e.pointerId);
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [drag, isMaximized, onFocus]
  );

  // ---- Resize (edges / corners) ----
  const handleResizePointerDown = useCallback(
    (dir: ResizeDir, e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (isMaximized) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startSize = { ...size };
      const startDrag = drag ?? { x: 0, y: 0 };
      const el = windowRef.current;
      if (el) el.setPointerCapture(e.pointerId);

      const handleMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let newW = startSize.w;
        let newH = startSize.h;
        let newX = startDrag.x;
        let newY = startDrag.y;

        // Width adjustments
        if (dir.includes('e')) {
          newW = Math.max(MIN_WIDTH, startSize.w + dx);
        }
        if (dir.includes('w')) {
          const proposed = startSize.w - dx;
          if (proposed >= MIN_WIDTH) {
            newW = proposed;
            newX = startDrag.x + dx;
          } else {
            newW = MIN_WIDTH;
            newX = startDrag.x + (startSize.w - MIN_WIDTH);
          }
        }

        // Height adjustments
        if (dir.includes('s')) {
          newH = Math.max(MIN_HEIGHT, startSize.h + dy);
        }
        if (dir.includes('n')) {
          const proposed = startSize.h - dy;
          if (proposed >= MIN_HEIGHT) {
            newH = proposed;
            newY = startDrag.y + dy;
          } else {
            newH = MIN_HEIGHT;
            newY = startDrag.y + (startSize.h - MIN_HEIGHT);
          }
        }

        setSize({ w: newW, h: newH });
        setDrag({ x: newX, y: newY });
      };

      const handleUp = () => {
        if (el) el.releasePointerCapture(e.pointerId);
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [size, drag, isMaximized]
  );

  const windowTitle = t(`tools.${tab.locales}.title`);

  // Build the inline position/size style
  const inlineStyle: React.CSSProperties = {
    zIndex,
  };

  if (!isMaximized) {
    const d = drag ?? { x: 0, y: 0 };
    inlineStyle.width = size.w;
    inlineStyle.height = size.h;

    if (drag) {
      // While dragging: explicit px position
      inlineStyle.left = `calc(50% + ${d.x}px)`;
      inlineStyle.top = `calc(50% + ${d.y}px)`;
      inlineStyle.transform = 'translate(-50%, -50%)';
      inlineStyle.transition = 'none';
    }
    // When not dragging: CSS classes handle centering
  }

  // Resize handle element
  const ResizeHandle = ({ dir }: { dir: ResizeDir }) => (
    <div
      className="absolute z-10"
      style={{
        cursor: RESIZE_CURSORS[dir],
        ...(dir.includes('n') ? { top: 0, height: 4 } : {}),
        ...(dir.includes('s') ? { bottom: 0, height: 4 } : {}),
        ...(dir.includes('e') ? { right: 0, width: 4 } : {}),
        ...(dir.includes('w') ? { left: 0, width: 4 } : {}),
        // Corners get larger hit area
        ...(dir.length === 2 ? { width: 8, height: 8 } : {}),
      }}
      onPointerDown={(e) => handleResizePointerDown(dir, e)}
    />
  );

  return (
    <div
      ref={windowRef}
      className={cn(
        'absolute flex flex-col rounded-lg apple-window-shadow',
        isMinimized && 'hidden',
        isMaximized
          ? 'inset-0 z-50 rounded-none'
          : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card'
      )}
      style={inlineStyle}
      onClick={onFocus}
    >
      {/* Resize handles — 8 directions */}
      {!isMaximized && (
        <>
          <ResizeHandle dir="n" />
          <ResizeHandle dir="s" />
          <ResizeHandle dir="e" />
          <ResizeHandle dir="w" />
          <ResizeHandle dir="ne" />
          <ResizeHandle dir="nw" />
          <ResizeHandle dir="se" />
          <ResizeHandle dir="sw" />
        </>
      )}

      {/* Title bar */}
      <div
        className={cn(
          'flex h-10 shrink-0 items-center rounded-t-lg px-3 select-none',
          isMaximized && 'rounded-none',
          isActive ? 'bg-muted/50' : 'bg-muted/30'
        )}
        style={{ cursor: isMaximized ? 'default' : 'grab' }}
        onPointerDown={handleTitlePointerDown}
      >
        <div className="flex items-center gap-2">
          {/* Close */}
          <button
            className={cn(
              'relative flex h-3 w-3 items-center justify-center rounded-full cursor-default',
              TRAFFIC_CLOSE,
              'hover:[&_svg]:opacity-100'
            )}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close"
          >
            <X className="h-2 w-2 text-black/40 opacity-0 transition-opacity pointer-events-none" />
          </button>

          {/* Minimize */}
          <button
            className={cn(
              'relative flex h-3 w-3 items-center justify-center rounded-full cursor-default',
              TRAFFIC_MINIMIZE,
              'hover:[&_svg]:opacity-100'
            )}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            title="Minimize"
          >
            <Minus className="h-2 w-2 text-black/40 opacity-0 transition-opacity pointer-events-none" />
          </button>

          {/* Maximize / Restore */}
          <button
            className={cn(
              'relative flex h-3 w-3 items-center justify-center rounded-full cursor-default',
              TRAFFIC_MAXIMIZE,
              'hover:[&_svg]:opacity-100'
            )}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (isMaximized) {
                onRestore();
              } else {
                onMaximize();
              }
            }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="h-2 w-2 text-black/40 opacity-0 transition-opacity pointer-events-none" />
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
          {windowTitle}
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 min-h-0 rounded-b-lg overflow-hidden',
          isMaximized && 'rounded-none'
        )}
      >
        {children}
      </div>
    </div>
  );
}
