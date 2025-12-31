/*
 * @Description: 
 * @Author: Jin Tang
 * @Date: 2025-12-30 11:04:55
 * @LastEditors: Jin Tang
 * @LastEditTime: 2025-12-31 09:44:00
 */
import { Eye } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const colorBlindnessMeta: ToolMeta = {
  id: 'color-blindness',
  title: 'Color Blindness Simulator',
  locales: 'colorBlindness',
  description: 'Simulate how images appear to people with different types of color blindness',
  icon: Eye,
  path: '/tools/color-blindness',
  category: 'image',
  keywords: ['color', 'blindness', 'accessibility', 'vision', 'simulate', 'daltonism'],
};
