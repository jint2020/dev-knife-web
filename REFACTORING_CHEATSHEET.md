# 🚀 Tool UI 重构速查表

## 一分钟快速替换指南

### 1. 导入替换

```diff
- import { Copy, Check } from 'lucide-react';
- import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
+ import { CopyButton } from '@/components/common/copy-button';
+ import { ToolPage, ToolSection } from '@/components/tool-ui';
```

---

### 2. 删除复制逻辑

```diff
- const [copied, setCopied] = useState(false);
-
- const copyToClipboard = async (text: string) => {
-   try {
-     await navigator.clipboard.writeText(text);
-     setCopied(true);
-     setTimeout(() => setCopied(false), 2000);
-   } catch (err) {
-     console.error('Failed to copy:', err);
-   }
- };
```

---

### 3. 页面结构替换

#### 外层容器 + 标题

```diff
  return (
-   <div className="container mx-auto p-6 space-y-6 max-w-5xl">
-     <div className="space-y-2">
-       <h1 className="text-3xl font-bold tracking-tight">{t('tools.myTool.title')}</h1>
-       <p className="text-muted-foreground">{t('tools.myTool.description')}</p>
-     </div>
+   <ToolPage
+     title={t('tools.myTool.title')}
+     description={t('tools.myTool.description')}
+   >

      {/* 内容 */}

-   </div>
+   </ToolPage>
  );
```

#### Card 区块

```diff
- <Card>
-   <CardHeader>
-     <CardTitle>Input</CardTitle>
-     <CardDescription>Enter your text</CardDescription>
-   </CardHeader>
-   <CardContent className="space-y-4">
+ <ToolSection
+   title="Input"
+   description="Enter your text"
+   contentClassName="space-y-4"
+ >
    {/* 内容 */}
- </CardContent>
- </Card>
+ </ToolSection>
```

#### 复制按钮

```diff
- <Button onClick={() => copyToClipboard(output)} variant="outline" size="sm">
-   {copied ? (
-     <>
-       <Check className="w-3 h-3 mr-2" />
-       {t('common.copied')}
-     </>
-   ) : (
-     <>
-       <Copy className="w-3 h-3 mr-2" />
-       {t('common.copy')}
-     </>
-   )}
- </Button>
+ <CopyButton value={output} variant="outline" size="sm" />
```

---

## 组件 API 速览

### ToolPage
```tsx
<ToolPage
  title={string}          // 必填：页面标题
  description={string}    // 必填：页面描述
  className={string}      // 可选：额外样式（如 "max-w-4xl"）
>
  {children}
</ToolPage>
```

### ToolSection
```tsx
<ToolSection
  title={ReactNode}           // 可选：区块标题（支持 JSX）
  description={string}        // 可选：区块描述
  actions={ReactNode}         // 可选：右上角操作按钮
  className={string}          // 可选：Card 样式
  contentClassName={string}   // 可选：CardContent 样式（常用 "space-y-4"）
>
  {children}
</ToolSection>
```

### CopyButton
```tsx
<CopyButton
  value={string}                    // 必填：要复制的文本
  mode="with-label" | "icon-only"   // 可选：显示模式（默认 with-label）
  variant="outline" | "ghost" | ... // 可选：按钮样式
  size="sm" | "icon" | ...          // 可选：按钮大小
  className={string}                // 可选：额外样式
/>
```

---

## 常见模式

### 带操作按钮的区块
```tsx
<ToolSection
  title="Output"
  actions={<CopyButton value={output} />}
>
  <pre>{output}</pre>
</ToolSection>
```

### 带图标的标题
```tsx
<ToolSection
  title={
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5" />
      Title Text
    </div>
  }
>
  {/* 内容 */}
</ToolSection>
```

### 仅图标的复制按钮
```tsx
<CopyButton
  value={text}
  mode="icon-only"
  variant="ghost"
  size="sm"
/>
```

### Tabs 结构
```tsx
<ToolPage title="..." description="...">
  <Tabs defaultValue="tab1">
    <TabsList>...</TabsList>

    <TabsContent value="tab1" className="space-y-4">
      <ToolSection>...</ToolSection>
    </TabsContent>

    <TabsContent value="tab2" className="space-y-4">
      <ToolSection>...</ToolSection>
    </TabsContent>
  </Tabs>
</ToolPage>
```

---

## 重构前后对比

| 操作 | 重构前 | 重构后 | 节省 |
|------|-------|-------|------|
| 页面标题 | 9 行 | 3 行 | -67% |
| Card 区块 | 8 行 | 1 行 | -87% |
| 复制按钮 | 11 行 | 1 行 | -91% |
| State 管理 | 1 行 | 0 行 | -100% |
| 复制函数 | 9 行 | 0 行 | -100% |

---

## 已重构工具参考

- ✅ **uuid-generator** - 简单单页工具
- ✅ **base64-encoder** - Tabs + 大文件处理
- ✅ **case-converter** - 批量结果展示

查看这些文件了解实际应用！
