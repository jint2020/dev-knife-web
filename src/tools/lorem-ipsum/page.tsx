import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  generateLorem,
  getWordCount,
  getCharCount,
  getSentenceCount,
  getParagraphCount,
} from "./logic";

export default function LoremIpsumPage() {
  const { t } = useTranslation();
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">(
    "paragraphs"
  );
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle>{t("tools.loremGenerator.title")}</CardTitle>
              <CardDescription>
                {t("tools.loremGenerator.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Options */}
          <Card>
            <CardContent className="pt-6 space-y-4">
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
                <input
                  type="range"
                  min="1"
                  max={type === "words" ? 500 : type === "sentences" ? 50 : 20}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>
                    {type === "words" ? 500 : type === "sentences" ? 50 : 20}
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">
                  {t("tools.loremGenerator.startWithLorem")}
                </span>
              </label>

              <Button onClick={handleGenerate} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("tools.loremGenerator.regenerate")}
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          {stats && (
            <Card className="border-2">
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          )}

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("tools.loremGenerator.generatedText")}</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                disabled={!output}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {t("common.copy")}
              </Button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full min-h-[400px] p-3 rounded-md border border-border bg-muted text-foreground text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Info */}
          <div className="p-3 rounded-md bg-muted text-sm space-y-1">
            <div className="font-semibold">
              {t("tools.loremGenerator.aboutTitle")}:
            </div>
            <p className="text-muted-foreground">
              {t("tools.loremGenerator.aboutDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
