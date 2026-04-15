import React, { useRef } from 'react';
import { FileText, Plus, FileDown, Calendar, FolderPlus, XCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Policies: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { policies, addPolicies, removePolicy, showToast, isAdmin } = useAppContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files as FileList).map((file: File) => file.name.replace(/\.[^/.]+$/, ""));
      addPolicies(fileNames);
      showToast(`تمت إضافة ${fileNames.length} سياسة بنجاح`);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60">
        <div className="text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">سياسات مكافحة العدوى</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">مكتبة السياسات والإجراءات المعتمدة</p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.doc,.docx"
          multiple
        />
        
        {/* @ts-ignore - webkitdirectory is not standard but works in most modern browsers */}
        <input 
          type="file" 
          ref={folderInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          webkitdirectory="true"
          directory="true"
          multiple
        />
        
        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 font-bold transform hover:scale-105 text-sm md:text-base"
            >
              <Plus size={20} />
              <span>إضافة ملفات</span>
            </button>
            <button 
              onClick={() => folderInputRef.current?.click()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-500/10 font-bold transform hover:scale-105 text-sm md:text-base"
            >
              <FolderPlus size={20} />
              <span>رفع مجلد كامل</span>
            </button>
          </div>
        )}
      </div>

      {policies.length === 0 ? (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner transform rotate-3">
              <FileText size={32} md:size={40} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3">لا توجد سياسات مضافة</h3>
            <p className="text-sm md:text-lg text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              {isAdmin 
                ? 'قم بالضغط على زر "إضافة سياسة جديدة" لرفع ملفات السياسات والإجراءات الخاصة بمكافحة العدوى.'
                : 'سيتم عرض السياسات والإجراءات هنا بمجرد إضافتها من قبل المسؤول.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200/60 hover:border-blue-300 transition-colors group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText size={20} md:size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-base md:text-lg mb-2 line-clamp-2" title={policy.name}>
                {policy.name}
              </h3>
              <div className="flex items-center justify-between gap-2 text-slate-500 text-xs md:text-sm font-medium mt-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} md:size={16} />
                  <span>تاريخ الإضافة: {policy.date}</span>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من حذف هذه السياسة؟')) {
                        removePolicy(policy.id);
                      }
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-colors text-sm">
                  <FileDown size={16} md:size={18} />
                  <span>تحميل الملف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};


