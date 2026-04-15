import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Archive as ArchiveIcon, Calendar, Clock, User, Download, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Archive: React.FC = () => {
  const { archives, showToast } = useAppContext();

  const handleDownloadPDF = async (report: any) => {
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
    if (report.items.length === 0) {
      itemsHtml = '<div style="text-align: center; padding: 40px; font-weight: bold; color: #10b981;">لا توجد ملاحظات غير مستوفاة في هذا التقرير</div>';
    } else {
      itemsHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: right; width: 40px;">م</th>
              <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: right;">ملاحظات المرور</th>
              <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: right; width: 250px;">الاجراء التصحيحي</th>
            </tr>
          </thead>
          <tbody>
            ${report.items.map((item: any, index: number) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px; color: #e11d48;">${item.negatedText}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px;">${item.correctiveAction || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1e293b; padding-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 8px 0; color: #0f172a;">المركز الدولي للعيون</h1>
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 16px 0; color: #334155;">أ.د أحمد مصطفى عيد</h2>
        <h3 style="font-size: 16px; font-weight: bold; margin: 0; color: #475569;">تقرير المرور الأسبوعي لمكافحة العدوى</h3>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div><strong>التاريخ:</strong> ${report.date}</div>
        <div><strong>الساعة:</strong> ${report.time}</div>
        <div><strong>نسبة الالتزام:</strong> ${report.compliancePercentage}%</div>
        <div style="text-align: center;">
          <strong>توقيع أخصائي مكافحة العدوى:</strong><br/>
          <span style="color: #2563eb; font-weight: 900;">MR:Ahmed Waheed IPC</span>
        </div>
      </div>
      ${itemsHtml}
    `;

    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, { 
        scale: 2, 
        useCORS: true,
        logging: false,
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
      
      pdf.save(`Archived-Report-${report.date}.pdf`);
      showToast('تم تحميل التقرير المؤرشف بنجاح');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('حدث خطأ أثناء إنشاء ملف PDF');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 gap-4">
        <div className="text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">أرشيف التقارير</h2>
          <p className="text-sm md:text-slate-500 font-medium mt-1">سجل التقارير المحفوظة سابقاً</p>
        </div>
      </div>

      {archives.length === 0 ? (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner transform rotate-3">
              <ArchiveIcon size={32} md:size={40} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3">لا يوجد تقارير محفوظة</h3>
            <p className="text-sm md:text-lg text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              لم يتم حفظ أي تقارير بعد. قم بحفظ تقرير من صفحة "تقرير المرور" ليظهر هنا.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {archives.map((report) => (
            <div key={report.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200/60 hover:border-blue-300 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText size={20} md:size={24} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold">
                    {report.items.length} ملاحظات
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-black">
                    التزام: {report.compliancePercentage}%
                  </span>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 text-base md:text-lg mb-4">تقرير مرور مكافحة العدوى</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-slate-600 text-xs md:text-sm font-medium">
                  <Calendar size={14} md:size={16} className="text-slate-400" />
                  <span>التاريخ: {report.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs md:text-sm font-medium">
                  <Clock size={14} md:size={16} className="text-slate-400" />
                  <span>الوقت: {report.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs md:text-sm font-medium">
                  <User size={14} md:size={16} className="text-slate-400" />
                  <span>الأخصائي: {report.inspectorName || 'غير محدد'}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => handleDownloadPDF(report)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 rounded-xl transition-colors text-sm"
                >
                  <Download size={16} md:size={18} />
                  <span>تحميل PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};
