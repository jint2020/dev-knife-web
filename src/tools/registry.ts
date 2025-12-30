/*
 * @Description: 
 * @Author: Jin Tang
 * @Date: 2025-12-30 10:20:08
 * @LastEditors: Jin Tang
 * @LastEditTime: 2025-12-30 11:01:02
 */
/**
 * DevKnife Web - Tool Registry
 * 
 * This file serves as the central registry for all tools in the application.
 * Each tool must be registered here to appear in the sidebar and be searchable.
 * 
 * HOW TO ADD A NEW TOOL:
 * 1. Create a folder in src/tools/ (e.g., src/tools/my-tool/)
 * 2. Create page.tsx (UI component), logic.ts (business logic), meta.ts (metadata)
 * 3. Import the meta from your tool and add it to the registerTools() function
 */

import { toolRegistry } from '@/types/tool';
import { uuidGeneratorMeta } from './uuid-generator/meta';
import { base64EncoderMeta } from './base64-encoder/meta';
import { jsonFormatterMeta } from './json-formatter/meta';
import { hashGeneratorMeta } from './hash-generator/meta';
import { urlEncoderMeta } from './url-encoder/meta';
import { passwordGeneratorMeta } from './password-generator/meta';
import { qrCodeGeneratorMeta } from './qr-code-generator/meta';
import { textDiffMeta } from './text-diff/meta';
import { caseConverterMeta } from './case-converter/meta';
import { loremIpsumMeta } from './lorem-ipsum/meta';
import { imageCompressorMeta } from './image-compressor/meta';
import { imageConverterMeta } from './image-converter/meta';
import { colorBlindnessMeta } from './color-blindness/meta';
import { svgCompressorMeta } from './svg-compressor/meta';

/**
 * Register all tools
 * This function is called once during app initialization
 */
export function registerTools(): void {
  // Generators
  toolRegistry.register(
    uuidGeneratorMeta,
    '/src/tools/uuid-generator/page.tsx'
  );

  toolRegistry.register(
    passwordGeneratorMeta,
    '/src/tools/password-generator/page.tsx'
  );

  toolRegistry.register(
    qrCodeGeneratorMeta,
    '/src/tools/qr-code-generator/page.tsx'
  );

  toolRegistry.register(
    loremIpsumMeta,
    '/src/tools/lorem-ipsum/page.tsx'
  );

  // Crypto & Encoders
  toolRegistry.register(
    base64EncoderMeta,
    '/src/tools/base64-encoder/page.tsx'
  );

  toolRegistry.register(
    urlEncoderMeta,
    '/src/tools/url-encoder/page.tsx'
  );

  toolRegistry.register(
    hashGeneratorMeta,
    '/src/tools/hash-generator/page.tsx'
  );

  // Formatters
  toolRegistry.register(
    jsonFormatterMeta,
    '/src/tools/json-formatter/page.tsx'
  );

  // Text Tools
  toolRegistry.register(
    textDiffMeta,
    '/src/tools/text-diff/page.tsx'
  );

  toolRegistry.register(
    caseConverterMeta,
    '/src/tools/case-converter/page.tsx'
  );

  // Image Tools
  toolRegistry.register(
    imageCompressorMeta,
    '/src/tools/image-compressor/page.tsx'
  );

  toolRegistry.register(
    imageConverterMeta,
    '/src/tools/image-converter/page.tsx'
  );

  toolRegistry.register(
    colorBlindnessMeta,
    '/src/tools/color-blindness/page.tsx'
  );

  toolRegistry.register(
    svgCompressorMeta,
    '/src/tools/svg-compressor/page.tsx'
  );

  // Add more tools here as you develop them:
  // etc...
}

/**
 * Export the registry for use in components
 */
export { toolRegistry };
