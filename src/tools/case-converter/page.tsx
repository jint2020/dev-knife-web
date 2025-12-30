import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toDotCase,
  toInvertCase,
  toAlternatingCase,
} from './logic';

interface ConversionOption {
  label: string;
  description: string;
  convert: (text: string) => string;
}

export default function CaseConverterPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const conversions: ConversionOption[] = [
    { label: t('tools.caseConverter.uppercase'), description: t('tools.caseConverter.uppercaseDesc'), convert: toUpperCase },
    { label: t('tools.caseConverter.lowercase'), description: t('tools.caseConverter.lowercaseDesc'), convert: toLowerCase },
    { label: t('tools.caseConverter.titleCase'), description: t('tools.caseConverter.titleCaseDesc'), convert: toTitleCase },
    { label: t('tools.caseConverter.sentenceCase'), description: t('tools.caseConverter.sentenceCaseDesc'), convert: toSentenceCase },
    { label: t('tools.caseConverter.camelCase'), description: t('tools.caseConverter.camelCaseDesc'), convert: toCamelCase },
    { label: t('tools.caseConverter.pascalCase'), description: t('tools.caseConverter.pascalCaseDesc'), convert: toPascalCase },
    { label: t('tools.caseConverter.snakeCase'), description: t('tools.caseConverter.snakeCaseDesc'), convert: toSnakeCase },
    { label: t('tools.caseConverter.kebabCase'), description: t('tools.caseConverter.kebabCaseDesc'), convert: toKebabCase },
    { label: t('tools.caseConverter.constantCase'), description: t('tools.caseConverter.constantCaseDesc'), convert: toConstantCase },
    { label: t('tools.caseConverter.dotCase'), description: t('tools.caseConverter.dotCaseDesc'), convert: toDotCase },
    { label: t('tools.caseConverter.invertCase'), description: t('tools.caseConverter.invertCaseDesc'), convert: toInvertCase },
    { label: t('tools.caseConverter.alternatingCase'), description: t('tools.caseConverter.alternatingCaseDesc'), convert: toAlternatingCase },
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="h-6 w-6" />
            <div>
              <CardTitle>{t('tools.caseConverter.title')}</CardTitle>
              <CardDescription>{t('tools.caseConverter.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Input */}
          <div className="space-y-2">
            <Label>{t('tools.caseConverter.inputLabel')}</Label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('tools.caseConverter.inputPlaceholder')}
              className="w-full min-h-[150px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="text-xs text-muted-foreground">
              {input.length} {t('tools.caseConverter.charactersCount')}, {input.split(/\s+/).filter(Boolean).length} {t('tools.caseConverter.wordsCount')}
            </div>
          </div>

          {/* Conversions Grid */}
          <div className="space-y-2">
            <Label>{t('tools.caseConverter.results')}</Label>
            <div className="grid grid-cols-1 gap-3">
              {conversions.map((conversion, index) => {
                const result = input ? conversion.convert(input) : '';
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{conversion.label}</div>
                            <div className="text-xs text-muted-foreground">{conversion.description}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(result, conversion.label)}
                            disabled={!input}
                          >
                            {copied === conversion.label ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="p-3 rounded-md bg-muted font-mono text-sm break-all min-h-[40px]">
                          {result || <span className="text-muted-foreground">{t('tools.caseConverter.emptyResult')}</span>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-md bg-muted text-sm space-y-1">
            <div className="font-semibold">{t('tools.caseConverter.commonUseCases')}</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{t('tools.caseConverter.useCaseJS')}</li>
              <li>{t('tools.caseConverter.useCasePython')}</li>
              <li>{t('tools.caseConverter.useCaseURL')}</li>
              <li>{t('tools.caseConverter.useCaseConstants')}</li>
              <li>{t('tools.caseConverter.useCaseHeadings')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
