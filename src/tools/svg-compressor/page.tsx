import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, FileCode, Code, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  compressSVG,
  readFileAsText,
  formatFileSize,
  downloadSVG,
  isValidSVG,
  DEFAULT_OPTIONS,
  type CompressionOptions,
  type CompressionResult,
} from './logic';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function SVGCompressorPage() {
  const { t } = useTranslation();
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [originalFilename, setOriginalFilename] = useState('');
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_OPTIONS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg')) {
      setError(t('tools.svgCompressor.errors.invalidSVG'));
      return;
    }

    setOriginalFilename(file.name);
    setError('');
    setIsCompressing(true);

    try {
      const svgContent = await readFileAsText(file);

      if (!isValidSVG(svgContent)) {
        setError(t('tools.svgCompressor.invalidSVG'));
        setResult(null);
        return;
      }

      const compressionResult = await compressSVG(svgContent, options);
      setResult(compressionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.svgCompressor.errors.compressionFailed'));
      setResult(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleTextCompress = async () => {
    const svgContent = textInputRef.current?.value || '';

    if (!svgContent.trim()) {
      setError(t('tools.svgCompressor.errors.emptySVG'));
      return;
    }

    if (!isValidSVG(svgContent)) {
      setError(t('tools.svgCompressor.errors.invalidSVGContent'));
      return;
    }

    setOriginalFilename('svg-file.svg');
    setError('');
    setIsCompressing(true);

    try {
      const compressionResult = await compressSVG(svgContent, options);
      setResult(compressionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.svgCompressor.errors.compressionFailed'));
      setResult(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadSVG(result.compressedSvg, originalFilename);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.svg')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const toggleAllOptions = (enabled: boolean) => {
    const newOptions = { ...options };
    Object.keys(newOptions).forEach((key) => {
      newOptions[key as keyof CompressionOptions] = enabled;
    });
    setOptions(newOptions);
  };

  return (
    <ToolPage
      title={t('tools.svgCompressor.title')}
      description={t('tools.svgCompressor.description')}
    >
      <Tabs defaultValue="file">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">{t('tools.svgCompressor.uploadFile')}</TabsTrigger>
              <TabsTrigger value="text">{t('tools.svgCompressor.pasteCode')}</TabsTrigger>
            </TabsList>

            {/* File Upload Tab */}
            <TabsContent value="file" className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">{t('tools.svgCompressor.dragAndDrop')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('tools.svgCompressor.onlySVG')}
                </p>
              </div>
            </TabsContent>

            {/* Text Input Tab */}
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label>{t('tools.svgCompressor.pasteSVG')}</Label>
                <textarea
                  ref={textInputRef}
                  placeholder={t('tools.svgCompressor.pastePlaceholder')}
                  className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button onClick={handleTextCompress} className="w-full">
                {t('tools.svgCompressor.compressSVG')}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Compression Options */}
          <ToolSection
            title={
              <div className="flex items-center justify-between w-full">
                <span>{t('tools.svgCompressor.options')}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleAllOptions(true)}>
                    {t('tools.svgCompressor.enableAll')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleAllOptions(false)}>
                    {t('tools.svgCompressor.disableAll')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setOptions(DEFAULT_OPTIONS)}>
                    {t('common.reset')}
                  </Button>
                </div>
              </div>
            }
            contentClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto"
          >
            {(Object.keys(options) as Array<keyof CompressionOptions>).map((key) => (
              <div key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  id={`option-${key}`}
                  checked={options[key]}
                  onCheckedChange={(checked) => setOptions({ ...options, [key]: checked === true })}
                />
                <Label
                  htmlFor={`option-${key}`}
                  className="text-xs cursor-pointer"
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </Label>
              </div>
            ))}
          </ToolSection>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isCompressing && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('tools.svgCompressor.compressing')}</p>
              </div>
            </div>
          )}

          {/* Compression Result */}
          {result && !isCompressing && (
            <div className="space-y-4">
              {/* Stats */}
              <ToolSection
                className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20"
                contentClassName="pt-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.svgCompressor.originalSize')}</div>
                    <div className="text-xl font-bold">{formatFileSize(result.originalSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.svgCompressor.compressedSize')}</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatFileSize(result.compressedSize)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.svgCompressor.saved')}</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatFileSize(result.originalSize - result.compressedSize)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.svgCompressor.compression')}</div>
                    <div className="text-xl font-bold text-green-600">
                      {result.compressionRatio.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </ToolSection>

              {/* SVG Preview and Code */}
              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    {t('tools.svgCompressor.preview')}
                  </TabsTrigger>
                  <TabsTrigger value="original">
                    <Code className="h-4 w-4 mr-2" />
                    {t('tools.svgCompressor.originalSVG')}
                  </TabsTrigger>
                  <TabsTrigger value="compressed">
                    <Code className="h-4 w-4 mr-2" />
                    {t('tools.svgCompressor.compressedSVG')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToolSection
                      title={
                        <div className="flex items-center justify-between w-full">
                          <span>{t('tools.svgCompressor.original')}</span>
                          <Badge variant="outline">{formatFileSize(result.originalSize)}</Badge>
                        </div>
                      }
                    >
                      <div
                        className="min-h-[200px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-md border flex items-center justify-center p-6 overflow-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: result.originalSvg }}
                      />
                    </ToolSection>

                    <ToolSection
                      title={
                        <div className="flex items-center justify-between w-full">
                          <span>{t('tools.svgCompressor.compressed')}</span>
                          <Badge variant="default" className="bg-green-600">
                            {formatFileSize(result.compressedSize)}
                          </Badge>
                        </div>
                      }
                    >
                      <div
                        className="min-h-[200px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-md border flex items-center justify-center p-6 overflow-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: result.compressedSvg }}
                      />
                    </ToolSection>
                  </div>
                </TabsContent>

                <TabsContent value="original">
                  <textarea
                    value={result.originalSvg}
                    readOnly
                    className="w-full min-h-[400px] p-3 rounded-md border border-border bg-muted text-foreground font-mono text-xs resize-none focus:outline-none"
                  />
                </TabsContent>

                <TabsContent value="compressed">
                  <textarea
                    value={result.compressedSvg}
                    readOnly
                    className="w-full min-h-[400px] p-3 rounded-md border border-border bg-muted text-foreground font-mono text-xs resize-none focus:outline-none"
                  />
                </TabsContent>
              </Tabs>

              {/* Download Button */}
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-5 w-5 mr-2" />
                {t('tools.svgCompressor.downloadCompressed')}
              </Button>
            </div>
          )}

          {/* Info Section */}
          <ToolSection
            title={t('tools.svgCompressor.aboutTitle')}
            className="border-border bg-muted/50"
            contentClassName="text-sm text-muted-foreground space-y-2"
          >
            <p>
              {t('tools.svgCompressor.aboutDescription')}
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t('tools.svgCompressor.benefit1')}</li>
              <li>{t('tools.svgCompressor.benefit2')}</li>
              <li>{t('tools.svgCompressor.benefit3')}</li>
              <li>{t('tools.svgCompressor.benefit4')}</li>
              <li>{t('tools.svgCompressor.benefit5')}</li>
            </ul>
            <p className="mt-2">
              <strong>{t('tools.svgCompressor.noteLabel')}:</strong> {t('tools.svgCompressor.noteText')}
            </p>
          </ToolSection>
        </ToolPage>
      );
    }
