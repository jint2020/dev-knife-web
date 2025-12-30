import { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  generateLorem,
  getWordCount,
  getCharCount,
  getSentenceCount,
  getParagraphCount,
} from './logic';

export default function LoremIpsumPage() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    return generateLorem(type, count, startWithLorem);
  }, [type, count, startWithLorem]);

  const handleGenerate = () => {
    // Force re-render by updating one of the dependencies
    setStartWithLorem(prev => prev);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const stats = output
    ? {
        words: getWordCount(output),
        characters: getCharCount(output),
        sentences: getSentenceCount(output),
        paragraphs: getParagraphCount(output),
      }
    : null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle>Lorem Ipsum Generator</CardTitle>
              <CardDescription>Generate placeholder text for design and development mockups</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Options */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Generate</Label>
                <div className="flex gap-2">
                  <Badge
                    variant={type === 'paragraphs' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setType('paragraphs')}
                  >
                    Paragraphs
                  </Badge>
                  <Badge
                    variant={type === 'sentences' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setType('sentences')}
                  >
                    Sentences
                  </Badge>
                  <Badge
                    variant={type === 'words' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setType('words')}
                  >
                    Words
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Count: {count}</Label>
                <input
                  type="range"
                  min="1"
                  max={type === 'words' ? 500 : type === 'sentences' ? 50 : 20}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>{type === 'words' ? 500 : type === 'sentences' ? 50 : 20}</span>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Start with "Lorem ipsum"</span>
              </label>

              <Button onClick={handleGenerate} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          {stats && (
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stats.paragraphs}</div>
                    <div className="text-sm text-muted-foreground">Paragraphs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.sentences}</div>
                    <div className="text-sm text-muted-foreground">Sentences</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.words}</div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.characters}</div>
                    <div className="text-sm text-muted-foreground">Characters</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Text</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                disabled={!output}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full min-h-[400px] p-3 rounded-md border border-border bg-muted text-foreground text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Info */}
          <div className="p-3 rounded-md bg-muted text-sm space-y-1">
            <div className="font-semibold">About Lorem Ipsum:</div>
            <p className="text-muted-foreground">
              Lorem Ipsum is placeholder text used in the printing and typesetting industry since the 1500s. 
              It helps designers and developers visualize how actual content will look in their layouts without 
              being distracted by readable content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
