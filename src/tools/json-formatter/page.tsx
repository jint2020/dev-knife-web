import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Copy,
  Check,
  Download,
  Minimize2,
  Maximize2,
  ArrowUpDown,
} from "lucide-react";
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

export default function JsonFormatterPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [operationError, setOperationError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
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
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("tools.jsonFormatter.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("tools.jsonFormatter.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("tools.jsonFormatter.inputLabel")}</CardTitle>
                <CardDescription>
                  {t("tools.jsonFormatter.pasteJson")}
                </CardDescription>
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
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
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
                  id="indent"
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="px-2 py-1 rounded-md border border-border bg-background text-sm"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value={2}>2 {t("tools.jsonFormatter.spaces")}</SelectItem>
                      <SelectItem value={4}>4 {t("tools.jsonFormatter.spaces")}</SelectItem>
                      <SelectItem value={1}>4 {t("tools.jsonFormatter.spaces")}</SelectItem>
                      <SelectItem value={0}>{t("tools.jsonFormatter.tab")}</SelectItem>
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
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("tools.jsonFormatter.outputLabel")}</CardTitle>
                <CardDescription>
                  {t("tools.jsonFormatter.formattedResult")}
                </CardDescription>
              </div>
              {output && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(output)}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-2" />
                        {t("common.copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-2" />
                        {t("common.copy")}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAsFile}>
                    <Download className="w-3 h-3 mr-2" />
                    {t("common.download")}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
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
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-border bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">
            {t("tools.jsonFormatter.featuresTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
        </CardContent>
      </Card>
    </div>
  );
}
