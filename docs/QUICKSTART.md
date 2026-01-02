# DevKnife Web - Quick Reference

## 📁 项目目录结构

```
devKnife-web/
├── src/
│   ├── components/
│   │   ├── ui/                         # Shadcn UI 组件（自动生成）
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── command.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   └── dialog.tsx
│   │   └── layout/                     # 布局组件
│   │       ├── Sidebar.tsx             # 侧边栏导航
│   │       ├── Header.tsx              # 顶部栏（搜索 + GitHub + 主题切换）
│   │       ├── CommandPalette.tsx      # Cmd+K 全局搜索
│   │       └── ThemeToggle.tsx         # Light/Dark 主题切换
│   │
│   ├── tools/                          # 工具实现
│   │   ├── uuid-generator/             # ✅ 示例工具
│   │   │   ├── meta.ts                 # 工具元数据
│   │   │   ├── logic.ts                # 纯业务逻辑（generateUUID）
│   │   │   └── page.tsx                # UI 组件
│   │   └── registry.ts                 # 🔧 工具注册中心
│   │
│   ├── hooks/                          # React Hooks
│   │   └── useAppStore.ts              # Zustand 状态管理（主题）
│   │
│   ├── lib/                            # 工具函数
│   │   └── utils.ts                    # cn() - Tailwind class 合并
│   │
│   ├── styles/                         # 样式文件
│   │   └── globals.css                 # Tailwind + Tweakcn CSS Variables
│   │
│   ├── types/                          # TypeScript 类型定义
│   │   └── tool.ts                     # ToolMeta, ToolRegistry 类型
│   │
│   ├── App.tsx                         # 主应用组件（路由 + 布局）
│   └── main.tsx                        # 入口文件
│
├── public/                             # 静态资源
├── components.json                     # Shadcn UI 配置
├── tailwind.config.js                  # Tailwind CSS 配置（映射 CSS Variables）
├── postcss.config.js                   # PostCSS 配置
├── vite.config.ts                      # Vite + PWA 配置
├── tsconfig.json                       # TypeScript 配置
├── tsconfig.app.json                   # App TypeScript 配置（路径别名 @/*）
├── tsconfig.node.json                  # Node TypeScript 配置
├── package.json                        # 依赖管理
├── README.md                           # 项目说明文档
└── ARCHITECTURE.md                     # 架构详细文档
```

## 🎨 Tweakcn 主题集成

### 如何使用 Tweakcn 定制主题：

1. **访问 Tweakcn**
   ```
   https://tweakcn.com/
   ```

2. **自定义设计 Tokens**
   - 调整颜色（Primary, Secondary, Accent, etc.）
   - 修改 Border Radius
   - 调整字体设置

3. **导出 CSS Variables**
   - 点击 "Export" 按钮
   - 复制生成的 CSS Variables

4. **粘贴到项目中**
   - 打开 `src/styles/globals.css`
   - 找到标记的区域：
     ```css
     :root {
       /* 👇 PASTE TWEAKCN LIGHT MODE VARIABLES HERE */
     }

     .dark {
       /* 👇 PASTE TWEAKCN DARK MODE VARIABLES HERE */
     }
     ```
   - 粘贴导出的变量

5. **自动生效**
   - 所有 Shadcn 组件会自动使用新主题
   - Dark Mode 切换会自动应用 `.dark` 类的变量

### Tailwind 主题色映射

```javascript
// tailwind.config.js
colors: {
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: { ... },
  accent: { ... },
  // ... 所有语义色都映射到 CSS Variables
}
```

### 在组件中使用主题色

```tsx
// 使用语义色类名
<Button className="bg-primary text-primary-foreground">
  按钮会自动使用 Tweakcn 定义的主题色
</Button>

// Shadcn 组件的 variant 也会使用主题
<Button variant="secondary">Secondary Button</Button>
<Badge variant="outline">Outline Badge</Badge>
```

## 🧩 添加新工具的完整流程

### Step 1: 创建工具文件夹

```bash
mkdir src/tools/my-tool
```

### Step 2: 创建 `meta.ts` (工具元数据)

```typescript
// src/tools/my-tool/meta.ts
import { YourIcon } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const myToolMeta: ToolMeta = {
  id: 'my-tool',
  title: 'My Tool',
  description: 'What your tool does',
  icon: YourIcon,                        // Lucide icon
  path: '/tools/my-tool',
  category: 'generators',                // 分类
  keywords: ['keyword1', 'keyword2'],    // 搜索关键词
};
```

