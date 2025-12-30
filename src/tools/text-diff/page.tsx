import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, FileText, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  compareText,
  getDiffStats,
  generateUnifiedDiff,
  type DiffMode,
} from './logic';

export default function TextDiffPage() {
  const { t } = useTranslation();
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [mode, setMode] = useState<DiffMode>('lines');
  const [copied, setCopied] = useState(false);

  const diff = text1 || text2 ? compareText(text1, text2, mode) : [];
  const stats = diff.length > 0 ? getDiffStats(diff) : null;
  const unifiedDiff = text1 || text2 ? generateUnifiedDiff(text1, text2) : '';

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle>Text Diff Viewer</CardTitle>
              <CardDescription>Compare and visualize differences between two text blocks</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="flex items-center gap-2">
            <Label>Compare by:</Label>
            <Badge
              variant={mode === 'lines' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setMode('lines')}
            >
              Lines
            </Badge>
            <Badge
              variant={mode === 'words' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setMode('words')}
            >
              Words
            </Badge>
            <Badge
              variant={mode === 'chars' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setMode('chars')}
            >
              Characters
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSwap}
              className="ml-auto"
              disabled={!text1 && !text2}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Swap
            </Button>
          </div>

          {/* Input Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Original Text</Label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label>Modified Text</Label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Paste modified text here..."
                className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total {mode}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.added}</div>
                    <div className="text-sm text-muted-foreground">Added</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{stats.removed}</div>
                    <div className="text-sm text-muted-foreground">Removed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">{stats.unchanged}</div>
                    <div className="text-sm text-muted-foreground">Unchanged</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Diff Display */}
          {diff.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Visual Diff</Label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-muted-foreground">Removed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-muted-foreground">Added</span>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Unified Diff Format</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(unifiedDiff)}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              <textarea
                value={unifiedDiff}
                readOnly
                className="w-full min-h-[200px] p-3 rounded-md border border-border bg-muted text-foreground font-mono text-xs resize-none focus:outline-none"
              />
            </div>
          )}

          {!text1 && !text2 && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <FileText className="h-16 w-16 mb-4 opacity-20" />
              <p>Enter text in both panels to see the differences</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
