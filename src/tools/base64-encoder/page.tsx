import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { encodeBase64, decodeBase64, encodeFileToBase64, isValidBase64 } from './logic';
import { useToolPersistence } from '@/hooks/useToolPersistence';
import { FileDropZone } from '@/components/common/file-drop-zone';
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function Base64EncoderPage() {
  const { t } = useTranslation();

  // Use persistence hook for input, output, and mode
  const [persistedState, updatePersistedState] = useToolPersistence('base64-encoder', {
    input: '',
    output: '',
    mode: 'encode' as 'encode' | 'decode',
  });

  const { input, output, mode } = persistedState;

  // Local-only states (not persisted)
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  const handleProcess = () => {
    setError('');
    try {
      if (mode === 'encode') {
        const result = encodeBase64(input);
        updatePersistedState({ output: result });
      } else {
        const result = decodeBase64(input);
        updatePersistedState({ output: result });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.base64Encoder.errors.processingFailed'));
      updatePersistedState({ output: '' });
    }
  };

  const handleSwapMode = () => {
    updatePersistedState({
      mode: mode === 'encode' ? 'decode' : 'encode',
      input: output,
      output: input,
    });
    setError('');
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    setFileInfo({ name: file.name, size: file.size });

    try {
      const base64 = await encodeFileToBase64(file);
      updatePersistedState({
        input: base64,
        output: base64,
        mode: 'encode',
      });
    } catch {
      setError(t('tools.base64Encoder.errors.failedToReadFile'));
      setFileInfo(null);
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
    <ToolPage
      title={t('tools.base64Encoder.title')}
      description={t('tools.base64Encoder.description')}
    >
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="text">{t('tools.base64Encoder.text')}</TabsTrigger>
          <TabsTrigger value="file">{t('tools.base64Encoder.file')}</TabsTrigger>
        </TabsList>

        {/* Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <ToolSection
            title={mode === 'encode' ? t('tools.base64Encoder.encodeText') : t('tools.base64Encoder.decodeBase64')}
            description={
              mode === 'encode'
                ? t('tools.base64Encoder.encodeTextDesc')
                : t('tools.base64Encoder.decodeTextDesc')
            }
            actions={
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapMode}
                title={t('tools.base64Encoder.swapMode')}
                disabled={!input && !output}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            }
            contentClassName="space-y-4"
          >
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
                onChange={(e) => updatePersistedState({ input: e.target.value })}
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
                    <CopyButton value={output} />
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
          </ToolSection>
        </TabsContent>

        {/* File Tab */}
        <TabsContent value="file" className="space-y-4">
          <ToolSection
            title={t('tools.base64Encoder.encodeFileToBase64')}
            description={t('tools.base64Encoder.uploadFileDesc')}
            contentClassName="space-y-4"
          >
            <FileDropZone
              onFileSelect={handleFileUpload}
              title={t('tools.base64Encoder.clickToUpload')}
              description={t('tools.base64Encoder.uploadFileDesc')}
              maxSize={10 * 1024 * 1024} // 10MB limit
            />

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
                    <CopyButton value={output} />
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
          </ToolSection>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <ToolSection
        title={t('tools.base64Encoder.aboutBase64')}
        className="border-border bg-muted/50"
        contentClassName="text-sm text-muted-foreground space-y-2"
      >
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
      </ToolSection>
    </ToolPage>
  );
}
