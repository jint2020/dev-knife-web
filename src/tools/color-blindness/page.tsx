import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Eye, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  applyColorBlindnessFilter,
  downloadFilteredImage,
  COLOR_BLINDNESS_FILTERS,
  type ColorBlindnessType,
} from './logic';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function ColorBlindnessPage() {
  const { t } = useTranslation();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [filteredImages, setFilteredImages] = useState<Record<ColorBlindnessType, string>>({} as Record<ColorBlindnessType, string>);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<ColorBlindnessType>('protanopia');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('tools.colorBlindness.errors.invalidFile'));
      return;
    }

    setError('');
    setIsProcessing(true);
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));

    try {
      const types = Object.keys(COLOR_BLINDNESS_FILTERS) as ColorBlindnessType[];
      const results: Record<ColorBlindnessType, string> = {} as Record<ColorBlindnessType, string>;

      for (const type of types) {
        const filtered = await applyColorBlindnessFilter(file, type);
        results[type] = filtered;
      }

      setFilteredImages(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.colorBlindness.errors.processingFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (type: ColorBlindnessType) => {
    if (filteredImages[type] && originalFile) {
      downloadFilteredImage(filteredImages[type], originalFile.name, type);
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

  const filterTypes = (Object.keys(COLOR_BLINDNESS_FILTERS) as ColorBlindnessType[]).filter(
    type => type !== 'normal'
  );

  return (
    <ToolPage
      title={t('tools.colorBlindness.title')}
      description={t('tools.colorBlindness.description')}
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
            <p className="text-lg font-semibold mb-2">{t('tools.colorBlindness.uploadPrompt')}</p>
            <p className="text-sm text-muted-foreground">{t('tools.colorBlindness.uploadDesc')}</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isProcessing && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('tools.colorBlindness.processing')}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {originalUrl && !isProcessing && Object.keys(filteredImages).length > 0 && (
            <div className="space-y-4">
              {/* Filter Type Selector */}
              <ToolSection
                title={t('tools.colorBlindness.selectType')}
                contentClassName="space-y-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filterTypes.map((type) => {
                    const info = COLOR_BLINDNESS_FILTERS[type];
                    return (
                      <Button
                        key={type}
                        variant={selectedType === type ? 'default' : 'outline'}
                        onClick={() => setSelectedType(type)}
                        className="h-auto flex-col items-start p-3"
                      >
                        <div className="font-semibold text-sm">{info.name}</div>
                        <div className="text-xs text-left opacity-70">{info.prevalence}</div>
                      </Button>
                    );
                  })}
                </div>
              </ToolSection>

              {/* Comparison View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <ToolSection
                  title={
                    <div className="flex items-center justify-between">
                      <span>{t('tools.colorBlindness.normalVision')}</span>
                      <Badge variant="outline">{t('tools.colorBlindness.originalLabel')}</Badge>
                    </div>
                  }
                >
                  <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </ToolSection>

                {/* Filtered */}
                <ToolSection
                  title={
                    <div className="flex items-center justify-between">
                      <span>
                        {COLOR_BLINDNESS_FILTERS[selectedType].name}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(selectedType)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('common.download')}
                      </Button>
                    </div>
                  }
                  contentClassName="space-y-2"
                >
                  <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={filteredImages[selectedType]}
                      alt={COLOR_BLINDNESS_FILTERS[selectedType].name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {COLOR_BLINDNESS_FILTERS[selectedType].description}
                  </p>
                </ToolSection>
              </div>

              {/* Grid View of All Types */}
              <ToolSection
                title={t('tools.colorBlindness.allTypes')}
                contentClassName="space-y-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filterTypes.map((type) => {
                    const info = COLOR_BLINDNESS_FILTERS[type];
                    return (
                      <div
                        key={type}
                        className="cursor-pointer"
                        onClick={() => setSelectedType(type)}
                      >
                        <div className="aspect-video bg-muted rounded-md overflow-hidden mb-2 border-2 border-transparent hover:border-primary transition-colors">
                          <img
                            src={filteredImages[type]}
                            alt={info.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm font-semibold">{info.name}</div>
                        <div className="text-xs text-muted-foreground">{info.prevalence}</div>
                      </div>
                    );
                  })}
                </div>
              </ToolSection>
            </div>
          )}

          {/* Info Section */}
          <ToolSection
            title={
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t('tools.colorBlindness.aboutColorBlindness')}
              </div>
            }
            className="border-border bg-muted/50"
            contentClassName="space-y-3 text-sm"
          >
            <div>
              <strong className="text-foreground">{t('tools.colorBlindness.redGreenTitle')}</strong>
              <p className="text-muted-foreground">{t('tools.colorBlindness.redGreenDesc')}</p>
            </div>
            <div>
              <strong className="text-foreground">{t('tools.colorBlindness.blueYellowTitle')}</strong>
              <p className="text-muted-foreground">{t('tools.colorBlindness.blueYellowDesc')}</p>
            </div>
            <div>
              <strong className="text-foreground">{t('tools.colorBlindness.totalTitle')}</strong>
              <p className="text-muted-foreground">{t('tools.colorBlindness.totalDesc')}</p>
            </div>
            <div>
              <strong className="text-foreground">{t('tools.colorBlindness.whyMattersTitle')}</strong>
              <p className="text-muted-foreground">{t('tools.colorBlindness.whyMattersDesc')}</p>
            </div>
          </ToolSection>
        </ToolPage>
      );
    }
