import { gasApi } from './gasService';

export const generateCorrectiveAction = async (itemText: string, departmentName: string, policyName?: string): Promise<string> => {
  const prompt = `
أنت خبير في مكافحة العدوى (Infection Control). 
المهمة: كتابة إجراء تصحيحي (Corrective Action) لملاحظة سلبية تم رصدها في مركز عيون.

المعطيات:
- القسم: ${departmentName}
- الملاحظة السلبية: ${itemText}
${policyName ? `- السياسة المرجعية: "${policyName}"` : ''}

التعليمات:
1. اكتب الإجراء التصحيحي مباشرة.
2. يجب أن يكون الإجراء قصيراً جداً ومحدداً (بحد أقصى 10 كلمات).
3. ${policyName ? `يجب أن يكون الإجراء مستوحى من معايير السياسة المذكورة.` : 'اكتب إجراءً مهنياً قياسياً.'}
4. ممنوع كتابة أي مقدمات مثل "بناءً على السياسة..." أو "الإجراء هو...".
5. ممنوع ذكر اسم السياسة في الرد.
6. الرد يجب أن يكون باللغة العربية فقط.
  `;

  // Use the external Google Apps Script API
  try {
    const res = await gasApi('generateAI', { prompt });
    if (res && res.text) {
      return res.text.trim();
    }
    return "حدث خطأ أثناء الاتصال بالخادم.";
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return `خطأ في التوليد: ${error?.message || 'خطأ غير معروف'}`;
  }
};
