import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  Bell,
  BookOpen,
  Bot,
  Braces,
  FileJson2,
  FolderOpen,
  Github,
  Image,
  KeyRound,
  Sparkles,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToolDiscovery } from '@/hooks/useToolDiscovery';
import { useAppStore } from '@/store';
import { Logo } from './Logo';
import { TabBar } from './TabBar';
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
    <div className="group rounded-2xl border border-white/60 bg-white/55 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/70">
      <div className="mb-3 flex items-center gap-2 text-[#1d1d1f]">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0071e3] text-white">
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
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm text-[#1d1d1f] transition hover:bg-black/5"
            >
              <ToolIcon className="h-4 w-4 text-[#0071e3]" />
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
  const openTool = useAppStore((state) => state.openTool);
  const closeAllTabs = useAppStore((state) => state.closeAllTabs);

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
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,#ffffff_0%,#f5f5f7_42%,#e8e8ec_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:140px_140px]" />

      <header className="relative z-20 mx-3 mt-3 flex h-12 items-center justify-between rounded-2xl border border-white/70 bg-black/70 px-4 text-white shadow-[0_10px_34px_rgba(0,0,0,0.3)] backdrop-blur-xl">
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
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-4 py-2 text-xs text-[#1d1d1f]/80 backdrop-blur-md">
            <Bell className="h-3.5 w-3.5 text-[#0071e3]" />
            不知道从哪里开始？查看指南了解主要功能
            <BookOpen className="h-3.5 w-3.5 text-[#1d1d1f]/70" />
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

          {tabs.length > 0 && (
            <section className="min-h-0 flex-1 rounded-[22px] border border-black/5 bg-white/80 shadow-[0_14px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
              <div className="flex h-10 items-center justify-between border-b border-black/10 px-3">
                <div className="flex items-center gap-2 text-xs text-black/65">
                  <FolderOpen className="h-3.5 w-3.5 text-[#0071e3]" />
                  当前工作区
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-black/60 hover:bg-black/5 hover:text-black"
                  onClick={closeAllTabs}
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  关闭全部
                </Button>
              </div>
              <div className="flex h-[calc(100%-2.5rem)] min-h-0 flex-col overflow-hidden rounded-b-[22px]">
                <TabBar />
                <div className="relative flex-1 overflow-hidden bg-white/65">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className="absolute inset-0 overflow-y-auto"
                      style={{ display: tab.id === activeTabId ? 'block' : 'none' }}
                    >
                      <ToolRenderer toolId={tab.id} isActive={tab.id === activeTabId} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
        <div className="pointer-events-auto flex items-end gap-2 rounded-[24px] border border-white/80 bg-white/70 px-3 py-2 shadow-[0_16px_38px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleOpenTool(tool)}
                title={t(`tools.${tool.locales}.title`)}
                className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#2997ff] text-white transition duration-200 hover:-translate-y-1.5"
              >
                <Icon className="h-5 w-5 drop-shadow" />
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
