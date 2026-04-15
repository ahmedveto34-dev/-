import React from 'react';
import { checklistData } from '../data/checklist';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Printer, TrendingUp, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export const Statistics: React.FC = () => {
  const { evaluations } = useAppContext();

  const stats = checklistData.map((dept) => {
    const total = dept.items.length;
    const met = dept.items.filter((item) => evaluations[item.id] === 'met').length;
    const notMet = dept.items.filter((item) => evaluations[item.id] === 'not_met').length;
    const na = dept.items.filter((item) => evaluations[item.id] === 'na').length;
    const score = total - na > 0 ? Math.round((met / (total - na)) * 100) : 0;

    return {
      name: dept.name,
      met,
      notMet,
      na,
      score,
    };
  });

  const overallMet = stats.reduce((acc, curr) => acc + curr.met, 0);
  const overallNotMet = stats.reduce((acc, curr) => acc + curr.notMet, 0);
  const overallNA = stats.reduce((acc, curr) => acc + curr.na, 0);
  const overallTotal = overallMet + overallNotMet;
  const overallScore = overallTotal > 0 ? Math.round((overallMet / overallTotal) * 100) : 0;

  const pieData = [
    { name: 'مستوفى', value: overallMet, color: '#10b981' },
    { name: 'غير مستوفى', value: overallNotMet, color: '#f43f5e' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">الإحصائيات والنتائج</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">تحليل أداء مكافحة العدوى بالأقسام</p>
        </div>
        <button
          onClick={handlePrint}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-bold"
        >
          <Printer size={18} />
          <span>طباعة الإحصائيات</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <span className="text-slate-500 font-bold text-sm mb-1">النسبة العامة</span>
          <span className="text-3xl font-black text-slate-800">{overallScore}%</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-slate-500 font-bold text-sm mb-1">إجمالي المستوفى</span>
          <span className="text-3xl font-black text-emerald-600">{overallMet}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
            <XCircle size={24} />
          </div>
          <span className="text-slate-500 font-bold text-sm mb-1">إجمالي غير المستوفى</span>
          <span className="text-3xl font-black text-rose-600">{overallNotMet}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-4">
            <MinusCircle size={24} />
          </div>
          <span className="text-slate-500 font-bold text-sm mb-1">غير منطبق (N/A)</span>
          <span className="text-3xl font-black text-slate-600">{overallNA}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Overall Distribution Chart */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center lg:text-right">توزيع النتائج العام</h3>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance Chart */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center lg:text-right">أداء الأقسام (%)</h3>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">تفاصيل الأداء حسب القسم</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-right font-bold text-slate-600 border-b border-slate-200">القسم</th>
                <th className="p-4 text-center font-bold text-emerald-600 border-b border-slate-200">مستوفى</th>
                <th className="p-4 text-center font-bold text-rose-600 border-b border-slate-200">غير مستوفى</th>
                <th className="p-4 text-center font-bold text-slate-500 border-b border-slate-200">N/A</th>
                <th className="p-4 text-center font-bold text-blue-600 border-b border-slate-200">النسبة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.map((dept) => (
                <tr key={dept.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{dept.name}</td>
                  <td className="p-4 text-center font-semibold text-emerald-600">{dept.met}</td>
                  <td className="p-4 text-center font-semibold text-rose-600">{dept.notMet}</td>
                  <td className="p-4 text-center font-semibold text-slate-500">{dept.na}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      dept.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                      dept.score >= 70 ? 'bg-blue-100 text-blue-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {dept.score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

