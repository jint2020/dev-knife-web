import { QrCode } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const qrCodeGeneratorMeta: ToolMeta = {
  id: 'qr-code-generator',
  title: 'QR Code Generator',
  description: 'Generate QR codes from text, URLs, or other data',
  icon: QrCode,
  path: '/tools/qr-code-generator',
  category: 'generators',
  keywords: ['qr', 'code', 'generator', 'barcode', 'scan', 'url', 'link'],
};
