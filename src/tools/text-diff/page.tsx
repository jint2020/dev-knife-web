import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  compareText,
  getDiffStats,
  generateUnifiedDiff,
  type DiffMode,
} from './logic';
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function TextDiffPage() {
  const { t } = useTranslation();
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [mode, setMode] = useState<DiffMode>('lines');

  const diff = text1 || text2 ? compareText(text1, text2, mode) : [];
  const stats = diff.length > 0 ? getDiffStats(diff) : null;
  const unifiedDiff = text1 || text2 ? generateUnifiedDiff(text1, text2) : '';

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };


  return (
    <ToolPage
      title={t('tools.textDiff.title')}
      description={t('tools.textDiff.description')}
    >
          {/* Mode Selection */}
          <div className="flex items-center gap-2">
            <Label>{t('tools.textDiff.compareBy')}</Label>
            <Badge
              variant={mode === 'lines' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setMode('lines')}
            >
              {t('tools.textDiff.lines')}
            </Badge>
            <Badge
              variant={mode === 'words' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setMode('words')}
            >
              {t('tools.textDiff.words')}
            </Badge>
            <Badge
              variant={mode === 'chars' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setMode('chars')}
            >
              {t('tools.textDiff.characters')}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSwap}
              className="ml-auto"
              disabled={!text1 && !text2}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              {t('tools.textDiff.swap')}
            </Button>
          </div>

          {/* Input Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('tools.textDiff.text1Label')}</Label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder={t('tools.textDiff.text1Placeholder')}
                className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('tools.textDiff.text2Label')}</Label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder={t('tools.textDiff.text2Placeholder')}
                className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <ToolSection
              className="border-2"
              contentClassName="pt-6"
            >
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total {mode}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.added}</div>
                  <div className="text-sm text-muted-foreground">{t('tools.textDiff.additions')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.removed}</div>
                  <div className="text-sm text-muted-foreground">{t('tools.textDiff.deletions')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">{stats.unchanged}</div>
                  <div className="text-sm text-muted-foreground">{t('tools.textDiff.unchanged')}</div>
                </div>
              </div>
            </ToolSection>
          )}

          {/* Diff Display */}
          {diff.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('tools.textDiff.diffResult')}</Label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-muted-foreground">{t('tools.textDiff.deletions')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-muted-foreground">{t('tools.textDiff.additions')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md border border-border bg-background overflow-auto max-h-[400px]">
                <div className="font-mono text-sm whitespace-pre-wrap">
                  {diff.map((part, index) => {
                    let className = '';
                    if (part.added) {
                      className = 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100';
                    } else if (part.removed) {
                      className = 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100';
                    }

                    return (
                      <span key={index} className={className}>
                        {part.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Unified Diff Format */}
          {unifiedDiff && diff.length > 0 && (
            <ToolSection
              title={
                <div className="flex items-center justify-between w-full">
                  <span>{t('tools.textDiff.unifiedDiff')}</span>
                  <CopyButton value={unifiedDiff} variant="outline" size="sm" />
                </div>
              }
            >
              <textarea
                value={unifiedDiff}
                readOnly
                className="w-full min-h-[200px] p-3 rounded-md border border-border bg-muted text-foreground font-mono text-xs resize-none focus:outline-none"
              />
            </ToolSection>
          )}

          {!text1 && !text2 && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <FileText className="h-16 w-16 mb-4 opacity-20" />
              <p>{t('tools.textDiff.emptyState')}</p>
            </div>
          )}
        </ToolPage>
      );
    }
