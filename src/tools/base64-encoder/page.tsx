import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightLeft, Copy, Check, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { encodeBase64, decodeBase64, encodeFileToBase64, isValidBase64 } from './logic';

export default function Base64EncoderPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  const handleProcess = () => {
    setError('');
    try {
      if (mode === 'encode') {
        const result = encodeBase64(input);
        setOutput(result);
      } else {
        const result = decodeBase64(input);
        setOutput(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.base64Encoder.errors.processingFailed'));
      setOutput('');
    }
  };

  const handleSwapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
    setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileInfo({ name: file.name, size: file.size });

    try {
      const base64 = await encodeFileToBase64(file);
      setInput(base64);
      setOutput(base64);
      setMode('encode');
    } catch {
      setError(t('tools.base64Encoder.errors.failedToReadFile'));
      setFileInfo(null);
    }
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

  const downloadAsFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isValidInput = mode === 'decode' ? isValidBase64(input) : input.length > 0;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('tools.base64Encoder.title')}</h1>
        <p className="text-muted-foreground">
          {t('tools.base64Encoder.description')}
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="text">{t('tools.base64Encoder.text')}</TabsTrigger>
          <TabsTrigger value="file">{t('tools.base64Encoder.file')}</TabsTrigger>
        </TabsList>

        {/* Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {mode === 'encode' ? t('tools.base64Encoder.encodeText') : t('tools.base64Encoder.decodeBase64')}
                  </CardTitle>
                  <CardDescription>
                    {mode === 'encode'
                      ? t('tools.base64Encoder.encodeTextDesc')
                      : t('tools.base64Encoder.decodeTextDesc')}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapMode}
                  title={t('tools.base64Encoder.swapMode')}
                  disabled={!input && !output}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="input">
                    {mode === 'encode' ? t('tools.base64Encoder.plainText') : t('tools.base64Encoder.base64String')}
                  </Label>
                  {mode === 'decode' && input && (
                    <Badge variant={isValidInput ? 'default' : 'destructive'} className="text-xs">
                      {isValidInput ? t('tools.base64Encoder.validBase64') : t('tools.base64Encoder.invalidBase64')}
                    </Badge>
                  )}
                </div>
                <textarea
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    mode === 'encode'
                      ? t('tools.base64Encoder.enterTextToEncode')
                      : t('tools.base64Encoder.enterBase64ToDecode')
                  }
                  className="w-full min-h-[150px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Process Button */}
              <Button
                onClick={handleProcess}
                disabled={!input}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {mode === 'encode' ? t('tools.base64Encoder.encodeToBase64') : t('tools.base64Encoder.decodeFromBase64')}
              </Button>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Output */}
              {output && !error && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="output">
                      {mode === 'encode' ? t('tools.base64Encoder.base64Output') : t('tools.base64Encoder.decodedText')}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(output)}
                      >
                        {copied ? (
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
                      <Button variant="outline" size="sm" onClick={downloadAsFile}>
                        <Download className="w-3 h-3 mr-2" />
                        {t('common.download')}
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 rounded-md border border-border bg-muted max-h-[200px] overflow-y-auto scrollbar-thin">
                    <pre className="font-mono text-sm whitespace-pre-wrap break-all">
                      {output}
                    </pre>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('tools.base64Encoder.length')}: {output.length} {t('common.characters')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Tab */}
        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.base64Encoder.encodeFileToBase64')}</CardTitle>
              <CardDescription>
                {t('tools.base64Encoder.uploadFileDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">{t('tools.base64Encoder.clickToUpload')}</span> {t('tools.base64Encoder.orDragAndDrop')}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('tools.base64Encoder.anyFileTypeSupported')}</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {fileInfo && (
                <div className="p-3 rounded-md bg-accent text-accent-foreground">
                  <p className="font-medium">{fileInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tools.base64Encoder.size')}: {(fileInfo.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {output && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('tools.base64Encoder.base64Output')}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(output)}
                      >
                        {copied ? (
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
                      <Button variant="outline" size="sm" onClick={downloadAsFile}>
                        <Download className="w-3 h-3 mr-2" />
                        {t('common.download')}
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 rounded-md border border-border bg-muted max-h-[300px] overflow-y-auto scrollbar-thin">
                    <pre className="font-mono text-xs whitespace-pre-wrap break-all">
                      {output}
                    </pre>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('tools.base64Encoder.length')}: {output.length} {t('common.characters')} (
                    {(output.length * 0.75 / 1024).toFixed(2)} KB {t('tools.base64Encoder.approximateDecodedSize')})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-border bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">{t('tools.base64Encoder.aboutBase64')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            {t('tools.base64Encoder.aboutDescription')}
          </p>
          <p className="font-medium text-foreground">{t('tools.base64Encoder.commonUseCases')}:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{t('tools.base64Encoder.useCase1')}</li>
            <li>{t('tools.base64Encoder.useCase2')}</li>
            <li>{t('tools.base64Encoder.useCase3')}</li>
            <li>{t('tools.base64Encoder.useCase4')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
