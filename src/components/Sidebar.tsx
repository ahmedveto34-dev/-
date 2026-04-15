import React from 'react';
import { ClipboardList, FileText, PieChart, ShieldAlert, LogOut, Archive, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const tabs = [
    { id: 'checklist', label: 'قائمة المرور', icon: ClipboardList },
    { id: 'report', label: 'تقرير المرور', icon: FileText },
    { id: 'statistics', label: 'الإحصائيات', icon: PieChart },
    { id: 'archive', label: 'الأرشيف', icon: Archive },
    { id: 'policies', label: 'سياسات مكافحة العدوى', icon: ShieldAlert },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`fixed inset-y-0 right-0 w-72 bg-slate-900 text-white flex flex-col h-full z-50 transition-transform duration-300 transform lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} print:hidden overflow-hidden shadow-2xl lg:shadow-none`}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        <div className="p-8 border-b border-white/10 relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-1">
              مكافحة العدوى
            </h2>
            <p className="text-sm text-slate-400 font-medium">لوحة التحكم الإدارية</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50'
                    : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-bold text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 relative z-10">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-rose-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};



