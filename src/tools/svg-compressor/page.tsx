import { useState, useRef } from 'react';
import { Upload, Download, FileCode, Code, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

export default function SVGCompressorPage() {
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
      setError('Please select a valid SVG file');
      return;
    }

    setOriginalFilename(file.name);
    setError('');
    setIsCompressing(true);

    try {
      const svgContent = await readFileAsText(file);
      
      if (!isValidSVG(svgContent)) {
        setError('Invalid SVG file');
        setResult(null);
        return;
      }

      const compressionResult = await compressSVG(svgContent, options);
      setResult(compressionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compress SVG');
      setResult(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleTextCompress = async () => {
    const svgContent = textInputRef.current?.value || '';
    
    if (!svgContent.trim()) {
      setError('Please enter SVG content');
      return;
    }

    if (!isValidSVG(svgContent)) {
      setError('Invalid SVG content');
      return;
    }

    setOriginalFilename('svg-file.svg');
    setError('');
    setIsCompressing(true);

    try {
      const compressionResult = await compressSVG(svgContent, options);
      setResult(compressionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compress SVG');
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
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            <div>
              <CardTitle>SVG Compressor</CardTitle>
              <CardDescription>Optimize and compress SVG files to reduce file size</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="file">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="text">Paste SVG</TabsTrigger>
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
                <p className="text-lg font-semibold mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  Only SVG files are supported
                </p>
              </div>
            </TabsContent>

            {/* Text Input Tab */}
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label>SVG Content</Label>
                <textarea
                  ref={textInputRef}
                  placeholder="Paste your SVG code here..."
                  className="w-full min-h-[300px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button onClick={handleTextCompress} className="w-full">
                Compress SVG
              </Button>
            </TabsContent>
          </Tabs>

          {/* Compression Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Compression Options</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleAllOptions(true)}>
                    Enable All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleAllOptions(false)}>
                    Disable All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setOptions(DEFAULT_OPTIONS)}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
                {(Object.keys(options) as Array<keyof CompressionOptions>).map((key) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-xs">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </label>
                ))}
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
          {isCompressing && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Compressing SVG...</p>
              </div>
            </div>
          )}

          {/* Compression Result */}
          {result && !isCompressing && (
            <div className="space-y-4">
              {/* Stats */}
              <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Original Size</div>
                      <div className="text-xl font-bold">{formatFileSize(result.originalSize)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Compressed Size</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatFileSize(result.compressedSize)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Saved</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatFileSize(result.originalSize - result.compressedSize)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Compression</div>
                      <div className="text-xl font-bold text-green-600">
                        {result.compressionRatio.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SVG Preview and Code */}
              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="original">
                    <Code className="h-4 w-4 mr-2" />
                    Original
                  </TabsTrigger>
                  <TabsTrigger value="compressed">
                    <Code className="h-4 w-4 mr-2" />
                    Compressed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Original</CardTitle>
                          <Badge variant="outline">{formatFileSize(result.originalSize)}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="min-h-[200px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-md border flex items-center justify-center p-6 overflow-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full"
                          dangerouslySetInnerHTML={{ __html: result.originalSvg }}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Compressed</CardTitle>
                          <Badge variant="default" className="bg-green-600">
                            {formatFileSize(result.compressedSize)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="min-h-[200px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-md border flex items-center justify-center p-6 overflow-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full"
                          dangerouslySetInnerHTML={{ __html: result.compressedSvg }}
                        />
                      </CardContent>
                    </Card>
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
                Download Compressed SVG
              </Button>
            </div>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About SVG Optimization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                SVG optimization removes unnecessary data from SVG files without affecting visual quality:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Removes metadata, comments, and hidden elements</li>
                <li>Simplifies and merges paths</li>
                <li>Optimizes numeric values and transforms</li>
                <li>Cleans up attributes and IDs</li>
                <li>Minifies styles and converts colors to shorter formats</li>
              </ul>
              <p className="mt-2">
                <strong>Note:</strong> Some optimizations may slightly change the visual appearance. 
                Always preview the result before using in production.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
