# Tool UI Components 重构指南

本指南提供了将现有工具重构为使用新组件（`ToolPage`、`ToolSection`、`CopyButton`）的标准模板。

## 🎯 重构目标

- **减少样板代码**：消除重复的复制逻辑、布局代码
- **统一视觉风格**：所有工具使用一致的页面结构
- **提升可维护性**：改动一处，所有工具受益

---

## 📦 可用组件

### 1. `<ToolPage>` - 页面容器

**作用**：替换最外层的 `div.container` 和页面标题部分

**Props**:
```typescript
interface ToolPageProps {
  title: string;           // 工具标题（i18n key）
  description: string;     // 工具描述（i18n key）
  children: ReactNode;     // 工具内容
  className?: string;      // 额外的容器样式（如 max-w-4xl）
}
```

**使用示例**:
```tsx
<ToolPage
  title={t('tools.myTool.title')}
  description={t('tools.myTool.description')}
  className="max-w-4xl"  // 可选，如需要更窄的容器
>
  {/* 工具内容 */}
</ToolPage>
```

---

### 2. `<ToolSection>` - 内容区块

**作用**：替换 `<Card>` 组件，提供标准化的区块布局

**Props**:
```typescript
interface ToolSectionProps {
  title?: ReactNode;          // 区块标题（支持字符串或 JSX）
  description?: string;       // 区块描述
  children: ReactNode;        // 区块内容
  actions?: ReactNode;        // 右上角操作按钮（如复制、下载）
  className?: string;         // Card 的额外样式
  contentClassName?: string;  // CardContent 的额外样式
}
```

**使用示例**:
```tsx
// 完整 header
<ToolSection
  title="Input"
  description="Enter your data here"
  actions={<CopyButton value={output} />}
  contentClassName="space-y-4"
>
  <textarea />
</ToolSection>

// 仅内容（无 header）
<ToolSection contentClassName="space-y-4">
  <div>Some content</div>
</ToolSection>

// 带图标的标题
<ToolSection
  title={
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      {t('tools.myTool.sectionTitle')}
    </div>
  }
>
  {/* 内容 */}
</ToolSection>
```

---

### 3. `<CopyButton>` - 复制按钮

**作用**：替换所有手动实现的复制逻辑

**Props**:
```typescript
interface CopyButtonProps {
  value: string;                    // 要复制的文本
  variant?: ButtonProps['variant']; // 按钮样式
  size?: ButtonProps['size'];       // 按钮大小
  className?: string;               // 额外样式
  mode?: 'icon-only' | 'with-label'; // 显示模式
  successDuration?: number;         // 成功提示持续时间（默认 2000ms）
  onCopySuccess?: () => void;       // 复制成功回调
  onCopyError?: (error: Error) => void; // 复制失败回调
}
```

**使用示例**:
```tsx
// 带文字标签（默认）
<CopyButton value={text} />

// 仅图标
<CopyButton value={text} mode="icon-only" />

// 自定义样式
<CopyButton
  value={text}
  variant="ghost"
  size="sm"
  className="h-8"
/>
```

---

## 🔄 重构步骤

### Step 1: 更新导入

**之前**:
```tsx
import { Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
```

**之后**:
```tsx
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';
// 如果还需要 Card（用于嵌套卡片），保留部分导入
```

---

### Step 2: 移除复制逻辑

**删除以下代码**:
```tsx
// ❌ 删除这些
const [copied, setCopied] = useState(false);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
```

---

### Step 3: 重构页面结构

#### 3.1 替换最外层容器和标题

**之前**:
```tsx
return (
  <div className="container mx-auto p-6 space-y-6 max-w-5xl">
    {/* Header */}
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        {t('tools.myTool.title')}
      </h1>
      <p className="text-muted-foreground">
        {t('tools.myTool.description')}
      </p>
    </div>

    {/* 工具内容 */}
    <Card>...</Card>
  </div>
);
```

**之后**:
```tsx
return (
  <ToolPage
    title={t('tools.myTool.title')}
    description={t('tools.myTool.description')}
  >
    {/* 工具内容 */}
    <ToolSection>...</ToolSection>
  </ToolPage>
);
```

