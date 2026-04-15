import React, { useState } from 'react';
import { checklistData } from '../data/checklist';
import { useAppContext } from '../context/AppContext';
import { generateCorrectiveAction } from '../services/aiService';
import { Printer, Sparkles, Loader2, Save, Download, PlusCircle } from 'lucide-react';
import { negateText } from '../utils/textUtils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Report: React.FC = () => {
  const {
    evaluations,
    correctiveActions,
    setCorrectiveAction,
    reportDate,
    setReportDate,
    reportTime,
    setReportTime,
    inspectorName,
    setInspectorName,
    showToast,
    saveToArchive,
    resetReport,
    customObservations,
    policies,
  } = useAppContext();

  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);

  const notMetItems = [
    ...checklistData.flatMap((dept) =>
      dept.items
        .filter((item) => evaluations[item.id] === 'not_met')
        .map((item) => ({ ...item, departmentName: dept.name, negatedText: negateText(item.text) }))
    ),
    ...customObservations
      .filter((obs) => evaluations[obs.id] === 'not_met')
      .map((obs) => {
        const dept = checklistData.find(d => d.id === obs.departmentId);
        return {
          id: obs.id,
          text: obs.text,
          departmentName: dept ? dept.name : 'قسم مخصص',
          negatedText: obs.text.startsWith('عدم') ? obs.text : `عدم ${obs.text}`
        };
      })
  ];

  const metCount = Object.values(evaluations).filter(v => v === 'met').length;
  const notMetCount = Object.values(evaluations).filter(v => v === 'not_met').length;
  const naCount = Object.values(evaluations).filter(v => v === 'na').length;
  const totalEvaluated = metCount + notMetCount;
  const compliancePercentage = totalEvaluated > 0 ? Math.round((metCount / totalEvaluated) * 100) : 0;

  const handleGenerateAI = async (itemId: string, itemText: string, departmentName: string, policyName?: string) => {
    setIsGenerating((prev) => ({ ...prev, [itemId]: true }));
    const action = await generateCorrectiveAction(itemText, departmentName, policyName);
    
    // If a policy was selected, we might want to append or replace. Let's replace to be clean, or append if there's existing text.
    // The user requested "only the corrective action from the policy", so we replace.
    setCorrectiveAction(itemId, action);
    setIsGenerating((prev) => ({ ...prev, [itemId]: false }));
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-report');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('يرجى السماح بالنوافذ المنبثقة للطباعة');
      return;
    }

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>تقرير مكافحة العدوى</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 10px; color: #000 !important; }
            @media print {
              @page { size: A4; margin: 10mm; }
              .no-print { display: none; }
              textarea { border: none !important; resize: none !important; overflow: hidden !important; color: #000 !important; font-weight: 900 !important; }
              table { page-break-inside: auto; width: 100% !important; border: 2px solid #000 !important; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              thead { display: table-header-group; }
              tfoot { display: table-footer-group; }
              th, td { border: 1.5px solid #000 !important; color: #000 !important; padding: 8px !important; }
              .text-rose-600 { color: #000 !important; font-weight: 900 !important; }
              h1, h2, h3 { color: #000 !important; font-weight: 900 !important; }
              .bg-slate-900 { background-color: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; }
              .print-bold { font-weight: 900 !important; color: #000 !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    showToast('جاري تحضير ملف PDF...');
    
    // Create a temporary hidden div to render the report for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.padding = '20px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.direction = 'rtl';
    tempDiv.style.fontFamily = 'Cairo, sans-serif';
    
    // Build HTML content
    let itemsHtml = '';
    if (notMetItems.length === 0) {
      itemsHtml = '<div style="text-align: center; padding: 40px; font-weight: bold; color: #10b981; border: 2px dashed #a7f3d0; border-radius: 20px;">لا توجد ملاحظات غير مستوفاة في هذا التقرير</div>';
    } else {
      itemsHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 2px solid #0f172a;">
          <thead>
            <tr style="background-color: #0f172a; color: white;">
              <th style="border: 1px solid #334155; padding: 10px; text-align: center; width: 40px;">م</th>
              <th style="border: 1px solid #334155; padding: 10px; text-align: right;">ملاحظات المرور (السلبيات)</th>
              <th style="border: 1px solid #334155; padding: 10px; text-align: right; width: 250px;">الإجراء التصحيحي المقترح</th>
            </tr>
          </thead>
          <tbody>
            ${notMetItems.map((item, index) => `
              <tr>
                <td style="border: 1px solid #000000; padding: 10px; text-align: center; font-weight: bold; background-color: #f8fafc; color: #000000;">${index + 1}</td>
                <td style="border: 1px solid #000000; padding: 10px; color: #000000; font-weight: bold; font-size: 14px;">${item.negatedText}</td>
                <td style="border: 1px solid #000000; padding: 10px; color: #000000; font-weight: bold; font-size: 14px;">${correctiveActions[item.id] || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 4px solid #0f172a; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: start;">
        <div style="text-align: right;">
          <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #0f172a;">المركز الدولي للعيون</h1>
          <h2 style="font-size: 18px; font-weight: bold; margin: 4px 0 0 0; color: #334155;">أ.د أحمد مصطفى عيد</h2>
          <p style="font-size: 14px; margin: 4px 0 0 0; color: #64748b;">وحدة مكافحة العدوى</p>
        </div>
        <div style="border: 2px solid #0f172a; padding: 8px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #0f172a;">Infection Control</div>
          <div style="height: 2px; background: #0f172a; margin: 4px 0;"></div>
          <div style="font-size: 8px; font-weight: bold; color: #475569;">Quality Assurance</div>
        </div>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="background-color: #0f172a; color: white; padding: 8px 30px; border-radius: 50px; font-weight: 900; font-size: 18px;">تقرير المرور الأسبوعي لمكافحة العدوى</span>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; background-color: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div><strong>التاريخ:</strong> ${reportDate}</div>
        <div><strong>الساعة:</strong> ${reportTime}</div>
        <div><strong>الأخصائي:</strong> ${inspectorName || 'غير محدد'}</div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; text-align: center; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
        <div><div style="font-size: 10px; color: #64748b;">مستوفى</div><div style="font-weight: 900; color: #10b981;">${metCount}</div></div>
        <div><div style="font-size: 10px; color: #64748b;">غير مستوفى</div><div style="font-weight: 900; color: #e11d48;">${notMetCount}</div></div>
        <div><div style="font-size: 10px; color: #64748b;">N/A</div><div style="font-weight: 900; color: #64748b;">${naCount}</div></div>
        <div style="background-color: #eff6ff; border-radius: 8px; padding: 4px;"><div style="font-size: 10px; color: #2563eb;">نسبة الالتزام</div><div style="font-weight: 900; color: #1d4ed8;">${compliancePercentage}%</div></div>
      </div>
      
      ${itemsHtml}
      
      <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <div style="text-align: center;">
          <div style="border-bottom: 2px solid #94a3b8; margin-bottom: 8px; height: 40px;"></div>
          <p style="font-weight: bold; color: #1e293b; margin: 0;">توقيع أخصائي مكافحة العدوى</p>
          <p style="color: #2563eb; font-weight: 900; margin: 4px 0 0 0;">MR:Ahmed Waheed IPC</p>
        </div>
        <div style="text-align: center;">
          <div style="border-bottom: 2px solid #94a3b8; margin-bottom: 8px; height: 40px;"></div>
          <p style="font-weight: bold; color: #1e293b; margin: 0;">اعتماد مدير المركز</p>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    try {
      // Use a smaller scale if the report is very long to avoid canvas size limits
      const scale = notMetItems.length > 20 ? 1.5 : 2;
      
      const canvas = await html2canvas(tempDiv, { 
        scale: scale, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`IC-Report-${reportDate}.pdf`);
      showToast('تم تحميل التقرير بنجاح');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('حدث خطأ أثناء إنشاء ملف PDF');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const handleSaveReport = () => {
    const reportToSave = {
      id: Date.now().toString(),
      date: reportDate,
      time: reportTime,
      inspectorName,
      compliancePercentage,
      items: notMetItems.map(item => ({
        id: item.id,
        departmentName: item.departmentName,
        text: item.text,
        negatedText: item.negatedText,
        correctiveAction: correctiveActions[item.id] || ''
      }))
    };
    saveToArchive(reportToSave);
    showToast('تم حفظ التقرير بنجاح في الأرشيف');
    setIsSaved(true);
  };

  const handleNewReport = () => {
    resetReport();
    setIsSaved(false);
  };

  if (isSaved) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
          <Save size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">تم حفظ التقرير بنجاح!</h2>
        <p className="text-slate-500 font-medium mb-10 text-center max-w-md">
          تمت إضافة التقرير إلى الأرشيف بنجاح. يمكنك الآن البدء في تقرير جديد أو استعراض الأرشيف.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none justify-center">
          <button
            onClick={handleNewReport}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 font-bold text-lg transform hover:scale-105"
          >
            <PlusCircle size={24} />
            <span>بدء تقرير جديد</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="text-center md:text-right w-full md:w-auto">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">تقرير المرور</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm md:text-base text-slate-500 font-medium">الملاحظات غير المستوفاة والإجراءات التصحيحية</p>
            <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-xs font-black">
              نسبة الالتزام: {compliancePercentage}%
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center w-full md:w-auto">
          <button
            onClick={handleSaveReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 font-bold text-sm md:text-base"
          >
            <Save size={18} />
            <span className="whitespace-nowrap">حفظ في الأرشيف</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 font-bold text-sm md:text-base"
          >
            <Download size={18} />
            <span className="whitespace-nowrap">تحميل PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm font-bold text-sm md:text-base"
          >
            <Printer size={18} />
            <span className="whitespace-nowrap">طباعة</span>
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div id="printable-report" className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 md:p-12 print:shadow-none print:border-none print:p-0">
        {/* Header with Logo Placeholder and Formal Text */}
        <div className="flex justify-between items-start mb-10 border-b-4 border-slate-900 pb-8">
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">المركز الدولي للعيون</h1>
            <h2 className="text-lg md:text-xl font-bold text-slate-700 mt-1">أ.د أحمد مصطفى عيد</h2>
            <p className="text-sm text-slate-500 font-bold mt-2">وحدة مكافحة العدوى</p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center border-2 border-slate-900 p-4 rounded-xl">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">Infection Control</span>
            <div className="w-12 h-1 bg-slate-900 my-1"></div>
            <span className="text-[10px] font-bold text-slate-600">Quality Assurance</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="inline-block px-8 py-2 bg-slate-900 text-white text-lg md:text-xl font-black rounded-full">تقرير المرور الأسبوعي لمكافحة العدوى</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200 print:bg-transparent print:border-slate-800 print:rounded-none print:mb-4 print:p-2 print:gap-2">
          <div className="flex flex-col gap-1 print:flex-row print:gap-2 print:items-center">
            <span className="text-xs font-black text-slate-500 uppercase print:text-[10px]">التاريخ</span>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none py-1 font-bold text-slate-800 print:border-none print:text-xs"
            />
          </div>
          <div className="flex flex-col gap-1 print:flex-row print:gap-2 print:items-center">
            <span className="text-xs font-black text-slate-500 uppercase print:text-[10px]">الساعة</span>
            <input
              type="time"
              value={reportTime}
              onChange={(e) => setReportTime(e.target.value)}
              className="bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none py-1 font-bold text-slate-800 print:border-none print:text-xs"
            />
          </div>
          <div className="flex flex-col gap-1 print:flex-row print:gap-2 print:items-center">
            <span className="text-xs font-black text-slate-500 uppercase print:text-[10px]">أخصائي مكافحة العدوى</span>
            <input
              type="text"
              placeholder="الاسم بالكامل"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none py-1 font-bold text-slate-800 print:border-none print:text-xs"
            />
          </div>
        </div>

        {/* Summary of Results in Print */}
        <div className="hidden print:grid grid-cols-4 gap-4 mb-4 text-center border-y-2 border-slate-200 py-2">
          <div>
            <p className="text-[10px] font-bold text-slate-500">إجمالي المستوفى</p>
            <p className="text-lg font-black text-emerald-600">{metCount}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500">إجمالي غير المستوفى</p>
            <p className="text-lg font-black text-rose-600">{notMetCount}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500">غير منطبق (N/A)</p>
            <p className="text-lg font-black text-slate-600">{naCount}</p>
          </div>
          <div className="bg-blue-50 rounded-lg">
            <p className="text-[10px] font-bold text-blue-600">نسبة الالتزام</p>
            <p className="text-lg font-black text-blue-700">{compliancePercentage}%</p>
          </div>
        </div>

        {notMetItems.length === 0 ? (
          <div className="text-center py-20 bg-emerald-50 rounded-3xl border-2 border-dashed border-emerald-200 print:hidden">
            <div className="w-20 h-20 bg-white text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200/50">
              <Sparkles size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">المنشأة مستوفاة بالكامل</h3>
            <p className="text-slate-500 font-medium">لم يتم رصد أي ملاحظات سلبية خلال هذا المرور.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border-2 border-slate-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white print:text-black print:bg-slate-100 print:border-b-2 print:border-slate-900">
                  <th className="p-4 text-center w-16 font-black border-l border-white/20 print:p-2 print:text-xs">م</th>
                  <th className="p-4 text-right font-black border-l border-white/20 print:p-2 print:text-xs">ملاحظات المرور (السلبيات)</th>
                  <th className="p-4 text-right w-1/3 font-black print:p-2 print:text-xs">الإجراء التصحيحي المقترح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {notMetItems.map((item, index) => (
                  <tr key={item.id} className="print:break-inside-avoid">
                    <td className="p-4 text-center font-black text-slate-400 bg-slate-50 border-l border-slate-200 print:p-2 print:text-xs print:bg-transparent">{index + 1}</td>
                    <td className="p-4 text-rose-600 font-bold border-l border-slate-200 leading-relaxed print:p-2 print:text-sm print:text-black print:font-black">{item.negatedText}</td>
                    <td className="p-4 align-top print:p-2">
                      <div className="flex flex-col gap-3">
                        <textarea
                          value={correctiveActions[item.id] || ''}
                          onChange={(e) => setCorrectiveAction(item.id, e.target.value)}
                          placeholder="سيتم كتابة الإجراء هنا..."
                          className="w-full min-h-[100px] p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all print:bg-transparent print:border-none print:p-0 print:min-h-0 print:text-sm print:text-black print:font-black font-medium text-slate-700"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 print:hidden">
                          <button
                            onClick={() => handleGenerateAI(item.id, item.text, item.departmentName)}
                            disabled={isGenerating[item.id]}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                          >
                            {isGenerating[item.id] ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Sparkles size={14} />
                            )}
                            <span>توليد إجراء بالذكاء الاصطناعي</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer for Signatures */}
        <div className="mt-16 grid grid-cols-2 gap-20 print:mt-20">
          <div className="text-center">
            <div className="border-b-2 border-slate-400 mb-2 h-12"></div>
            <p className="font-black text-slate-800">توقيع أخصائي مكافحة العدوى</p>
            <p className="text-blue-600 font-black mt-2">MR:Ahmed Waheed IPC</p>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-slate-400 mb-2 h-12"></div>
            <p className="font-black text-slate-800">اعتماد مدير المركز</p>
          </div>
        </div>
      </div>

    </div>
  );
};




