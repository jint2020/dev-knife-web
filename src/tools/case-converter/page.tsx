import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Type } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

interface ConversionOption {
  label: string;
  description: string;
  convert: (text: string) => string;
}

export default function CaseConverterPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

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

  return (
    <ToolPage
      title={t('tools.caseConverter.title')}
      description={t('tools.caseConverter.description')}
      className="max-w-5xl"
    >
      <ToolSection
        title={
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            {t('tools.caseConverter.title')}
          </div>
        }
        contentClassName="space-y-4"
      >
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
                        <CopyButton
                          value={result}
                          mode="icon-only"
                          variant="ghost"
                          size="sm"
                          className={!input ? 'opacity-50 cursor-not-allowed' : ''}
                        />
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
      </ToolSection>
    </ToolPage>
  );
}
