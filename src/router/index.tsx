/**
 * Application Router
 *
 * Defines the routing structure for DevKnife Web
 * Uses React Router v6 with BrowserRouter
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout route - handles all tool rendering via tab system */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