#### 3.2 替换 Card 为 ToolSection

**之前**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Input</CardTitle>
    <CardDescription>Enter your text</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* 内容 */}
  </CardContent>
</Card>
```

**之后**:
```tsx
<ToolSection
  title="Input"
  description="Enter your text"
  contentClassName="space-y-4"
>
  {/* 内容 */}
</ToolSection>
```

#### 3.3 替换复制按钮

**之前**:
```tsx
<Button
  onClick={() => copyToClipboard(output)}
  variant="outline"
  size="sm"
>
  {copied ? (
    <>
      <Check className="w-3 h-3 mr-2" />
      {t('common.copied')}
    </>
  ) : (
    <>
      <Copy className="w-3 h-3 mr-2" />
      {t('common.copy')}
    </>
  )}
</Button>
```

**之后**:
```tsx
<CopyButton value={output} variant="outline" size="sm" />
```

---

## 📝 完整示例对比

### 示例：简单文本工具

#### 重构前（~200行）

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { processText } from './logic';

export default function MyToolPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setOutput(processText(input));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('tools.myTool.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('tools.myTool.description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full min-h-[150px] p-3 rounded-md border"
          />
          <Button onClick={handleProcess}>Process</Button>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Output</CardTitle>
              <Button
                onClick={() => copyToClipboard(output)}
                variant="outline"
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-2" />
                    {t('common.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-2" />
                    {t('common.copy')}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="p-3 rounded-md bg-muted">{output}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

#### 重构后（~120行，-40%）

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { processText } from './logic';
import { CopyButton } from '@/components/common/copy-button';
import { ToolPage, ToolSection } from '@/components/tool-ui';

export default function MyToolPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleProcess = () => {
    setOutput(processText(input));
  };

  return (
    <ToolPage
      title={t('tools.myTool.title')}
      description={t('tools.myTool.description')}
    >
      <ToolSection
        title="Input"
        contentClassName="space-y-4"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full min-h-[150px] p-3 rounded-md border"
        />
        <Button onClick={handleProcess}>Process</Button>
      </ToolSection>

      {output && (
        <ToolSection
          title="Output"
          actions={<CopyButton value={output} />}
        >
          <pre className="p-3 rounded-md bg-muted">{output}</pre>
        </ToolSection>
      )}
    </ToolPage>
  );
}
```

**改进点**:
- ✅ 移除 28 行样板代码（copied state + copyToClipboard 函数 + 复制按钮 JSX）
- ✅ 页面结构更清晰（ToolPage → ToolSection）
- ✅ 导入语句减少 3 个

---

## 🎨 特殊场景处理

### 场景 1：使用 Tabs 的工具

**示例**：Base64 Encoder、Hash Generator

```tsx
<ToolPage title={t('...')} description={t('...')}>
  <Tabs defaultValue="text">
    <TabsList>
      <TabsTrigger value="text">Text</TabsTrigger>
      <TabsTrigger value="file">File</TabsTrigger>
    </TabsList>

    <TabsContent value="text" className="space-y-4">
      <ToolSection title="..." contentClassName="space-y-4">
        {/* Text mode content */}
      </ToolSection>
    </TabsContent>

    <TabsContent value="file" className="space-y-4">
      <ToolSection title="..." contentClassName="space-y-4">
        {/* File mode content */}
      </ToolSection>
    </TabsContent>
  </Tabs>

  {/* Info section */}
  <ToolSection title="Info" className="bg-muted/50">
    <p>Additional information...</p>
  </ToolSection>
</ToolPage>
```

### 场景 2：多个复制按钮（批量生成）

**示例**：UUID Generator

```tsx
<ToolSection
  title="Bulk UUIDs"
  actions={<CopyButton value={bulkUUIDs.join('\n')} />}
>
  <div className="space-y-1">
    {bulkUUIDs.map((uuid, index) => (
      <div key={index} className="flex items-center justify-between group">
        <span className="font-mono">{uuid}</span>
        <CopyButton
          value={uuid}
          mode="icon-only"
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100"
        />
      </div>
    ))}
  </div>
</ToolSection>
```

