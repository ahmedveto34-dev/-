/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Checklist } from './components/Checklist';
import { Report } from './components/Report';
import { Statistics } from './components/Statistics';
import { Policies } from './components/Policies';
import { Archive } from './components/Archive';
import { Login } from './components/Login';
import { Eye, Menu, AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  public state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans" dir="rtl">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">عذراً، حدث خطأ تقني</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              واجه التطبيق مشكلة غير متوقعة. يرجى محاولة إعادة تحميل الصفحة.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl mb-8 text-right overflow-auto max-h-32">
              <code className="text-xs text-rose-600 font-mono">
                {this.state.error?.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <RefreshCw size={20} />
              <span>إعادة تحميل التطبيق</span>
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const AppContent = () => {
  const { activeTab, setActiveTab } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden" dir="rtl">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="flex-1 flex flex-col h-screen overflow-hidden print:overflow-visible print:bg-white relative">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Eye className="text-white w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-black text-slate-800 leading-tight">المركز الدولي للعيون</h1>
              <p className="text-[10px] md:text-sm text-slate-500 font-bold">أ.د أحمد مصطفى عيد</p>
            </div>
          </div>
          <div className="hidden sm:block bg-blue-50 text-blue-700 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold border border-blue-100 shadow-sm">
            نظام مكافحة العدوى
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'checklist' && <Checklist />}
            {activeTab === 'report' && <Report />}
            {activeTab === 'statistics' && <Statistics />}
            {activeTab === 'archive' && <Archive />}
            {activeTab === 'policies' && <Policies />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    console.log("App initialized");
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        {!isAuthenticated ? (
          <Login onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <AppContent />
        )}
      </AppProvider>
    </ErrorBoundary>
  );
}




