import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, Users, Package, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../contexts/AuthContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const allNavItems = [
    { id: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard, roles: ['admin', 'staff'] },
    { id: 'documents', label: 'เอกสาร', icon: FileText, roles: ['admin', 'staff'] },
    { id: 'customers', label: 'ลูกค้า', icon: Users, roles: ['admin', 'staff'] },
    { id: 'products', label: 'สินค้า/บริการ', icon: Package, roles: ['admin', 'staff'] },
    { id: 'settings', label: 'ตั้งค่าบริษัท', icon: Settings, roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r border-slate-200 transition-all duration-300 relative overflow-hidden",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-90"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Overlay to ensure readability */}
        <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-[2px]" />

        <div className={cn("p-6 flex items-center relative z-20", isSidebarCollapsed ? "justify-center" : "justify-between")}>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <FileText className="w-7 h-7 text-white shrink-0 drop-shadow-md" />
            {!isSidebarCollapsed && (
              <span className="text-white drop-shadow-md truncate">DocFlow</span>
            )}
          </h1>
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {isSidebarCollapsed && (
          <div className="flex justify-center mb-4 relative z-20">
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-2 rounded-xl text-white/80 hover:bg-white/20 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* User Profile Summary */}
        {!isSidebarCollapsed && (
          <div className="px-6 mb-6 relative z-20">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">
                    {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1 mt-2 relative z-20">
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
                    ? "bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-4 mb-8 relative z-20">
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-rose-500/20 hover:text-rose-200 transition-all duration-200",
              isSidebarCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={isSidebarCollapsed ? "ออกจากระบบ" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>ออกจากระบบ</span>}
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
            className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-slate-200 z-40 p-4 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                </p>
              </div>
            </div>

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
              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
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
