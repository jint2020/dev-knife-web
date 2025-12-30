import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
              <CardTitle>{t('tools.urlEncoder.title')}</CardTitle>
              <CardDescription>{t('tools.urlEncoder.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="encode">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">{t('tools.urlEncoder.encodeDecode')}</TabsTrigger>
              <TabsTrigger value="parse">{t('tools.urlEncoder.parseUrl')}</TabsTrigger>
            </TabsList>

            {/* Encode/Decode Tab */}
            <TabsContent value="encode" className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Label>{t('tools.urlEncoder.mode')}:</Label>
                <Badge
                  variant={mode === 'component' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setMode('component')}
                >
                  {t('tools.urlEncoder.component')}
                </Badge>
                <Badge
                  variant={mode === 'full' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setMode('full')}
                >
                  {t('tools.urlEncoder.full')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('tools.urlEncoder.inputLabel')}</Label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleEncode}>
                        {t('common.convert')} →
                      </Button>
                      <Button size="sm" onClick={handleDecode} variant="secondary">
                        ← {t('tools.base64Encoder.decode')}
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('tools.urlEncoder.inputPlaceholder')}
                    className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Output Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('tools.urlEncoder.outputLabel')}</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSwap}
                        disabled={!input || !output}
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-1" />
                        {t('tools.urlEncoder.swap')}
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
                    placeholder={t('tools.urlEncoder.outputLabel')}
                    className="w-full min-h-[300px] p-3 rounded-md border border-border bg-muted text-foreground font-mono text-sm resize-none focus:outline-none"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="p-3 rounded-md bg-muted text-sm space-y-1">
                <div className="font-semibold">{t('tools.urlEncoder.tips')}:</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>{t('tools.urlEncoder.component')}</strong>: {t('tools.urlEncoder.componentDesc')}</li>
                  <li><strong>{t('tools.urlEncoder.full')}</strong>: {t('tools.urlEncoder.fullDesc')}</li>
                </ul>
              </div>
            </TabsContent>

            {/* Parse URL Tab */}
            <TabsContent value="parse" className="space-y-4">
              <div className="space-y-2">
                <Label>{t('tools.urlEncoder.parseUrl')}</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('tools.urlEncoder.inputPlaceholder')}
                    className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {input && (
                    <Badge variant={isValidUrl(input) ? 'default' : 'destructive'}>
                      {isValidUrl(input) ? t('tools.base64Encoder.validBase64') : t('tools.base64Encoder.invalidBase64')}
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
                        {t('tools.urlEncoder.urlInfo')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 font-mono text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[100px]">{t('tools.urlEncoder.protocol')}:</span>
                          <span className="text-muted-foreground break-all">{urlInfo.protocol}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[100px]">{t('tools.urlEncoder.hostname')}:</span>
                          <span className="text-muted-foreground break-all">{urlInfo.hostname}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[100px]">{t('tools.urlEncoder.pathname')}:</span>
                          <span className="text-muted-foreground break-all">{urlInfo.pathname}</span>
                        </div>
                        {urlInfo.search && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[100px]">{t('tools.urlEncoder.search')}:</span>
                            <span className="text-muted-foreground break-all">{urlInfo.search}</span>
                          </div>
                        )}
                        {urlInfo.hash && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[100px]">{t('tools.urlEncoder.hash')}:</span>
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
                        <CardTitle className="text-lg">{t('tools.urlEncoder.queryParams')}</CardTitle>
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
                  {t('tools.urlEncoder.invalidUrl')}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
