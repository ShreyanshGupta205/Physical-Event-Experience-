'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children, fullWidth = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasBanner, setHasBanner] = useState(false);

  return (
    <div className="app-layout" style={{ '--banner-offset': hasBanner ? '36px' : '0px' }}>
      <Navbar 
        onMenuToggle={() => setSidebarOpen(s => !s)} 
        onBannerStateChange={setHasBanner}
      />
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content" style={{ marginLeft: sidebarOpen ? 'var(--sidebar-width)' : '0' }}>
        <div className={`page-content${fullWidth ? ' full-width' : ''} animate-fadeIn`} style={{ paddingTop: 'calc(var(--navbar-height) + var(--banner-offset) + 2rem)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

