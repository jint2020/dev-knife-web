import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { generateHash, generateFileHash, type HashAlgorithm, compareHashes } from './logic';
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

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


  const isHashMatch = (algorithm: HashAlgorithm) => {
    if (!compareHash || !hashes[algorithm]) return null;
    return compareHashes(hashes[algorithm], compareHash);
  };

  return (
    <ToolPage
      title={t('tools.hashGenerator.title')}
      description={t('tools.hashGenerator.description')}
    >
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="text">{t('tools.hashGenerator.text')}</TabsTrigger>
          <TabsTrigger value="file">{t('tools.hashGenerator.file')}</TabsTrigger>
        </TabsList>

        {/* Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <ToolSection
            title={t('tools.hashGenerator.generateFromText')}
            description={t('tools.hashGenerator.enterText')}
            contentClassName="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="text-input">{t('tools.hashGenerator.inputLabel')}</Label>
              <textarea
                id="text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('tools.hashGenerator.inputPlaceholder')}
                className="w-full min-h-[120px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!input || loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? t('common.loading') : t('tools.hashGenerator.generateHashes')}
            </Button>
          </ToolSection>
        </TabsContent>

        {/* File Tab */}
        <TabsContent value="file" className="space-y-4">
          <ToolSection
            title={t('tools.hashGenerator.generateFromFile')}
            description={t('tools.hashGenerator.uploadFileDesc')}
            contentClassName="space-y-4"
          >
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
                  {t('tools.hashGenerator.fileSize')}: {(fileInfo.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </ToolSection>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {Object.values(hashes).some(h => h) && (
        <ToolSection
          title={
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {t('tools.hashGenerator.hashes')}
            </div>
          }
          description={t('tools.hashGenerator.hashResults')}
          contentClassName="space-y-3"
        >
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
                      {isHashMatch(algorithm) ? `✓ ${t('tools.hashGenerator.match')}` : `✗ ${t('tools.hashGenerator.noMatch')}`}
                    </Badge>
                  )}
                  <CopyButton value={hashes[algorithm]} variant="ghost" size="sm" />
                </div>
              </div>
              <div className="p-3 rounded-md border border-border bg-muted">
                <p className="font-mono text-xs break-all text-foreground">
                  {hashes[algorithm]}
                </p>
              </div>
            </div>
          ))}
        </ToolSection>
      )}

      {/* Compare Hash */}
      {Object.values(hashes).some(h => h) && (
        <ToolSection
          title={t('tools.hashGenerator.compare')}
          description={t('tools.hashGenerator.verifyHash')}
          contentClassName="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="compare-algorithm">{t('tools.hashGenerator.algorithm')}</Label>
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
            <Label htmlFor="compare-hash">{t('tools.hashGenerator.compareHash')}</Label>
            <input
              id="compare-hash"
              type="text"
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder={t('tools.hashGenerator.compareHashPlaceholder')}
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
                  ? `✓ ${t('tools.hashGenerator.hashesMatch')}`
                  : `✗ ${t('tools.hashGenerator.hashesNoMatch')}`}
              </p>
            </div>
          )}
        </ToolSection>
      )}

      {/* Info Section */}
      <ToolSection
        title={t('tools.hashGenerator.aboutTitle')}
        className="border-border bg-muted/50"
        contentClassName="text-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t('tools.hashGenerator.securityLevels')}</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li><strong>MD5:</strong> {t('tools.hashGenerator.md5Desc')}</li>
              <li><strong>SHA-1:</strong> {t('tools.hashGenerator.sha1Desc')}</li>
              <li><strong>SHA-256:</strong> {t('tools.hashGenerator.sha256Desc')}</li>
              <li><strong>SHA-384:</strong> {t('tools.hashGenerator.sha384Desc')}</li>
              <li><strong>SHA-512:</strong> {t('tools.hashGenerator.sha512Desc')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t('tools.hashGenerator.commonUseCases')}</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>{t('tools.hashGenerator.useCase1')}</li>
              <li>{t('tools.hashGenerator.useCase2')}</li>
              <li>{t('tools.hashGenerator.useCase3')}</li>
              <li>{t('tools.hashGenerator.useCase4')}</li>
              <li>{t('tools.hashGenerator.useCase5')}</li>
            </ul>
          </div>
        </div>
      </ToolSection>
    </ToolPage>
  );
}
