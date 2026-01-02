import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Key, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  generatePassword,
  generatePasswords,
  generatePassphrase,
  calculateStrength,
  type PasswordOptions,
} from './logic';
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function PasswordGeneratorPage() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [passphrase, setPassphrase] = useState('');

  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  const [passphraseOptions, setPassphraseOptions] = useState({
    wordCount: 4,
    separator: '-',
  });

  const strength = password ? calculateStrength(password) : null;

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
    } catch (err) {
      console.error('Failed to generate password:', err);
    }
  };

  // Generate initial password
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateMultiple = (count: number) => {
    try {
      const newPasswords = generatePasswords(count, options);
      setPasswords(newPasswords);
    } catch (err) {
      console.error('Failed to generate passwords:', err);
    }
  };

  const handleGeneratePassphrase = () => {
    const newPassphrase = generatePassphrase(
      passphraseOptions.wordCount,
      passphraseOptions.separator
    );
    setPassphrase(newPassphrase);
  };


  const getStrengthColor = (score: number) => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-blue-500';
    if (score >= 2) return 'bg-yellow-500';
    if (score >= 1) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <ToolPage
      title={t('tools.passwordGenerator.title')}
      description={t('tools.passwordGenerator.description')}
    >
      <Tabs defaultValue="single">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single">{t('tools.passwordGenerator.singlePassword')}</TabsTrigger>
              <TabsTrigger value="multiple">{t('tools.passwordGenerator.multiplePasswords')}</TabsTrigger>
              <TabsTrigger value="passphrase">{t('tools.passwordGenerator.passphrase')}</TabsTrigger>
            </TabsList>

            {/* Single Password Tab */}
            <TabsContent value="single" className="space-y-4">
              {/* Generated Password Display */}
              <div className="space-y-2">
                <Label>{t('tools.passwordGenerator.generatedPassword')}</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={password}
                      readOnly
                      className="w-full h-12 pl-3 pr-12 rounded-md border border-border bg-background text-foreground font-mono text-lg focus:outline-none"
                    />
                    <CopyButton
                      value={password}
                      mode="icon-only"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0"
                    />
                  </div>
                  <Button onClick={handleGenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('common.generate')}
                  </Button>
                </div>
              </div>

              {/* Strength Indicator */}
              {strength && (
                <ToolSection
                  className="border-2"
                  contentClassName="pt-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span className="font-semibold">{t('tools.passwordGenerator.passwordStrength')}:</span>
                    </div>
                    <Badge variant="outline" className={`${getStrengthColor(strength.score)} text-white`}>
                      {strength.label}
                    </Badge>
                  </div>

                  <div className="flex gap-1 h-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full ${
                          i < strength.score ? getStrengthColor(strength.score) : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {strength.feedback.length > 0 && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {strength.feedback.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  )}
                </ToolSection>
              )}

              {/* Options */}
              <div className="space-y-4 p-4 rounded-md border border-border">
                <div className="space-y-2">
                  <Label>{t('tools.passwordGenerator.length')}: {options.length}</Label>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={options.length}
                    onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeUppercase}
                      onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.uppercase')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeLowercase}
                      onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.lowercase')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeNumbers}
                      onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.numbers')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeSymbols}
                      onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.symbols')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.excludeSimilar}
                      onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.excludeSimilar')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.excludeAmbiguous}
                      onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.excludeAmbiguous')}</span>
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* Multiple Passwords Tab */}
            <TabsContent value="multiple" className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={() => handleGenerateMultiple(5)}>
                  {t('tools.passwordGenerator.generate5')}
                </Button>
                <Button onClick={() => handleGenerateMultiple(10)}>
                  {t('tools.passwordGenerator.generate10')}
                </Button>
                <Button onClick={() => handleGenerateMultiple(20)}>
                  {t('tools.passwordGenerator.generate20')}
                </Button>
              </div>

              {passwords.length > 0 && (
                <div className="space-y-2">
                  <Label>{t('tools.passwordGenerator.generatedPasswords', { count: passwords.length })}</Label>
                  <div className="max-h-[400px] overflow-y-auto space-y-2 p-3 rounded-md border border-border">
                    {passwords.map((pwd, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-sm">
                        <span className="flex-1 break-all">{pwd}</span>
                        <CopyButton
                          value={pwd}
                          mode="icon-only"
                          variant="ghost"
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options (same as single) */}
              <div className="space-y-4 p-4 rounded-md border border-border">
                <div className="space-y-2">
                  <Label>{t('tools.passwordGenerator.length')}: {options.length}</Label>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={options.length}
                    onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeUppercase}
                      onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.uppercase')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeLowercase}
                      onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.lowercase')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeNumbers}
                      onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.numbers')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeSymbols}
                      onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{t('tools.passwordGenerator.symbols')}</span>
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* Passphrase Tab */}
            <TabsContent value="passphrase" className="space-y-4">
              <div className="space-y-2">
                <Label>{t('tools.passwordGenerator.generatedPassphrase')}</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={passphrase}
                      readOnly
                      placeholder={t('tools.passwordGenerator.passphraseplaceholder')}
                      className="w-full h-12 pl-3 pr-12 rounded-md border border-border bg-background text-foreground font-mono text-lg focus:outline-none"
                    />
                    <CopyButton
                      value={passphrase}
                      mode="icon-only"
                      variant="ghost"
                      size="sm"
                      disabled={!passphrase}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0"
                    />
                  </div>
                  <Button onClick={handleGeneratePassphrase}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('common.generate')}
                  </Button>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-md border border-border">
                <div className="space-y-2">
                  <Label>{t('tools.passwordGenerator.numberOfWords')}: {passphraseOptions.wordCount}</Label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={passphraseOptions.wordCount}
                    onChange={(e) => setPassphraseOptions({ ...passphraseOptions, wordCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('tools.passwordGenerator.separator')}</Label>
                  <div className="flex gap-2">
                    {['-', '_', '.', ' ', ''].map((sep) => (
                      <Button
                        key={sep}
                        size="sm"
                        variant={passphraseOptions.separator === sep ? 'default' : 'outline'}
                        onClick={() => setPassphraseOptions({ ...passphraseOptions, separator: sep })}
                      >
                        {sep === '' ? t('common.none') : sep === ' ' ? t('common.space') : sep}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <ToolSection
                className="border-border bg-muted/50"
                contentClassName="text-sm"
              >
                <p className="font-semibold mb-1">{t('tools.passwordGenerator.aboutPassphrases')}:</p>
                <p className="text-muted-foreground">
                  {t('tools.passwordGenerator.passphraseInfo')}
                </p>
              </ToolSection>
            </TabsContent>
          </Tabs>
        </ToolPage>
      );
    }
