import { useState } from 'react';
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
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const conversions: ConversionOption[] = [
    { label: 'UPPERCASE', description: 'ALL CHARACTERS TO UPPERCASE', convert: toUpperCase },
    { label: 'lowercase', description: 'all characters to lowercase', convert: toLowerCase },
    { label: 'Title Case', description: 'Capitalize First Letter Of Each Word', convert: toTitleCase },
    { label: 'Sentence case', description: 'Capitalize first letter only', convert: toSentenceCase },
    { label: 'camelCase', description: 'noCapsWithFirstLetterLowercase', convert: toCamelCase },
    { label: 'PascalCase', description: 'CapitalizeFirstLetterOfEachWord', convert: toPascalCase },
    { label: 'snake_case', description: 'lowercase_with_underscores', convert: toSnakeCase },
    { label: 'kebab-case', description: 'lowercase-with-dashes', convert: toKebabCase },
    { label: 'CONSTANT_CASE', description: 'UPPERCASE_WITH_UNDERSCORES', convert: toConstantCase },
    { label: 'dot.case', description: 'lowercase.with.dots', convert: toDotCase },
    { label: 'InVeRt CaSe', description: 'sWaP uPpEr aNd LoWeR', convert: toInvertCase },
    { label: 'aLtErNaTiNg cAsE', description: 'AlTeRnAtE eVeRy ChArAcTeR', convert: toAlternatingCase },
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
              <CardTitle>Case Converter</CardTitle>
              <CardDescription>Convert text between different cases</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Input */}
          <div className="space-y-2">
            <Label>Input Text</Label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full min-h-[150px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="text-xs text-muted-foreground">
              {input.length} characters, {input.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* Conversions Grid */}
          <div className="space-y-2">
            <Label>Conversions</Label>
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
                          {result || <span className="text-muted-foreground">Enter text to convert...</span>}
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
            <div className="font-semibold">Common Use Cases:</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>camelCase, PascalCase:</strong> JavaScript/TypeScript variable and function names</li>
              <li><strong>snake_case:</strong> Python, Ruby variable names, database columns</li>
              <li><strong>kebab-case:</strong> URLs, CSS classes, file names</li>
              <li><strong>CONSTANT_CASE:</strong> Constants and environment variables</li>
              <li><strong>Title Case:</strong> Headings, titles, proper names</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
