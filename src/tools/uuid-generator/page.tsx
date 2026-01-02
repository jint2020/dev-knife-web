/**
 * UUID Generator Tool
 * Generate random UUIDs with Tweakcn-themed Shadcn UI components
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateUUID, generateBulkUUIDs } from './logic';
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function UUIDGeneratorPage() {
  const { t } = useTranslation();
  const [uuid, setUuid] = useState<string>(generateUUID());
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [bulkUUIDs, setBulkUUIDs] = useState<string[]>([]);

  const handleGenerate = () => {
    setUuid(generateUUID());
  };

  const handleBulkGenerate = () => {
    const count = Math.min(Math.max(1, bulkCount), 100); // Limit: 1-100
    setBulkUUIDs(generateBulkUUIDs(count));
  };

  return (
    <ToolPage
      title={t('tools.uuidGenerator.title')}
      description={t('tools.uuidGenerator.description')}
    >
      {/* Single UUID Generator */}
      <ToolSection
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {t('tools.uuidGenerator.singleUuid')}
          </div>
        }
        description={t('tools.uuidGenerator.singleDesc')}
        contentClassName="space-y-4"
      >
        {/* UUID Display */}
        <div className="flex items-center gap-2">
          <Input
            value={uuid}
            readOnly
            className="font-mono text-sm bg-muted"
          />
          <Button
            onClick={handleGenerate}
            variant="outline"
            size="icon"
            title={t('tools.uuidGenerator.generateNew')}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <CopyButton
            value={uuid}
            mode="icon-only"
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          />
        </div>

        {/* Info Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            Version 4 (Random)
          </Badge>
          <Badge variant="outline" className="text-xs">
            RFC 4122 Compliant
          </Badge>
        </div>
      </ToolSection>

      <Separator />

      {/* Bulk UUID Generator */}
      <ToolSection
        title={
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            {t('tools.uuidGenerator.bulkGenerate')}
          </div>
        }
        description={t('tools.uuidGenerator.bulkDesc')}
        contentClassName="space-y-4"
      >
        {/* Count Input */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="bulk-count">{t('tools.uuidGenerator.count')}</Label>
            <Input
              id="bulk-count"
              type="number"
              min={1}
              max={100}
              value={bulkCount}
              onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleBulkGenerate}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t('common.generate')} {bulkCount} UUIDs
          </Button>
        </div>

        {/* Bulk Results */}
        {bulkUUIDs.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t('tools.uuidGenerator.uuidsGenerated')}</Label>
              <CopyButton value={bulkUUIDs.join('\n')} size="sm" className="h-8" />
            </div>
            <div className="p-4 bg-muted rounded-md border border-border max-h-64 overflow-y-auto scrollbar-thin">
              <div className="space-y-1 font-mono text-sm">
                {bulkUUIDs.map((id, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group hover:bg-accent/50 px-2 py-1 rounded transition-colors"
                  >
                    <span className="text-foreground">{id}</span>
                    <CopyButton
                      value={id}
                      mode="icon-only"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ToolSection>

      {/* Info Card */}
      <ToolSection
        title="About UUID v4"
        className="border-border bg-muted/50"
        contentClassName="text-sm text-muted-foreground space-y-2"
      >
        <p>
          UUID (Universally Unique Identifier) version 4 uses random numbers to generate a 128-bit identifier.
          The probability of generating duplicate UUIDs is extremely low.
        </p>
        <p className="font-medium text-foreground">
          Format: <span className="font-mono text-xs">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</span>
        </p>
        <p>
          All UUIDs are generated client-side using the Web Crypto API for cryptographic randomness.
        </p>
      </ToolSection>
    </ToolPage>
  );
}