### Step 3: 实现 `logic.ts` (纯业务逻辑)

```typescript
// src/tools/my-tool/logic.ts
/**
 * 核心算法 - 不依赖 React
 * 可以在 Web Worker 或 Node.js 中复用
 */
export function myToolLogic(input: string): string {
  // 实现你的业务逻辑
  return input.toUpperCase();
}
```

### Step 4: 创建 `page.tsx` (UI 组件)

```typescript
// src/tools/my-tool/page.tsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { myToolLogic } from './logic';

export default function MyToolPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleProcess = () => {
    setOutput(myToolLogic(input));
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Tool</h1>
        <p className="text-muted-foreground">Tool description</p>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text..."
          />
          <Button onClick={handleProcess} className="bg-primary text-primary-foreground">
            Process
          </Button>
          {output && (
            <div className="p-4 bg-muted rounded-md">
              {output}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 5: 注册工具

```typescript
// src/tools/registry.ts
import { toolRegistry } from '@/types/tool';
import { uuidGeneratorMeta } from './uuid-generator/meta';
import { myToolMeta } from './my-tool/meta';  // 👈 导入

export function registerTools(): void {
  toolRegistry.register(
    uuidGeneratorMeta,
    '/src/tools/uuid-generator/page.tsx'
  );
  
  // 👇 添加新工具
  toolRegistry.register(
    myToolMeta,
    '/src/tools/my-tool/page.tsx'
  );
}
```

### ✅ 完成！

工具会自动出现在：
- 侧边栏导航（按 category 分组）
- Cmd+K 全局搜索
- React Router 路由

## 🔧 可用的 Shadcn UI 组件

已安装的组件（可以直接使用）：
- `<Button>` - 按钮
- `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>` - 卡片
- `<Input>` - 输入框
- `<Label>` - 标签
- `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>` - 标签页
- `<Badge>` - 徽章
- `<Separator>` - 分隔线
- `<Command>`, `<CommandDialog>` - 命令面板
- `<Sheet>` - 侧边弹出层
- `<ScrollArea>` - 滚动区域
- `<Dialog>` - 对话框

### 添加更多组件

```bash
npx shadcn@latest add [component-name]
# 例如:
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add textarea
```

## 🚀 常用命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 添加 Shadcn 组件
npx shadcn@latest add [component-name]

# 类型检查
npm run tsc
```

## 📦 核心依赖

| Package | Version | 用途 |
|---------|---------|------|
| react | 18 | UI 框架 |
| typescript | 5 | 类型系统 |
| vite | 7 | 构建工具 |
| tailwindcss | 3 | CSS 框架 |
| shadcn/ui | latest | UI 组件库 |
| lucide-react | latest | 图标库 |
| zustand | latest | 状态管理 |
| react-router-dom | 6 | 路由 |
| vite-plugin-pwa | latest | PWA 支持 |

## 🎯 设计原则

1. **Offline First**: 所有功能必须在浏览器端完成，不能依赖网络请求
2. **模块化**: 每个工具独立，易于添加、删除、测试
3. **类型安全**: 完整的 TypeScript 类型定义
4. **可定制**: 通过 Tweakcn 轻松定制主题
5. **性能优化**: React.lazy() 懒加载，代码分割

## 📱 PWA 配置

已配置 Vite PWA Plugin，支持：
- 安装到桌面/主屏幕
- Service Worker 离线缓存
- 自动更新

PWA 配置在 `vite.config.ts` 中。

## 🐛 故障排除

### 问题：工具没有出现在侧边栏
- 检查 `src/tools/registry.ts` 是否调用了 `toolRegistry.register()`
- 确保 meta.ts 导出了正确的 `ToolMeta` 对象

### 问题：样式不生效
- 确保导入了 `src/styles/globals.css`
- 检查 Tailwind 配置是否正确
- 清除缓存并重启开发服务器

### 问题：TypeScript 报错找不到模块
- 重启 TypeScript 服务器 (`Cmd+Shift+P` > "Restart TS Server")
- 检查 `tsconfig.app.json` 中的 `paths` 配置

## 📚 参考资源

- [Shadcn UI 文档](https://ui.shadcn.com/)
- [Tweakcn 主题工具](https://tweakcn.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Lucide 图标库](https://lucide.dev/)
- [React Router v6](https://reactrouter.com/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)

---

**项目状态**: ✅ 基础架构完成，包含 UUID Generator 示例工具

**下一步**: 添加更多工具（Base64, JSON Formatter, 等等）
