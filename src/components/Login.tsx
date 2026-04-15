import React, { useState } from 'react';
import { Eye, Lock, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAdmin } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'waheed') {
      setIsAdmin(false);
      onLogin();
    } else if (password === 'waheed-admin') {
      setIsAdmin(true);
      onLogin();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 font-sans" dir="rtl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[2rem] shadow-2xl border border-white/20 w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.4)] transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Eye className="text-white w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">المركز الدولي للعيون</h1>
          <p className="text-blue-200 font-medium text-lg">أ.د أحمد مصطفى عيد</p>
          <div className="mt-6 inline-block px-5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-bold tracking-wider">
            نظام مكافحة العدوى
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-2">
            <p className="text-blue-400 font-black text-sm">MR:Ahmed Waheed IPC</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-200 mb-2">كلمة المرور</label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="block w-full pr-12 pl-4 py-4 border border-white/10 rounded-2xl leading-5 bg-black/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-black/30 transition-all text-lg"
                placeholder="أدخل كلمة المرور..."
              />
            </div>
            {error && <p className="mt-3 text-sm font-medium text-rose-400 bg-rose-400/10 py-2 px-3 rounded-lg border border-rose-400/20">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all transform hover:scale-[1.02] hover:shadow-blue-500/25"
          >
            <span>تسجيل الدخول</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
