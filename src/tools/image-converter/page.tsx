import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  convertImage,
  formatFileSize,
  getFormatName,
  downloadImage,
  getImageDimensions,
  type ImageFormat,
  type ConversionResult,
} from './logic';

export default function ImageConverterPage() {
  const { t } = useTranslation();
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/png');
  const [quality, setQuality] = useState(0.92);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('tools.imageConverter.errors.invalidImage'));
      return;
    }

    setError('');
    setIsConverting(true);

    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);

      const conversionResult = await convertImage(file, targetFormat, quality);
      setResult(conversionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.imageConverter.errors.conversionFailed'));
      setResult(null);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadImage(result.convertedBlob, result.originalFile.name, targetFormat);
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

  const formats: { value: ImageFormat; label: string; description: string }[] = [
    { value: 'image/png', label: t('tools.imageConverter.formatPNG'), description: t('tools.imageConverter.formatPNGDesc') },
    { value: 'image/jpeg', label: t('tools.imageConverter.formatJPEG'), description: t('tools.imageConverter.formatJPEGDesc') },
    { value: 'image/webp', label: t('tools.imageConverter.formatWebP'), description: t('tools.imageConverter.formatWebPDesc') },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            <div>
              <CardTitle>{t('tools.imageConverter.title')}</CardTitle>
              <CardDescription>{t('tools.imageConverter.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
            <p className="text-lg font-semibold mb-2">{t('tools.imageConverter.dragAndDrop')}</p>
            <p className="text-sm text-muted-foreground">
              {t('tools.imageConverter.supportedFormats')}
            </p>
          </div>

          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('tools.imageConverter.targetFormat')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formats.map((format) => (
                  <Card
                    key={format.value}
                    className={`cursor-pointer transition-all ${
                      targetFormat === format.value
                        ? 'border-2 border-primary bg-primary/5'
                        : 'border hover:border-primary/50'
                    }`}
                    onClick={() => setTargetFormat(format.value)}
                  >
                    <CardContent className="p-4">
                      <div className="font-semibold text-lg mb-1">{format.label}</div>
                      <div className="text-xs text-muted-foreground">{format.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label>{t('tools.imageConverter.quality')}: {Math.round(quality * 100)}%</Label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                  disabled={targetFormat === 'image/png'}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10%</span>
                  <span>100%</span>
                </div>
                {targetFormat === 'image/png' && (
                  <p className="text-xs text-muted-foreground">
                    {t('tools.imageConverter.qualityDesc')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isConverting && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('tools.imageConverter.converting')}</p>
              </div>
            </div>
          )}

          {/* Conversion Result */}
          {result && !isConverting && (
            <div className="space-y-4">
              {/* Conversion Info */}
              <Card className="border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-4 text-center flex-wrap">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {getFormatName(result.originalFormat)}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(result.originalSize)}
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <Badge variant="default" className="mb-2">
                        {getFormatName(result.targetFormat)}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(result.convertedSize)}
                      </div>
                    </div>
                    {dimensions && (
                      <>
                        <div className="w-px h-8 bg-border hidden md:block"></div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('tools.imageConverter.dimensions')}</div>
                          <div className="font-semibold">
                            {dimensions.width} × {dimensions.height}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Image Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t('tools.imageConverter.originalImage')}</CardTitle>
                      <Badge variant="outline">
                        {getFormatName(result.originalFormat)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      <img
                        src={result.originalUrl}
                        alt={t('tools.imageConverter.originalImage')}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground text-center">
                      {formatFileSize(result.originalSize)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t('tools.imageConverter.convertedImage')}</CardTitle>
                      <Badge variant="default">
                        {getFormatName(result.targetFormat)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      <img
                        src={result.convertedUrl}
                        alt={t('tools.imageConverter.convertedImage')}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground text-center">
                      {formatFileSize(result.convertedSize)}
                      {result.convertedSize < result.originalSize && (
                        <span className="text-green-600 ml-2">
                          (-{Math.round(((result.originalSize - result.convertedSize) / result.originalSize) * 100)}%)
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Download Button */}
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-5 w-5 mr-2" />
                {t('tools.imageConverter.downloadConverted')}
              </Button>
            </div>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('tools.imageConverter.formatComparison')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong className="text-foreground">{t('tools.imageConverter.formatPNG')}:</strong>
                <p className="text-muted-foreground">
                  {t('tools.imageConverter.pngDescription')}
                </p>
              </div>
              <div>
                <strong className="text-foreground">{t('tools.imageConverter.formatJPEG')}:</strong>
                <p className="text-muted-foreground">
                  {t('tools.imageConverter.jpgDescription')}
                </p>
              </div>
              <div>
                <strong className="text-foreground">{t('tools.imageConverter.formatWebP')}:</strong>
                <p className="text-muted-foreground">
                  {t('tools.imageConverter.webpDescription')}
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
