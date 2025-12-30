import { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Link as LinkIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  encodeUrl,
  decodeUrl,
  encodeFullUrl,
  decodeFullUrl,
  parseUrl,
  isValidUrl,
} from './logic';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'component' | 'full'>('component');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      const encoded = mode === 'component' ? encodeUrl(input) : encodeFullUrl(input);
      setOutput(encoded);
    } catch (err) {
      setOutput('Error: ' + (err instanceof Error ? err.message : 'Encoding failed'));
    }
  };

  const handleDecode = () => {
    try {
      const decoded = mode === 'component' ? decodeUrl(input) : decodeFullUrl(input);
      setOutput(decoded);
    } catch (err) {
      setOutput('Error: ' + (err instanceof Error ? err.message : 'Decoding failed'));
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
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

  const urlInfo = input && isValidUrl(input) ? parseUrl(input) : null;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6" />
            <div>
              <CardTitle>URL Encoder/Decoder</CardTitle>
              <CardDescription>Encode and decode URLs with support for query parameters</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="encode">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode/Decode</TabsTrigger>
              <TabsTrigger value="parse">Parse URL</TabsTrigger>
            </TabsList>

            {/* Encode/Decode Tab */}
            <TabsContent value="encode" className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Label>Mode:</Label>
                <Badge 
                  variant={mode === 'component' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setMode('component')}
                >
                  Component (encodeURIComponent)
                </Badge>
                <Badge 
                  variant={mode === 'full' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setMode('full')}
                >
                  Full URL (encodeURI)
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Input</Label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleEncode}>
                        Encode →
                      </Button>
                      <Button size="sm" onClick={handleDecode} variant="secondary">
                        ← Decode
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'component' 
                      ? 'Enter text to encode/decode (e.g., Hello World!)' 
                      : 'Enter full URL (e.g., https://example.com/path?q=hello world)'
                    }
                    className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Output Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Output</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSwap}
                        disabled={!input || !output}
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-1" />
                        Swap
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(output)}
                        disabled={!output}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Encoded/decoded output will appear here"
                    className="w-full min-h-[300px] p-3 rounded-md border border-border bg-muted text-foreground font-mono text-sm resize-none focus:outline-none"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="p-3 rounded-md bg-muted text-sm space-y-1">
                <div className="font-semibold">Tips:</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Component mode</strong>: Use for encoding query parameters, path segments, or individual text</li>
                  <li><strong>Full URL mode</strong>: Use for encoding complete URLs while preserving special characters like :, /, ?, #</li>
                  <li>Characters like spaces become <code className="text-xs bg-background px-1 py-0.5 rounded">%20</code> in component mode or <code className="text-xs bg-background px-1 py-0.5 rounded">%20</code> in full mode</li>
                </ul>
              </div>
            </TabsContent>

            {/* Parse URL Tab */}
            <TabsContent value="parse" className="space-y-4">
              <div className="space-y-2">
                <Label>URL to Parse</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="https://example.com/path?param1=value1&param2=value2#section"
                    className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {input && (
                    <Badge variant={isValidUrl(input) ? 'default' : 'destructive'}>
                      {isValidUrl(input) ? 'Valid' : 'Invalid'}
                    </Badge>
                  )}
                </div>
              </div>

              {urlInfo && (
                <div className="space-y-4">
                  {/* URL Components */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        URL Components
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 font-mono text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[100px]">Protocol:</span>
                          <span className="text-muted-foreground break-all">{urlInfo.protocol}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[100px]">Hostname:</span>
                          <span className="text-muted-foreground break-all">{urlInfo.hostname}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[100px]">Pathname:</span>
                          <span className="text-muted-foreground break-all">{urlInfo.pathname}</span>
                        </div>
                        {urlInfo.search && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[100px]">Search:</span>
                            <span className="text-muted-foreground break-all">{urlInfo.search}</span>
                          </div>
                        )}
                        {urlInfo.hash && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[100px]">Hash:</span>
                            <span className="text-muted-foreground break-all">{urlInfo.hash}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Query Parameters */}
                  {Object.keys(urlInfo.params).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Query Parameters</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(urlInfo.params).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2 p-2 rounded-md bg-muted font-mono text-sm">
                              <span className="font-semibold">{key}:</span>
                              <span className="text-muted-foreground break-all">{value}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="ml-auto h-6 w-6 p-0"
                                onClick={() => copyToClipboard(value)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {!urlInfo && input && (
                <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                  Invalid URL format. Please enter a valid URL starting with http:// or https://
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
