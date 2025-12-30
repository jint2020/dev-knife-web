import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Upload, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { generateHash, generateFileHash, type HashAlgorithm, compareHashes } from './logic';

export default function HashGeneratorPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [compareHash, setCompareHash] = useState('');
  const [compareAlgorithm, setCompareAlgorithm] = useState<HashAlgorithm>('SHA-256');

  const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  const handleGenerate = async () => {
    if (!input) return;

    setLoading(true);
    const results: Record<HashAlgorithm, string> = {
      'MD5': '',
      'SHA-1': '',
      'SHA-256': '',
      'SHA-384': '',
      'SHA-512': '',
    };

    try {
      for (const algorithm of algorithms) {
        results[algorithm] = await generateHash(input, algorithm);
      }
      setHashes(results);
    } catch (error) {
      console.error('Hash generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: file.size });
    setLoading(true);

    const results: Record<HashAlgorithm, string> = {
      'MD5': '',
      'SHA-1': '',
      'SHA-256': '',
      'SHA-384': '',
      'SHA-512': '',
    };

    try {
      for (const algorithm of algorithms) {
        results[algorithm] = await generateFileHash(file, algorithm);
      }
      setHashes(results);
      setInput(`File: ${file.name}`);
    } catch (error) {
      console.error('File hash generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isHashMatch = (algorithm: HashAlgorithm) => {
    if (!compareHash || !hashes[algorithm]) return null;
    return compareHashes(hashes[algorithm], compareHash);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hash Generator</h1>
        <p className="text-muted-foreground">
          Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-384, SHA-512) for text and files.
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
        </TabsList>

        {/* Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Hash from Text</CardTitle>
              <CardDescription>Enter text to generate cryptographic hashes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Input Text</Label>
                <textarea
                  id="text-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="w-full min-h-[120px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!input || loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? 'Generating...' : 'Generate Hashes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Tab */}
        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Hash from File</CardTitle>
              <CardDescription>Upload a file to calculate its checksum</CardDescription>
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
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">Any file type supported</p>
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
                    Size: {(fileInfo.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {Object.values(hashes).some(h => h) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Hash Results
            </CardTitle>
            <CardDescription>Cryptographic hash values for your input</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {algorithms.map((algorithm) => (
              <div key={algorithm} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-mono text-sm">{algorithm}</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {hashes[algorithm].length} chars
                    </Badge>
                    {isHashMatch(algorithm) !== null && (
                      <Badge
                        variant={isHashMatch(algorithm) ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {isHashMatch(algorithm) ? '✓ Match' : '✗ No Match'}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(hashes[algorithm], algorithm)}
                    >
                      {copied === algorithm ? (
                        <>
                          <Check className="w-3 h-3 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted">
                  <p className="font-mono text-xs break-all text-foreground">
                    {hashes[algorithm]}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Compare Hash */}
      {Object.values(hashes).some(h => h) && (
        <Card>
          <CardHeader>
            <CardTitle>Compare Hash</CardTitle>
            <CardDescription>Verify a hash matches your input</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="compare-algorithm">Algorithm</Label>
              <select
                id="compare-algorithm"
                value={compareAlgorithm}
                onChange={(e) => setCompareAlgorithm(e.target.value as HashAlgorithm)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                {algorithms.map((alg) => (
                  <option key={alg} value={alg}>
                    {alg}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compare-hash">Hash to Compare</Label>
              <input
                id="compare-hash"
                type="text"
                value={compareHash}
                onChange={(e) => setCompareHash(e.target.value)}
                placeholder="Paste hash to verify..."
                className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {compareHash && hashes[compareAlgorithm] && (
              <div
                className={`p-4 rounded-md ${
                  isHashMatch(compareAlgorithm)
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                <p className="font-medium">
                  {isHashMatch(compareAlgorithm)
                    ? '✓ Hashes match! The data is identical.'
                    : '✗ Hashes do not match! The data is different.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-border bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Hash Algorithms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Security Levels</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>MD5:</strong> 128-bit (deprecated, not secure)</li>
                <li><strong>SHA-1:</strong> 160-bit (deprecated)</li>
                <li><strong>SHA-256:</strong> 256-bit (recommended)</li>
                <li><strong>SHA-384:</strong> 384-bit (high security)</li>
                <li><strong>SHA-512:</strong> 512-bit (highest security)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Common Use Cases</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>File integrity verification</li>
                <li>Password storage (with salt)</li>
                <li>Digital signatures</li>
                <li>Data deduplication</li>
                <li>Blockchain transactions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
