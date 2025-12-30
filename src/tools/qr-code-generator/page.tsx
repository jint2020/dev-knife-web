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
      setError('Please enter some text');
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
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
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
    { label: 'URL', value: 'https://example.com', icon: LinkIcon },
    { label: 'Email', value: 'mailto:example@email.com', icon: LinkIcon },
    { label: 'Phone', value: 'tel:+1234567890', icon: Smartphone },
    { label: 'SMS', value: 'sms:+1234567890', icon: Smartphone },
    { label: 'WiFi', value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;', icon: QrCodeIcon },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <QrCodeIcon className="h-6 w-6" />
            <div>
              <CardTitle>QR Code Generator</CardTitle>
              <CardDescription>Generate QR codes from text, URLs, or other data</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Input & Options */}
            <div className="space-y-4">
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text/URL</TabsTrigger>
                  <TabsTrigger value="presets">Presets</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text, URL, or data to encode..."
                      className="w-full min-h-[150px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{text.length} characters</span>
                      <span>Max: {capacity.binary} bytes</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="presets" className="space-y-2">
                  <Label>Quick Presets</Label>
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
                    <p className="font-semibold">WiFi Format:</p>
                    <code className="block">WIFI:T:WPA;S:NetworkName;P:Password;;</code>
                    <p className="text-muted-foreground">
                      T = Security type (WPA, WEP, or blank for none)
                      <br />S = Network SSID
                      <br />P = Password
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={handleGenerate} disabled={isGenerating || !text} className="w-full">
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>

              {/* Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Error Correction Level */}
                  <div className="space-y-2">
                    <Label>Error Correction Level</Label>
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
                      {options.errorCorrectionLevel === 'L' && 'Low (7% recovery)'}
                      {options.errorCorrectionLevel === 'M' && 'Medium (15% recovery)'}
                      {options.errorCorrectionLevel === 'Q' && 'Quartile (25% recovery)'}
                      {options.errorCorrectionLevel === 'H' && 'High (30% recovery)'}
                    </p>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <Label>Size: {options.width}px</Label>
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
                    <Label>Margin: {options.margin}</Label>
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
                      <Label>Dark Color</Label>
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
                      <Label>Light Color</Label>
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
                    <CardTitle className="text-lg">Preview</CardTitle>
                    {qrCode && (
                      <Badge variant="outline">
                        {options.width}x{options.width}px
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
                          Download PNG
                        </Button>
                        <Button onClick={handleDownloadSVG} variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download SVG
                        </Button>
                      </div>
                    </div>
                  )}

                  {!qrCode && !error && (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                      <QrCodeIcon className="h-16 w-16 mb-4 opacity-20" />
                      <p>Enter text and click Generate to create a QR code</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About QR Codes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Error Correction:</strong> Higher levels allow the QR code to be read 
                    even if partially damaged, but reduce data capacity.
                  </p>
                  <p>
                    <strong>Capacity (Level {options.errorCorrectionLevel}):</strong>
                    <br />
                    Numeric: {capacity.numeric} digits
                    <br />
                    Alphanumeric: {capacity.alphanumeric} chars
                    <br />
                    Binary: {capacity.binary} bytes
                  </p>
                  <p>
                    <strong>Use Cases:</strong> URLs, contact info, WiFi credentials, payment info, 
                    event tickets, product tracking, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
