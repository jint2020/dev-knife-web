/**
 * UUID Generator Tool
 * Generate random UUIDs with Tweakcn-themed Shadcn UI components
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, RefreshCw, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateUUID, generateBulkUUIDs } from './logic';

export default function UUIDGeneratorPage() {
  const { t } = useTranslation();
  const [uuid, setUuid] = useState<string>(generateUUID());
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [bulkUUIDs, setBulkUUIDs] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    setUuid(generateUUID());
    setCopied(null);
  };

  const handleBulkGenerate = () => {
    const count = Math.min(Math.max(1, bulkCount), 100); // Limit: 1-100
    setBulkUUIDs(generateBulkUUIDs(count));
    setCopied(null);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('tools.uuidGenerator.title')}</h1>
        <p className="text-muted-foreground">
          {t('tools.uuidGenerator.description')}
        </p>
      </div>

      {/* Single UUID Generator */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {t('tools.uuidGenerator.singleUuid')}
          </CardTitle>
          <CardDescription>{t('tools.uuidGenerator.singleDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Button
              onClick={() => copyToClipboard(uuid, 'single')}
              variant="default"
              size="icon"
              title={t('common.copy')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {copied === 'single' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
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
        </CardContent>
      </Card>

      <Separator />

      {/* Bulk UUID Generator */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            {t('tools.uuidGenerator.bulkGenerate')}
          </CardTitle>
          <CardDescription>{t('tools.uuidGenerator.bulkDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <Button
                  onClick={() => copyToClipboard(bulkUUIDs.join('\n'), 'bulk')}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  {copied === 'bulk' ? (
                    <>
                      <Check className="w-3 h-3 mr-2" />
                      {t('common.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-2" />
                      {t('common.copy')}
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-md border border-border max-h-64 overflow-y-auto scrollbar-thin">
                <div className="space-y-1 font-mono text-sm">
                  {bulkUUIDs.map((id, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between group hover:bg-accent/50 px-2 py-1 rounded transition-colors"
                    >
                      <span className="text-foreground">{id}</span>
                      <Button
                        onClick={() => copyToClipboard(id, `bulk-${index}`)}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copied === `bulk-${index}` ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-border bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">About UUID v4</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
