import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { toolRegistry } from '@/tools/registry';
import { useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const openTool = useAppStore((state) => state.openTool);
  const { t } = useTranslation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (toolId: string) => {
    const tool = toolRegistry.getAll().find((t) => t.id === toolId);
    if (tool) {
      openTool({
        id: tool.id,
        title: tool.title,
        icon: tool.icon,
        path: tool.path,
      });
      setOpen(false);
    }
  };

  const tools = toolRegistry.getAll();
  const categories = Array.from(new Set(tools.map((t) => t.category)));

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">{t('nav.search')}</span>
        <span className="inline-flex lg:hidden">{t('nav.search')}</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('nav.searchPlaceholder')} />
        <CommandList>
          <CommandEmpty>{t('nav.noResults')}</CommandEmpty>
          {categories.map((category) => {
            const categoryTools = toolRegistry.getByCategory(category);
            if (categoryTools.length === 0) return null;

            return (
              <CommandGroup key={category} heading={category.toUpperCase()}>
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <CommandItem
                      key={tool.id}
                      value={tool.title}
                      onSelect={() => handleSelect(tool.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{tool.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {tool.description}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
