import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  generateLorem,
  getWordCount,
  getCharCount,
  getSentenceCount,
  getParagraphCount,
} from "./logic";
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function LoremIpsumPage() {
  const { t } = useTranslation();
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">(
    "paragraphs"
  );
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const output = useMemo(() => {
    return generateLorem(type, count, startWithLorem);
  }, [type, count, startWithLorem]);

  const handleTypeChange = (newType: "words" | "sentences" | "paragraphs") => {
    setType(newType);
    // Reset count to default when type changes
    if (newType === "words") {
      setCount(50);
    } else if (newType === "sentences") {
      setCount(5);
    } else {
      setCount(3);
    }
  }

  const handleGenerate = () => {
    // Force re-render by updating one of the dependencies
    setStartWithLorem((prev) => prev);
  };


  const stats = output
    ? {
        words: getWordCount(output),
        characters: getCharCount(output),
        sentences: getSentenceCount(output),
        paragraphs: getParagraphCount(output),
      }
    : null;

  return (
    <ToolPage
      title={t("tools.loremGenerator.title")}
      description={t("tools.loremGenerator.description")}
    >
          {/* Options */}
          <ToolSection
            contentClassName="space-y-4"
          >
            <div className="space-y-2">
              <Label>{t("common.generate")}</Label>
              <div className="flex gap-2">
                <Badge
                  variant={type === "paragraphs" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTypeChange("paragraphs")}
                >
                  {t("tools.loremGenerator.paragraphs")}
                </Badge>
                <Badge
                  variant={type === "sentences" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTypeChange("sentences")}
                >
                  {t("tools.loremGenerator.sentences")}
                </Badge>
                <Badge
                  variant={type === "words" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTypeChange("words")}
                >
                  {t("tools.loremGenerator.words")}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('common.count')}: {count}</Label>
              <Slider
                value={[count]}
                onValueChange={(value) => setCount(value[0])}
                min={1}
                max={type === "words" ? 500 : type === "sentences" ? 50 : 20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>
                  {type === "words" ? 500 : type === "sentences" ? 50 : 20}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id="start-with-lorem"
                checked={startWithLorem}
                onCheckedChange={(checked) => setStartWithLorem(checked === true)}
              />
              <Label
                htmlFor="start-with-lorem"
                className="text-sm cursor-pointer"
              >
                {t("tools.loremGenerator.startWithLorem")}
              </Label>
            </div>

            <Button onClick={handleGenerate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("tools.loremGenerator.regenerate")}
            </Button>
          </ToolSection>

          {/* Stats */}
          {stats && (
            <ToolSection
              className="border-2"
              contentClassName="pt-6"
            >
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.paragraphs}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("tools.loremGenerator.paragraphs")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.sentences}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("tools.loremGenerator.sentences")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.words}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("tools.loremGenerator.words")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.characters}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("common.characters")}
                  </div>
                </div>
              </div>
            </ToolSection>
          )}

          {/* Output */}
          <ToolSection
            title={
              <div className="flex items-center justify-between w-full">
                <span>{t("tools.loremGenerator.generatedText")}</span>
                <CopyButton value={output} variant="outline" size="sm" disabled={!output} />
              </div>
            }
          >
            <textarea
              value={output}
              readOnly
              className="w-full min-h-[400px] p-3 rounded-md border border-border bg-muted text-foreground text-sm resize-none focus:outline-none"
            />
          </ToolSection>

          {/* Info */}
          <ToolSection
            className="border-border bg-muted/50"
            contentClassName="text-sm space-y-1"
          >
            <div className="font-semibold">
              {t("tools.loremGenerator.aboutTitle")}:
            </div>
            <p className="text-muted-foreground">
              {t("tools.loremGenerator.aboutDescription")}
            </p>
          </ToolSection>
        </ToolPage>
      );
    }
