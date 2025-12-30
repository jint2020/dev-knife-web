import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, QrCode as QrCodeIcon, Smartphone, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  generateQRCode,
  generateQRCodeSVG,
  downloadQRCode,
  downloadQRCodeSVG,
  getQRCodeCapacity,
  type QRCodeOptions,
  type ErrorCorrectionLevel,
} from './logic';

export default function QRCodeGeneratorPage() {
  const { t } = useTranslation();
  const [text, setText] = useState('https://example.com');
  const [qrCode, setQrCode] = useState('');
  const [qrCodeSVG, setQrCodeSVG] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [options, setOptions] = useState<QRCodeOptions>({
    errorCorrectionLevel: 'M',
    margin: 4,
    width: 300,
    darkColor: '#000000',
    lightColor: '#ffffff',
  });

  const capacity = getQRCodeCapacity(options.errorCorrectionLevel);

  useEffect(() => {
    if (text) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError(t('tools.qrGenerator.errors.enterText'));
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const [dataUrl, svg] = await Promise.all([
        generateQRCode(text, options),
        generateQRCodeSVG(text, options),
      ]);
      setQrCode(dataUrl);
      setQrCodeSVG(svg);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.qrGenerator.errors.generateFailed'));
      setQrCode('');
      setQrCodeSVG('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPNG = () => {
    if (qrCode) {
      downloadQRCode(qrCode, 'qrcode.png');
    }
  };

  const handleDownloadSVG = () => {
    if (qrCodeSVG) {
      downloadQRCodeSVG(qrCodeSVG, 'qrcode.svg');
    }
  };

  const presets = [
    { label: t('tools.qrGenerator.presetLabels.url'), value: 'https://example.com', icon: LinkIcon },
    { label: t('tools.qrGenerator.presetLabels.email'), value: 'mailto:example@email.com', icon: LinkIcon },
    { label: t('tools.qrGenerator.presetLabels.phone'), value: 'tel:+1234567890', icon: Smartphone },
    { label: t('tools.qrGenerator.presetLabels.sms'), value: 'sms:+1234567890', icon: Smartphone },
    { label: t('tools.qrGenerator.presetLabels.wifi'), value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;', icon: QrCodeIcon },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <QrCodeIcon className="h-6 w-6" />
            <div>
              <CardTitle>{t('tools.qrGenerator.title')}</CardTitle>
              <CardDescription>{t('tools.qrGenerator.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Input & Options */}
            <div className="space-y-4">
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">{t('tools.qrGenerator.textUrl')}</TabsTrigger>
                  <TabsTrigger value="presets">{t('tools.qrGenerator.presets')}</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('tools.qrGenerator.content')}</Label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={t('tools.qrGenerator.enterContent')}
                      className="w-full min-h-[150px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{text.length} {t('tools.qrGenerator.charactersCount')}</span>
                      <span>{t('tools.qrGenerator.maxBytes', { count: capacity.binary })}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="presets" className="space-y-2">
                  <Label>{t('tools.qrGenerator.quickPresets')}</Label>
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setText(preset.value)}
                      >
                        <preset.icon className="h-4 w-4 mr-2" />
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <div className="p-3 mt-3 rounded-md bg-muted text-xs space-y-1">
                    <p className="font-semibold">{t('tools.qrGenerator.wifiFormat')}</p>
                    <code className="block">{t('tools.qrGenerator.wifiFormatCode')}</code>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {t('tools.qrGenerator.wifiFormatDesc')}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={handleGenerate} disabled={isGenerating || !text} className="w-full">
                {isGenerating ? t('tools.qrGenerator.generating') : t('tools.qrGenerator.generateQRCode')}
              </Button>

              {/* Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('tools.qrGenerator.options')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Error Correction Level */}
                  <div className="space-y-2">
                    <Label>{t('tools.qrGenerator.errorCorrectionLevel')}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((level) => (
                        <Button
                          key={level}
                          size="sm"
                          variant={options.errorCorrectionLevel === level ? 'default' : 'outline'}
                          onClick={() => setOptions({ ...options, errorCorrectionLevel: level })}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {options.errorCorrectionLevel === 'L' && t('tools.qrGenerator.lowRecovery')}
                      {options.errorCorrectionLevel === 'M' && t('tools.qrGenerator.mediumRecovery')}
                      {options.errorCorrectionLevel === 'Q' && t('tools.qrGenerator.quartileRecovery')}
                      {options.errorCorrectionLevel === 'H' && t('tools.qrGenerator.highRecovery')}
                    </p>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <Label>{t('tools.qrGenerator.sizePx', { size: options.width })}</Label>
                    <input
                      type="range"
                      min="128"
                      max="1024"
                      step="32"
                      value={options.width}
                      onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>128px</span>
                      <span>1024px</span>
                    </div>
                  </div>

                  {/* Margin */}
                  <div className="space-y-2">
                    <Label>{t('tools.qrGenerator.marginValue', { margin: options.margin })}</Label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={options.margin}
                      onChange={(e) => setOptions({ ...options, margin: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('tools.qrGenerator.darkColor')}</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={options.darkColor}
                          onChange={(e) => setOptions({ ...options, darkColor: e.target.value })}
                          className="h-10 w-full rounded-md border border-border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={options.darkColor}
                          onChange={(e) => setOptions({ ...options, darkColor: e.target.value })}
                          className="h-10 w-24 px-2 rounded-md border border-border font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('tools.qrGenerator.lightColor')}</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={options.lightColor}
                          onChange={(e) => setOptions({ ...options, lightColor: e.target.value })}
                          className="h-10 w-full rounded-md border border-border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={options.lightColor}
                          onChange={(e) => setOptions({ ...options, lightColor: e.target.value })}
                          className="h-10 w-24 px-2 rounded-md border border-border font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Preview & Download */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t('tools.qrGenerator.preview')}</CardTitle>
                    {qrCode && (
                      <Badge variant="outline">
                        {t('tools.qrGenerator.sizeLabel', { width: options.width, height: options.width })}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  {qrCode && !error && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-6 rounded-md bg-muted">
                        <img
                          src={qrCode}
                          alt="Generated QR Code"
                          className="max-w-full h-auto rounded-md"
                          style={{ width: options.width, height: options.width }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleDownloadPNG} variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          {t('tools.qrGenerator.downloadPNG')}
                        </Button>
                        <Button onClick={handleDownloadSVG} variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          {t('tools.qrGenerator.downloadSVG')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {!qrCode && !error && (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                      <QrCodeIcon className="h-16 w-16 mb-4 opacity-20" />
                      <p>{t('tools.qrGenerator.enterTextPrompt')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('tools.qrGenerator.aboutQRCodes')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{t('tools.qrGenerator.errorCorrectionInfo')}</p>
                  <p>
                    <strong>{t('tools.qrGenerator.capacityInfo', { level: options.errorCorrectionLevel })}</strong>
                    <br />
                    {t('tools.qrGenerator.numericCapacity', { count: capacity.numeric })}
                    <br />
                    {t('tools.qrGenerator.alphanumericCapacity', { count: capacity.alphanumeric })}
                    <br />
                    {t('tools.qrGenerator.binaryCapacity', { count: capacity.binary })}
                  </p>
                  <p>{t('tools.qrGenerator.useCases')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
