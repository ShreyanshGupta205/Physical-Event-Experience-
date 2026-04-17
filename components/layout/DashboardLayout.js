'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children, fullWidth = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <Navbar onMenuToggle={() => setSidebarOpen(s => !s)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content" style={{ marginLeft: sidebarOpen ? 'var(--sidebar-width)' : '0' }}>
        <div className={`page-content${fullWidth ? ' full-width' : ''} animate-fadeIn`}>
          {children}
        </div>
      </main>
    </div>
  );
}
