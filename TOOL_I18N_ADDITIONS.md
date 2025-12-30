# Tool I18n Translation Keys to Add

This file contains all the translation keys that need to be added to `en.ts` and `zh.ts` for the remaining 10 tools.

## Instructions
1. Add these translations to `src/i18n/locales/en.ts` in the `tools` section
2. Add the corresponding Chinese translations to `src/i18n/locales/zh.ts`
3. Update each tool's page.tsx file to use `t()` function for all hardcoded strings

---

## 2. QR Code Generator (qrGenerator)

### Additional English Translations for en.ts:
```typescript
qrGenerator: {
  // ... existing translations ...
  content: 'Content',
  textUrl: 'Text/URL',
  presets: 'Presets',
  enterTextPlaceholder: 'Enter text, URL, or data to encode...',
  characters: 'characters',
  max: 'Max',
  bytes: 'bytes',
  quickPresets: 'Quick Presets',
  url: 'URL',
  email: 'Email',
  phone: 'Phone',
  sms: 'SMS',
  wifi: 'WiFi',
  wifiFormat: 'WiFi Format',
  wifiFormatCode: 'WIFI:T:WPA;S:NetworkName;P:Password;;',
  wifiFormatDesc: 'T = Security type (WPA, WEP, or blank for none)\nS = Network SSID\nP = Password',
  generating: 'Generating...',
  generateQRCode: 'Generate QR Code',
  options: 'Options',
  errorCorrectionLevel: 'Error Correction Level',
  low: 'L',
  medium: 'M',
  quartile: 'Q',
  high: 'H',
  lowRecovery: 'Low (7% recovery)',
  mediumRecovery: 'Medium (15% recovery)',
  quartileRecovery: 'Quartile (25% recovery)',
  highRecovery: 'High (30% recovery)',
  size: 'Size',
  margin: 'Margin',
  darkColor: 'Dark Color',
  lightColor: 'Light Color',
  preview: 'Preview',
  downloadPNG: 'Download PNG',
  downloadSVG: 'Download SVG',
  enterTextPrompt: 'Enter text and click Generate to create a QR code',
  aboutQRCodes: 'About QR Codes',
  errorCorrectionInfo: 'Error Correction: Higher levels allow the QR code to be read even if partially damaged, but reduce data capacity.',
  capacityInfo: 'Capacity (Level {{level}}):',
  numeric: 'Numeric',
  digits: 'digits',
  alphanumeric: 'Alphanumeric',
  chars: 'chars',
  binary: 'Binary',
  useCases: 'Use Cases',
  useCasesDesc: 'URLs, contact info, WiFi credentials, payment info, event tickets, product tracking, and more.',
  errors: {
    enterText: 'Please enter some text',
    generateFailed: 'Failed to generate QR code',
  },
},
```

### Chinese Translations for zh.ts:
```typescript
qrGenerator: {
  // ... existing translations ...
  content: '内容',
  textUrl: '文本/URL',
  presets: '预设',
  enterTextPlaceholder: '输入要编码的文本、URL 或数据...',
  characters: '字符',
  max: '最大',
  bytes: '字节',
  quickPresets: '快速预设',
  url: 'URL',
  email: '邮箱',
  phone: '电话',
  sms: '短信',
  wifi: 'WiFi',
  wifiFormat: 'WiFi 格式',
  wifiFormatCode: 'WIFI:T:WPA;S:网络名称;P:密码;;',
  wifiFormatDesc: 'T = 安全类型(WPA、WEP 或留空)\nS = 网络 SSID\nP = 密码',
  generating: '生成中...',
  generateQRCode: '生成二维码',
  options: '选项',
  errorCorrectionLevel: '容错等级',
  low: 'L',
  medium: 'M',
  quartile: 'Q',
  high: 'H',
  lowRecovery: '低(7% 恢复)',
  mediumRecovery: '中(15% 恢复)',
  quartileRecovery: '良(25% 恢复)',
  highRecovery: '高(30% 恢复)',
  size: '尺寸',
  margin: '边距',
  darkColor: '深色',
  lightColor: '浅色',
  preview: '预览',
  downloadPNG: '下载 PNG',
  downloadSVG: '下载 SVG',
  enterTextPrompt: '输入文本并点击生成以创建二维码',
  aboutQRCodes: '关于二维码',
  errorCorrectionInfo: '容错纠正:更高的等级允许二维码即使部分损坏也能读取,但会减少数据容量。',
  capacityInfo: '容量(等级 {{level}}):',
  numeric: '数字',
  digits: '位',
  alphanumeric: '字母数字',
  chars: '字符',
  binary: '二进制',
  useCases: '使用场景',
  useCasesDesc: 'URL、联系信息、WiFi 凭据、支付信息、活动票据、产品跟踪等。',
  errors: {
    enterText: '请输入一些文本',
    generateFailed: '生成二维码失败',
  },
},
```

---

## Remaining Tools Summary

Due to the large volume of changes needed, I'll provide a complete script that shows all necessary additions. Let me continue...
