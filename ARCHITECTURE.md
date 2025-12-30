# DevKnife Web - Architecture Documentation

## 项目架构总览

DevKnife Web 是一个基于 React + TypeScript + Vite 构建的纯前端开发者工具箱，采用模块化设计，支持离线优先（Offline First）和 PWA。

## 核心设计理念

### 1. 模块化工具系统

每个工具都是一个独立的模块，包含三个核心文件：

```
src/tools/[tool-name]/
├── meta.ts      # 工具元数据（标题、描述、图标、分类）
├── logic.ts     # 纯业务逻辑（不依赖 React）
└── page.tsx     # UI 组件（使用 Shadcn UI）
```

**优势：**
- 职责分离，易于测试
- logic.ts 可以在 Web Worker 或 Node.js 中复用
- 新增工具只需创建文件夹并注册

### 2. 工具注册机制

```typescript
// src/types/tool.ts - 定义工具接口
export interface ToolMeta {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  category: ToolCategory;
  keywords: string[];
}

// src/tools/registry.ts - 注册所有工具
export function registerTools(): void {
  toolRegistry.register(
    uuidGeneratorMeta,
    '/src/tools/uuid-generator/page.tsx'
  );
  // 添加更多工具...
}
```

**工作流程：**
1. App 启动时调用 `registerTools()`
2. 注册表使用 React.lazy() 延迟加载组件
3. 侧边栏和搜索自动读取注册表生成 UI

### 3. Tweakcn 主题系统

DevKnife Web 完全兼容 [Tweakcn](https://tweakcn.com/) 的 CSS Variables 导出：

```css
/* src/styles/globals.css */

:root {
  /* 👇 直接粘贴 Tweakcn 导出的变量 */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  /* 👇 暗色主题变量 */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

**Tailwind 映射：**
```javascript
// tailwind.config.js
colors: {
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // 所有 Shadcn 语义色都映射到 CSS Variables
}
```

**使用方式：**
```tsx
<Button className="bg-primary text-primary-foreground">
  按钮会自动使用 Tweakcn 定义的主题色
</Button>
```

## 目录结构详解

```
devKnife-web/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn UI 组件（自动生成）
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── layout/                # 布局组件
│   │       ├── Sidebar.tsx        # 侧边栏导航
│   │       ├── Header.tsx         # 顶部搜索栏
│   │       ├── CommandPalette.tsx # Cmd+K 搜索
│   │       └── ThemeToggle.tsx    # 主题切换
│   │
│   ├── tools/                     # 工具实现
│   │   ├── uuid-generator/
│   │   │   ├── meta.ts           # 工具元数据
│   │   │   ├── logic.ts          # UUID 生成算法
│   │   │   └── page.tsx          # UI 界面
│   │   └── registry.ts           # 工具注册表
│   │
│   ├── hooks/                     # 自定义 Hooks
│   │   └── useAppStore.ts        # Zustand 状态管理（主题等）
│   │
│   ├── lib/                       # 工具函数
│   │   └── utils.ts              # cn() 样式合并函数
│   │
│   ├── styles/                    # 样式文件
│   │   └── globals.css           # Tailwind + Tweakcn 变量
│   │
│   ├── types/                     # TypeScript 类型
│   │   └── tool.ts               # 工具注册系统类型
│   │
│   ├── App.tsx                    # 主应用组件
│   └── main.tsx                   # 入口文件
│
├── public/                        # 静态资源
├── components.json                # Shadcn UI 配置
├── tailwind.config.js             # Tailwind 配置
├── vite.config.ts                 # Vite + PWA 配置
└── tsconfig.json                  # TypeScript 配置
```

## 技术栈深度解析

### 1. React Router v6 + Lazy Loading

```typescript
// App.tsx
<Routes>
  {tools.map((tool) => (
    <Route
      key={tool.id}
      path={tool.path}
      element={<tool.component />}  // React.lazy() 包裹
    />
  ))}
</Routes>
```

**优势：**
- 路由自动从注册表生成
- 组件按需加载，减少首屏体积
- 代码分割自动优化

### 2. Zustand 状态管理

```typescript
// hooks/useAppStore.ts
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
    }),
    { name: 'devknife-storage' } // LocalStorage 持久化
  )
);
```

**使用场景：**
- 主题切换（light/dark）
- 用户偏好设置
- 工具历史记录

### 3. PWA 配置

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'DevKnife Web',
    short_name: 'DevKnife',
    display: 'standalone',
    // ...
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    // 离线缓存策略
  }
})
```

**功能：**
- 支持安装到桌面/主屏幕
- Service Worker 自动缓存资源
- 离线可用

