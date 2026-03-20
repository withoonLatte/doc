import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, Users, Package, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard },
    { id: 'documents', label: 'เอกสาร', icon: FileText },
    { id: 'customers', label: 'ลูกค้า', icon: Users },
    { id: 'products', label: 'สินค้า/บริการ', icon: Package },
    { id: 'settings', label: 'ตั้งค่าบริษัท', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-slate-50 border-r border-slate-200 transition-all duration-300 relative",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("p-6 flex items-center", isSidebarCollapsed ? "justify-center" : "justify-between")}>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600 shrink-0" />
            {!isSidebarCollapsed && (
              <span className="bg-gradient-to-r from-blue-600 to-fuchsia-500 bg-clip-text text-transparent truncate">DocFlow</span>
            )}
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isSidebarCollapsed ? "justify-center px-0" : "px-4",
                  activeTab === item.id
                    ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                    : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-900"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-slate-200 flex justify-center">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title={isSidebarCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <h1 className="text-lg font-black flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-fuchsia-500 bg-clip-text text-transparent">DocFlow</span>
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-slate-200 z-40 p-4 shadow-lg"
          >
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
