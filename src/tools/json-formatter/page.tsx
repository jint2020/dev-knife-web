import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Download,
  Minimize2,
  Maximize2,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  validateJson,
  formatJson,
  minifyJson,
  sortJsonKeys,
  getJsonStats,
} from "./logic";
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function JsonFormatterPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [operationError, setOperationError] = useState("");

  // Compute validation on input change
  const validation = input.trim() ? validateJson(input) : { valid: false };
  const isValid = validation.valid;
  const validationError = validation.valid
    ? ""
    : validation.error || "Invalid JSON";

  // Update stats when valid
  const stats = isValid ? getJsonStats(input) : null;

  const handleFormat = () => {
    try {
      const formatted = formatJson(input, indent);
      setOutput(formatted);
      setOperationError("");
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "Format failed");
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setOperationError("");
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "Minify failed");
      setOutput("");
    }
  };

  const handleSort = () => {
    try {
      const sorted = sortJsonKeys(input, indent);
      setOutput(sorted);
      setOperationError("");
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "Sort failed");
      setOutput("");
    }
  };


  const downloadAsFile = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA",
      },
      hobbies: ["reading", "coding", "gaming"],
      active: true,
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <ToolPage
      title={t("tools.jsonFormatter.title")}
      description={t("tools.jsonFormatter.description")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <ToolSection
          title={
            <div className="flex items-center justify-between w-full">
              <div>
                <span>{t("tools.jsonFormatter.inputLabel")}</span>
                <p className="text-sm text-muted-foreground font-normal">
                  {t("tools.jsonFormatter.pasteJson")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {input && (
                  <Badge variant={isValid ? "default" : "destructive"}>
                    {isValid
                      ? `✓ ${t("tools.jsonFormatter.valid")}`
                      : `✗ ${t("tools.jsonFormatter.invalid")}`}
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={loadSample}>
                  {t("tools.jsonFormatter.sample")}
                </Button>
              </div>
            </div>
          }
          contentClassName="flex-1 flex flex-col space-y-4"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="flex-1 min-h-[400px] p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Error Display */}
          {(validationError || operationError) && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-mono">
              {validationError || operationError}
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-md bg-muted text-center">
                <div className="font-semibold text-foreground">
                  {stats.size}
                </div>
                <div className="text-muted-foreground">
                  {t("tools.jsonFormatter.size")}
                </div>
              </div>
              <div className="p-2 rounded-md bg-muted text-center">
                <div className="font-semibold text-foreground">
                  {stats.keys}
                </div>
                <div className="text-muted-foreground">
                  {t("tools.jsonFormatter.keys")}
                </div>
              </div>
              <div className="p-2 rounded-md bg-muted text-center">
                <div className="font-semibold text-foreground">
                  {stats.depth}
                </div>
                <div className="text-muted-foreground">
                  {t("tools.jsonFormatter.depth")}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="indent" className="text-sm">
                {t("tools.jsonFormatter.indent")}:
              </Label>
              <Select
                value={indent.toString()}
                onValueChange={(value) => setIndent(Number(value))}
              >
                <SelectTrigger className="w-[180px] px-2 py-1 rounded-md border border-border bg-background text-sm">
                  <SelectValue placeholder="Select indentation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("tools.jsonFormatter.jsonIndentPlaceholder")}</SelectLabel>
                    <SelectItem value="2">
                      2 {t("tools.jsonFormatter.spaces")}
                    </SelectItem>
                    <SelectItem value="4">
                      4 {t("tools.jsonFormatter.spaces")}
                    </SelectItem>
                    <SelectItem value="1">
                      1 {t("tools.jsonFormatter.spaces")}
                    </SelectItem>
                    <SelectItem value="0">
                      {t("tools.jsonFormatter.tab")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleFormat}
                disabled={!isValid}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                <Maximize2 className="w-3 h-3 mr-2" />
                {t("common.format")}
              </Button>
              <Button
                onClick={handleMinify}
                disabled={!isValid}
                variant="secondary"
                size="sm"
              >
                <Minimize2 className="w-3 h-3 mr-2" />
                {t("tools.jsonFormatter.minify")}
              </Button>
              <Button
                onClick={handleSort}
                disabled={!isValid}
                variant="outline"
                size="sm"
              >
                <ArrowUpDown className="w-3 h-3 mr-2" />
                {t("tools.jsonFormatter.sort")}
              </Button>
            </div>
          </div>
        </ToolSection>

        {/* Output Panel */}
        <ToolSection
          title={
            <div className="flex items-center justify-between w-full">
              <div>
                <span>{t("tools.jsonFormatter.outputLabel")}</span>
                <p className="text-sm text-muted-foreground font-normal">
                  {t("tools.jsonFormatter.formattedResult")}
                </p>
              </div>
              {output && (
                <div className="flex gap-2">
                  <CopyButton value={output} variant="outline" size="sm" />
                  <Button variant="outline" size="sm" onClick={downloadAsFile}>
                    <Download className="w-3 h-3 mr-2" />
                    {t("common.download")}
                  </Button>
                </div>
              )}
            </div>
          }
          contentClassName="flex-1"
        >
          {output ? (
            <div className="h-[400px] p-3 rounded-md border border-border bg-muted overflow-auto scrollbar-thin">
              <pre className="font-mono text-sm text-foreground whitespace-pre">
                {output}
              </pre>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center border border-dashed border-border rounded-md">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  {isValid
                    ? t("tools.jsonFormatter.clickToProcess")
                    : t("tools.jsonFormatter.enterValidJson")}
                </p>
              </div>
            </div>
          )}
        </ToolSection>
      </div>

      {/* Info Section */}
      <ToolSection
        title={t("tools.jsonFormatter.featuresTitle")}
        className="border-border bg-muted/50"
        contentClassName="text-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              {t("common.format")}
            </h3>
            <p className="text-muted-foreground">
              {t("tools.jsonFormatter.formatDesc")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              {t("tools.jsonFormatter.minify")}
            </h3>
            <p className="text-muted-foreground">
              {t("tools.jsonFormatter.minifyDesc")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              {t("tools.jsonFormatter.sortKeys")}
            </h3>
            <p className="text-muted-foreground">
              {t("tools.jsonFormatter.sortDesc")}
            </p>
          </div>
        </div>
      </ToolSection>
    </ToolPage>
  );
}