### 场景 3：嵌套卡片（如 Case Converter）

**保留内部 Card**，仅外层使用 ToolSection：

```tsx
<ToolSection contentClassName="space-y-4">
  {conversions.map((conversion) => (
    <Card key={conversion.label}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{conversion.label}</div>
            <div className="text-sm text-muted-foreground">{conversion.description}</div>
          </div>
          <CopyButton value={conversion.result} mode="icon-only" />
        </div>
        <pre className="mt-2 p-3 bg-muted rounded">{conversion.result}</pre>
      </CardContent>
    </Card>
  ))}
</ToolSection>
```

### 场景 4：图标标题

```tsx
<ToolSection
  title={
    <div className="flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-primary" />
      {t('tools.myTool.sectionTitle')}
    </div>
  }
>
  {/* 内容 */}
</ToolSection>
```

---

## ✅ 重构检查清单

### 代码层面
- [ ] 移除 `copied` state
- [ ] 移除 `copyToClipboard` 函数
- [ ] 替换最外层 `div.container` 为 `<ToolPage>`
- [ ] 替换 `<Card>` 为 `<ToolSection>`（除非是嵌套卡片）
- [ ] 替换所有复制按钮为 `<CopyButton>`
- [ ] 移除未使用的 `Copy`、`Check` 图标导入
- [ ] 移除未使用的 `Card*` 组件导入（如果全部替换）

### 功能层面
- [ ] 构建通过（`npm run build`）
- [ ] 页面标题和描述正确显示
- [ ] 所有输入/输出区域正常工作
- [ ] 复制功能正常（点击后显示 Check 图标）
- [ ] 响应式布局正常
- [ ] 暗色模式样式正常

---

## 📊 预期收益

| 工具类型 | 原始行数 | 预计减少 | 示例工具 |
|---------|---------|---------|---------|
| 简单工具（单输入输出） | ~150-250 行 | 30-50 行 | Text Diff, Lorem Ipsum |
| 中等工具（多区块） | ~250-350 行 | 50-80 行 | Hash Generator, URL Encoder |
| 复杂工具（多标签/状态） | ~350-450 行 | 60-100 行 | JSON Formatter, Password Generator |

**平均代码减少**：~20-25%

**维护成本降低**：
- 复制逻辑修改：14 处 → 1 处（CopyButton 组件）
- 布局调整：14 处 → 2 处（ToolPage + ToolSection）
- 样式统一：自动继承主题

---

## 🚀 快速开始

1. 选择一个工具（建议从简单的开始）
2. 创建新分支：`git checkout -b refactor/tool-name`
3. 按照上述步骤重构
4. 测试：`npm run dev` 并手动验证
5. 构建验证：`npm run build`
6. 提交：`git commit -m "refactor(tool-name): use ToolPage/ToolSection/CopyButton"`

---

## 📚 参考资料

- **组件源码**：
  - [src/components/tool-ui/tool-page.tsx](src/components/tool-ui/tool-page.tsx)
  - [src/components/tool-ui/tool-section.tsx](src/components/tool-ui/tool-section.tsx)
  - [src/components/common/copy-button.tsx](src/components/common/copy-button.tsx)

- **已重构示例**：
  - [src/tools/uuid-generator/page.tsx](src/tools/uuid-generator/page.tsx) - 简单工具
  - [src/tools/base64-encoder/page.tsx](src/tools/base64-encoder/page.tsx) - 带 Tabs
  - [src/tools/case-converter/page.tsx](src/tools/case-converter/page.tsx) - 嵌套卡片

---

## 💡 提示

- **不要过度使用 ToolSection**：如果内容很简单，直接放在 ToolPage 的 children 中即可
- **保持语义化**：ToolSection 用于逻辑分区（Input、Output、Settings、Info）
- **灵活调整**：模板只是起点，根据工具特点调整
- **逐步迁移**：不必一次性重构所有工具，可以在修改时逐步应用

---

**Happy Refactoring! 🎉**