## 开发最佳实践

### 1. 添加新工具的标准流程

#### Step 1: 创建工具文件夹
```bash
mkdir -p src/tools/base64-encoder
```

#### Step 2: 编写 meta.ts
```typescript
import { FileCode } from 'lucide-react';
import { ToolMeta } from '@/types/tool';

export const base64Meta: ToolMeta = {
  id: 'base64-encoder',
  title: 'Base64 Encoder',
  description: 'Encode and decode Base64 strings',
  icon: FileCode,
  path: '/tools/base64-encoder',
  category: 'crypto',
  keywords: ['base64', 'encode', 'decode', 'binary'],
};
```

#### Step 3: 实现 logic.ts
```typescript
export function encodeBase64(input: string): string {
  return btoa(input);
}

export function decodeBase64(input: string): string {
  return atob(input);
}
```

#### Step 4: 创建 page.tsx
```tsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { encodeBase64, decodeBase64 } from './logic';

export default function Base64EncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Base64 Encoder/Decoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text..."
          />
          <div className="flex gap-2">
            <Button onClick={() => setOutput(encodeBase64(input))}>
              Encode
            </Button>
            <Button onClick={() => setOutput(decodeBase64(input))}>
              Decode
            </Button>
          </div>
          <div className="p-4 bg-muted rounded-md">
            {output}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Step 5: 注册工具
```typescript
// src/tools/registry.ts
import { base64Meta } from './base64-encoder/meta';

export function registerTools(): void {
  toolRegistry.register(base64Meta, '/src/tools/base64-encoder/page.tsx');
  // ...其他工具
}
```

### 2. 使用 Shadcn UI 组件

所有组件都支持 Tweakcn 主题：

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 主题色自动应用
<Button className="bg-primary text-primary-foreground">
  Primary Button
</Button>

// 支持 variant
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### 3. 代码规范

- **TypeScript**: 所有代码必须有类型定义
- **命名规范**: 
  - 组件: PascalCase (`MyComponent.tsx`)
  - 工具函数: camelCase (`generateUUID()`)
  - 常量: UPPER_SNAKE_CASE (`MAX_COUNT`)
- **注释**: 复杂逻辑必须添加注释
- **导入顺序**: React > 第三方库 > 本地组件 > 样式

## 性能优化

1. **代码分割**: 所有工具使用 React.lazy() 按需加载
2. **Tree Shaking**: Vite 自动移除未使用的代码
3. **CSS 优化**: Tailwind 的 PurgeCSS 自动移除未使用的样式
4. **PWA 缓存**: Service Worker 缓存静态资源

## 离线优先原则

**必须遵守：**
- ❌ 不能调用外部 API
- ❌ 不能依赖网络请求
- ✅ 使用浏览器原生 API（Web Crypto API, Canvas, etc.）
- ✅ 使用纯 JavaScript/WASM 库
- ✅ 所有计算在客户端完成

**示例：图片压缩工具**
```typescript
// ✅ 正确：使用纯前端库
import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
  return await imageCompression(file, {
    maxSizeMB: 1,
    useWebWorker: true
  });
}

// ❌ 错误：调用后端 API
export async function compressImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return await fetch('/api/compress', { // ❌ 违反离线原则
    method: 'POST',
    body: formData
  });
}
```

## 常见问题 (FAQ)

### Q: 如何添加新的 Shadcn 组件？
```bash
npx shadcn@latest add [component-name]
# 例如: npx shadcn@latest add dropdown-menu
```

### Q: 如何修改主题颜色？
1. 访问 https://tweakcn.com/
2. 调整颜色并导出 CSS Variables
3. 粘贴到 `src/styles/globals.css` 的 `:root` 和 `.dark` 部分

### Q: 如何调试 PWA？
1. 打开 Chrome DevTools > Application 标签
2. 查看 Service Workers 状态
3. 使用 Network 标签的 Offline 模式测试

### Q: 为什么工具没有出现在侧边栏？
检查 `src/tools/registry.ts` 是否正确调用 `toolRegistry.register()`

## 未来扩展

### 计划中的功能
- [ ] 移动端响应式优化
- [ ] 工具收藏功能
- [ ] 历史记录
- [ ] 导入/导出配置
- [ ] 多语言支持（i18n）
- [ ] 快捷键自定义
- [ ] 工具插件系统

### 技术债务
- 考虑使用 React Query 管理异步状态
- 添加端到端测试（Playwright）
- 性能监控（Web Vitals）

---

**维护者**: DevKnife Team  
**最后更新**: 2025-12-30
