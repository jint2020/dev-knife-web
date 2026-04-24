import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  Bell,
  BookOpen,
  Bot,
  Braces,
  FileJson2,
  Github,
  Image,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToolDiscovery } from '@/hooks/useToolDiscovery';
import { useAppStore } from '@/store';
import { Logo } from './Logo';
import { ToolWindow } from './ToolWindow';
import { ToolRenderer } from './ToolRenderer';
import { ThemeToggle } from './ThemeToggle';
import { SettingsDialog } from './SettingsDialog';
import { CommandPalette } from './CommandPalette';
import { Button } from '@/components/ui/button';
import type { Tool, ToolCategory } from '@/types/tool';

type DesktopCategory = {
  key: ToolCategory;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const DESKTOP_CATEGORIES: DesktopCategory[] = [
  { key: 'generators', label: '生成器', icon: Sparkles },
  { key: 'crypto', label: '加密与编码', icon: KeyRound },
  { key: 'formatters', label: '格式化工具', icon: FileJson2 },
  { key: 'text', label: '文本工具', icon: Braces },
  { key: 'image', label: '图像工具', icon: Image },
  { key: 'ai', label: 'AI 工具', icon: Bot },
];

const QUICK_DOCK_TOOL_IDS = [
  'uuid-generator',
  'password-generator',
  'json-formatter',
  'base64-encoder',
  'qr-code-generator',
  'image-compressor',
  'ai-api-debugger',
];

function formatNow(now: Date): string {
  const weekday = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(now);
  const date = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
  return `${weekday} ${date} ${time}`;
}

function DesktopFolder({
  category,
  tools,
  onOpen,
}: {
  category: DesktopCategory;
  tools: Tool[];
  onOpen: (tool: Tool) => void;
}) {
  const CategoryIcon = category.icon;

  return (
    <div className="group rounded-lg bg-card p-3 shadow-md">
      <div className="mb-3 flex items-center gap-2 text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <CategoryIcon className="h-4 w-4" />
        </div>
        <h3 className="text-[15px] font-semibold tracking-[-0.2px]">{category.label}</h3>
      </div>
      <div className="space-y-1.5">
        {tools.slice(0, 3).map((tool) => {
          const ToolIcon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onOpen(tool)}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm text-foreground transition hover:bg-accent"
            >
              <ToolIcon className="h-4 w-4 text-primary" />
              <span className="truncate">{tool.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AppLayout() {
  const { t } = useTranslation();
  const { tools, getToolsByCategory } = useToolDiscovery();

  const tabs = useAppStore((state) => state.tabs);
  const activeTabId = useAppStore((state) => state.activeTabId);
  const windowStates = useAppStore((state) => state.windowStates);
  const zOrder = useAppStore((state) => state.zOrder);
  const openTool = useAppStore((state) => state.openTool);
  const closeTool = useAppStore((state) => state.closeTool);
  const minimizeTool = useAppStore((state) => state.minimizeTool);
  const maximizeTool = useAppStore((state) => state.maximizeTool);
  const restoreTool = useAppStore((state) => state.restoreTool);
  const focusTool = useAppStore((state) => state.focusTool);

  const [timeLabel, setTimeLabel] = useState(() => formatNow(new Date()));

  useEffect(() => {
    const tick = () => setTimeLabel(formatNow(new Date()));
    const id = window.setInterval(tick, 1000 * 30);
    return () => window.clearInterval(id);
  }, []);

  const quickTools = useMemo(
    () => QUICK_DOCK_TOOL_IDS.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as Tool[],
    [tools]
  );

  const handleOpenTool = (tool: Tool) => {
    openTool({
      id: tool.id,
      title: tool.title,
      locales: tool.locales,
      icon: tool.icon,
      path: tool.path,
    });
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="relative z-20 mx-3 mt-3 flex h-12 items-center justify-between apple-nav-glass-dark rounded-lg px-4 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 lg:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <Logo dark />
          <span className="hidden text-xs text-white/80 xl:block">{timeLabel}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <CommandPalette />
          <Button variant="ghost" size="icon" asChild className="text-white/80 hover:bg-white/10 hover:text-white">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" title={t('common.viewOnGithub')}>
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-white/85 hover:bg-white/10 hover:text-white">
            引导
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-white/85 hover:bg-white/10 hover:text-white">
            <a href="/docs/QUICKSTART.md" target="_blank" rel="noopener noreferrer">文档</a>
          </Button>
          <SettingsDialog />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 pb-24 pt-4">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs text-foreground/80 backdrop-blur-md">
            <Bell className="h-3.5 w-3.5 text-primary" />
            不知道从哪里开始？查看指南了解主要功能
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {DESKTOP_CATEGORIES.map((category) => (
              <DesktopFolder
                key={category.key}
                category={category}
                tools={getToolsByCategory(category.key)}
                onOpen={handleOpenTool}
              />
            ))}
          </section>

          <section className="relative min-h-0 flex-1">
            {tabs.map((tab) => {
              const ws = windowStates[tab.id] ?? { isMinimized: false, isMaximized: false };
              const zIdx = zOrder.indexOf(tab.id);
              return (
                <ToolWindow
                  key={tab.id}
                  tab={tab}
                  isActive={tab.id === activeTabId}
                  isMinimized={ws.isMinimized}
                  isMaximized={ws.isMaximized}
                  zIndex={zIdx >= 0 ? zIdx + 10 : 10}
                  onClose={() => closeTool(tab.id)}
                  onMinimize={() => minimizeTool(tab.id)}
                  onMaximize={() => maximizeTool(tab.id)}
                  onRestore={() => restoreTool(tab.id)}
                  onFocus={() => focusTool(tab.id)}
                >
                  <ToolRenderer toolId={tab.id} isActive={true} />
                </ToolWindow>
              );
            })}
            {tabs.length === 0 && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {t('common.noToolsOpen')}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
        <div className="pointer-events-auto flex items-end gap-2 rounded-xl bg-card/85 px-3 py-2 shadow-md">
          {tabs
            .filter((tab) => windowStates[tab.id]?.isMinimized)
            .map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={`min-${tab.id}`}
                  onClick={() => restoreTool(tab.id)}
                  title={t(`tools.${tab.locales}.title`)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          {tabs.filter((tab) => windowStates[tab.id]?.isMinimized).length > 0 && quickTools.length > 0 && (
            <div className="mx-0.5 h-8 w-px bg-border" />
          )}
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleOpenTool(tool)}
                title={t(`tools.${tool.locales}.title`)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
