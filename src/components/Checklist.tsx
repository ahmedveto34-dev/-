import React, { useState } from 'react';
import { checklistData } from '../data/checklist';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft } from 'lucide-react';

export const Checklist: React.FC = () => {
  const { 
    evaluations, 
    setEvaluation, 
    setActiveTab, 
    showToast, 
    customObservations, 
    addCustomObservation, 
    removeCustomObservation,
    inspectorName,
    setInspectorName,
    reportDate,
    setReportDate
  } = useAppContext();
  const [selectedDeptId, setSelectedDeptId] = useState(checklistData[0].id);
  const [newObsText, setNewObsText] = useState('');

  const activeDept = checklistData.find(d => d.id === selectedDeptId) || checklistData[0];
  const deptCustomObs = customObservations.filter(obs => obs.departmentId === selectedDeptId);

  const getProgress = (deptId: string) => {
    const dept = checklistData.find(d => d.id === deptId);
    if (!dept) return 0;
    const evaluated = dept.items.filter(item => evaluations[item.id] !== undefined).length;
    return Math.round((evaluated / dept.items.length) * 100);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObsText.trim()) return;
    addCustomObservation(newObsText.trim(), selectedDeptId);
    setNewObsText('');
    showToast('تم إضافة ملاحظة مخصصة');
  };

  const handleSaveAndGoToReport = () => {
    showToast('تم حفظ قائمة المرور بنجاح');
    setActiveTab('report');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">المرور الأسبوعي</h2>
        <p className="text-sm md:text-base text-slate-500 font-medium">قم بتعبئة بيانات المرور وتقييم الأقسام</p>
      </div>

      {/* Inspector Info & Department Selector */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-slate-500 uppercase mr-1">اسم القائم بالمرور</label>
            <div className="relative">
              <input
                type="text"
                placeholder="أدخل اسمك بالكامل..."
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-slate-500 uppercase mr-1">تاريخ المرور</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-slate-500 uppercase mr-1">اختر القسم للمعاينة</label>
          <div className="flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
            {checklistData.map((dept) => {
              const progress = getProgress(dept.id);
              const isSelected = selectedDeptId === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`snap-center shrink-0 flex flex-col gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 w-40 md:w-48 text-right ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-bold text-sm md:text-base ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                    {dept.name}
                  </span>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-auto">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] md:text-xs text-slate-500 font-medium">{progress}% مكتمل</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Department Items */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-6 md:px-8 py-4 md:py-5 flex justify-between items-center text-white">
          <h3 className="text-lg md:text-xl font-bold">{activeDept.name}</h3>
          <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold">
            {activeDept.items.length} بنود
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px] md:min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-center font-bold text-slate-600 w-16">م</th>
                <th className="p-4 text-right font-bold text-slate-600">بند التقييم</th>
                <th className="p-4 text-center font-bold text-slate-600 w-32">طريقة التحقق</th>
                <th className="p-4 text-center font-bold text-slate-600 w-72">التقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeDept.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 text-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm mx-auto group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-800 font-semibold text-base leading-relaxed">{item.text}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      {item.doc && <span className="w-7 h-7 flex items-center justify-center text-[10px] font-black bg-blue-50 text-blue-600 rounded-md border border-blue-100" title="Document">D</span>}
                      {item.obs && <span className="w-7 h-7 flex items-center justify-center text-[10px] font-black bg-purple-50 text-purple-600 rounded-md border border-purple-100" title="Observation">O</span>}
                      {item.int && <span className="w-7 h-7 flex items-center justify-center text-[10px] font-black bg-amber-50 text-amber-600 rounded-md border border-amber-100" title="Interview">I</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                      <button
                        onClick={() => setEvaluation(item.id, 'met')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          evaluations[item.id] === 'met'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-transparent text-slate-500 hover:bg-white hover:text-emerald-600'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        <span>مستوفى</span>
                      </button>
                      <button
                        onClick={() => setEvaluation(item.id, 'not_met')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          evaluations[item.id] === 'not_met'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                            : 'bg-transparent text-slate-500 hover:bg-white hover:text-rose-600'
                        }`}
                      >
                        <XCircle size={14} />
                        <span>غير مستوفى</span>
                      </button>
                      <button
                        onClick={() => setEvaluation(item.id, 'na')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          evaluations[item.id] === 'na'
                            ? 'bg-slate-600 text-white shadow-md shadow-slate-600/20'
                            : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-700'
                        }`}
                      >
                        <MinusCircle size={14} />
                        <span>N/A</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Custom Observations */}
              {deptCustomObs.map((obs, idx) => (
                <tr key={obs.id} className="bg-amber-50/30 hover:bg-amber-50/50 transition-colors group">
                  <td className="p-4 text-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mx-auto">
                      {activeDept.items.length + idx + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-800 font-bold text-base leading-relaxed">{obs.text}</p>
                      <button 
                        onClick={() => removeCustomObservation(obs.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors"
                        title="حذف الملاحظة"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md border border-amber-200">CUSTOM</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-amber-200">
                      <button
                        onClick={() => setEvaluation(obs.id, 'met')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          evaluations[obs.id] === 'met'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        <span>مستوفى</span>
                      </button>
                      <button
                        onClick={() => setEvaluation(obs.id, 'not_met')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          evaluations[obs.id] === 'not_met'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-rose-600'
                        }`}
                      >
                        <XCircle size={14} />
                        <span>غير مستوفى</span>
                      </button>
                      <button
                        onClick={() => setEvaluation(obs.id, 'na')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          evaluations[obs.id] === 'na'
                            ? 'bg-slate-600 text-white shadow-md shadow-slate-600/20'
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                      >
                        <MinusCircle size={14} />
                        <span>N/A</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Add Custom Observation Form Row */}
              <tr className="bg-slate-50/80">
                <td colSpan={4} className="p-4">
                  <form onSubmit={handleAddCustom} className="flex gap-3">
                    <input
                      type="text"
                      value={newObsText}
                      onChange={(e) => setNewObsText(e.target.value)}
                      placeholder="إضافة ملاحظة إضافية لهذا القسم..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                    <button
                      type="submit"
                      className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all shadow-md shadow-slate-200 active:scale-95"
                    >
                      إضافة ملاحظة
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <div className="mt-6 md:mt-8 flex justify-center md:justify-end">
        <button
          onClick={handleSaveAndGoToReport}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 font-bold text-lg transform hover:scale-105"
        >
          <span>حفظ والانتقال للتقرير</span>
          <ArrowLeft size={20} />
        </button>
      </div>
    </div>
  );

};


