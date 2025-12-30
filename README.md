# DevKnife Web

<div align="center">
  <h3>🔪 Offline-First Developer Toolbox</h3>
  <p>A modular, privacy-focused collection of developer tools that work entirely in your browser</p>
</div>

## ✨ Features

- **🔒 100% Offline**: All tools run in your browser. No data leaves your device.
- **🎨 Customizable Themes**: Built with Shadcn UI + Tweakcn for deep theme customization
- **⚡ Lightning Fast**: React 18 + Vite + Lazy Loading
- **📱 PWA Ready**: Install as a desktop or mobile app
- **🧩 Modular Architecture**: Easy to add new tools
- **🌙 Dark Mode**: Seamless light/dark theme switching
- **⌨️ Command Palette**: Quick tool access with `Cmd/Ctrl + K`

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Core** | React 18, TypeScript, Vite |
| **UI** | Shadcn UI (Radix UI), Tailwind CSS |
| **Theming** | Tweakcn (CSS Variables) |
| **Icons** | Lucide React |
| **State** | Zustand |
| **Routing** | React Router v6 |
| **PWA** | Vite PWA Plugin |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Customizing with Tweakcn

DevKnife Web is designed to work seamlessly with [Tweakcn](https://tweakcn.com/) for theme customization:

1. Visit [tweakcn.com](https://tweakcn.com/)
2. Customize your color palette, border radius, and other design tokens
3. Click "Export" and copy the CSS Variables
4. Paste them into `src/styles/globals.css` (marked sections for light and dark modes)
5. Your entire app will automatically use the new theme!

### Theme Structure

```css
/* src/styles/globals.css */

:root {
  /* 👇 PASTE TWEAKCN LIGHT MODE VARIABLES HERE */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables ... */
}

.dark {
  /* 👇 PASTE TWEAKCN DARK MODE VARIABLES HERE */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... more variables ... */
}
```

## 📦 Project Structure

```
devKnife-web/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   └── layout/          # Layout components (Sidebar, Header, etc.)
│   ├── tools/               # Tool implementations
│   │   ├── uuid-generator/
│   │   │   ├── page.tsx     # UI component
│   │   │   ├── logic.ts     # Business logic
│   │   │   └── meta.ts      # Tool metadata
│   │   └── registry.ts      # Tool registry
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── vite.config.ts           # Vite configuration
└── components.json          # Shadcn UI configuration
```

## 🧩 Adding a New Tool

1. **Create a tool folder** in `src/tools/`:
   ```
   src/tools/my-tool/
   ├── page.tsx    # UI component
   ├── logic.ts    # Business logic (pure functions)
   └── meta.ts     # Tool metadata
   ```

2. **Define metadata** in `meta.ts`:
   ```typescript
   import { ToolMeta } from '@/types/tool';
   import { YourIcon } from 'lucide-react';

   export const myToolMeta: ToolMeta = {
     id: 'my-tool',
     title: 'My Tool',
     description: 'Description of what your tool does',
     icon: YourIcon,
     path: '/tools/my-tool',
     category: 'converters', // or 'crypto', 'generators', etc.
     keywords: ['keyword1', 'keyword2'],
   };
   ```

3. **Implement the UI** in `page.tsx`:
   ```typescript
   import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
   import { Button } from '@/components/ui/button';

   export default function MyToolPage() {
     return (
       <div className="container mx-auto p-6">
         <Card>
           <CardHeader>
             <CardTitle>My Tool</CardTitle>
           </CardHeader>
           <CardContent>
             {/* Your tool UI */}
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

4. **Register the tool** in `src/tools/registry.ts`:
   ```typescript
   import { myToolMeta } from './my-tool/meta';

   export function registerTools(): void {
     toolRegistry.register(myToolMeta, '/src/tools/my-tool/page.tsx');
     // ... other tools
   }
   ```

That's it! Your tool will automatically appear in the sidebar and search.

## 📚 Available Tools

- **UUID Generator**: Generate random UUIDs (v4) for unique identifiers

### Coming Soon

- Base64 Encoder/Decoder
- JSON Formatter & Validator
- URL Encoder/Decoder
- Hash Generator (MD5, SHA-1, SHA-256)
- JWT Decoder
- Cron Expression Parser
- Image Compressor
- SVG Optimizer
- Regex Tester
- Diff Viewer
- Lorem Ipsum Generator
- Password Generator

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write TypeScript with proper types
- Use Shadcn UI components for consistency
- Ensure tools work offline (no external API calls)
- Add proper documentation in code comments
- Test your tool thoroughly

## 📄 License

MIT License

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Tweakcn](https://tweakcn.com/) for the theme customization tool
- [Lucide](https://lucide.dev/) for the icon set
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---

<div align="center">
  Made with ❤️ by developers, for developers
</div>
