import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, ImageDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  compressImage,
  formatFileSize,
  getImageDimensions,
  downloadImage,
  type CompressionOptions,
  type CompressionResult,
} from './logic';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function ImageCompressorPage() {
  const { t } = useTranslation();
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<CompressionOptions>({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.8,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('tools.imageCompressor.errors.invalidFile'));
      return;
    }

    setError('');
    setIsCompressing(true);

    try {
      const dimensions = await getImageDimensions(file);
      setOriginalDimensions(dimensions);

      const compressionResult = await compressImage(file, options);
      setResult(compressionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.imageCompressor.errors.compressionFailed'));
      setResult(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const filename = result.originalFile.name.replace(/\.[^.]+$/, '_compressed$&');
      downloadImage(result.compressedFile, filename);
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
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  return (
    <ToolPage
      title={t('tools.imageCompressor.title')}
      description={t('tools.imageCompressor.description')}
    >
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-semibold mb-2">{t('tools.imageCompressor.uploadPrompt')}</p>
            <p className="text-sm text-muted-foreground">
              {t('tools.imageCompressor.supportedFormats')}
            </p>
          </div>

          {/* Compression Options */}
          <ToolSection
            title={t('tools.imageCompressor.compressionOptions')}
            contentClassName="space-y-4"
          >
            <div className="space-y-2">
              <Label>{t('tools.imageCompressor.maxSizeMB', { size: options.maxSizeMB })}</Label>
              <Slider
                value={[options.maxSizeMB]}
                onValueChange={(value) => setOptions({ ...options, maxSizeMB: value[0] })}
                min={0.1}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.1 MB</span>
                <span>10 MB</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('tools.imageCompressor.maxWidthHeight', { size: options.maxWidthOrHeight })}</Label>
              <Slider
                value={[options.maxWidthOrHeight]}
                onValueChange={(value) => setOptions({ ...options, maxWidthOrHeight: value[0] })}
                min={640}
                max={4096}
                step={128}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>640px</span>
                <span>4096px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('tools.imageCompressor.quality', { quality: Math.round(options.quality * 100) })}</Label>
              <Slider
                value={[options.quality]}
                onValueChange={(value) => setOptions({ ...options, quality: value[0] })}
                min={0.1}
                max={1}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id="use-web-worker"
                checked={options.useWebWorker}
                onCheckedChange={(checked) => setOptions({ ...options, useWebWorker: checked === true })}
              />
              <Label htmlFor="use-web-worker" className="text-sm cursor-pointer">
                {t('tools.imageCompressor.useWebWorker')}
              </Label>
            </div>
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
                <p className="text-muted-foreground">{t('tools.imageCompressor.compressing')}</p>
              </div>
            </div>
          )}

          {/* Comparison Result */}
          {result && !isCompressing && (
            <div className="space-y-4">
              {/* Stats */}
              <ToolSection
                className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20"
                contentClassName="pt-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.imageCompressor.originalSize')}</div>
                    <div className="text-xl font-bold">{formatFileSize(result.originalSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.imageCompressor.compressedSize')}</div>
                    <div className="text-xl font-bold text-green-600">{formatFileSize(result.compressedSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.imageCompressor.saved')}</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatFileSize(result.originalSize - result.compressedSize)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('tools.imageCompressor.compression')}</div>
                    <div className="text-xl font-bold text-green-600">
                      {result.compressionRatio.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </ToolSection>

              {/* Image Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToolSection
                  title={
                    <div className="flex items-center justify-between">
                      <span>{t('tools.imageCompressor.original')}</span>
                      {originalDimensions && (
                        <Badge variant="outline">
                          {originalDimensions.width} × {originalDimensions.height}
                        </Badge>
                      )}
                    </div>
                  }
                >
                  <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={result.originalUrl}
                      alt="Original"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground text-center">
                    {formatFileSize(result.originalSize)}
                  </div>
                </ToolSection>

                <ToolSection
                  title={
                    <div className="flex items-center justify-between">
                      <span>{t('tools.imageCompressor.compressed')}</span>
                      <Badge variant="default" className="bg-green-600">
                        -{result.compressionRatio.toFixed(0)}%
                      </Badge>
                    </div>
                  }
                >
                  <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={result.compressedUrl}
                      alt="Compressed"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground text-center">
                    {formatFileSize(result.compressedSize)}
                  </div>
                </ToolSection>
              </div>

              {/* Download Button */}
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-5 w-5 mr-2" />
                {t('tools.imageCompressor.downloadCompressedImage')}
              </Button>
            </div>
          )}

          {/* Info Section */}
          <ToolSection
            title={
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t('tools.imageCompressor.aboutCompression')}
              </div>
            }
            className="border-border bg-muted/50"
            contentClassName="text-sm text-muted-foreground space-y-2"
          >
            <p>{t('tools.imageCompressor.compressionInfo')}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t('tools.imageCompressor.qualityInfo')}</li>
              <li>{t('tools.imageCompressor.maxSizeInfo')}</li>
              <li>{t('tools.imageCompressor.maxDimensionsInfo')}</li>
              <li><strong>{t('tools.imageCompressor.privacyNote')}</strong></li>
            </ul>
          </ToolSection>
        </ToolPage>
      );
    }
