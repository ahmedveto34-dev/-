import { GoogleGenAI } from "@google/genai";

// Declare google namespace for TypeScript
declare const google: any;

let genAI: any = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check your settings.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

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

  // Check if running in Google Apps Script environment
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((result: string) => resolve(result))
        .withFailureHandler((error: any) => reject(new Error(error.message || 'خطأ في الاتصال بـ Google Apps Script')))
        .generateCorrectiveActionGAS(prompt);
    });
  }

  // Otherwise, use @google/genai in the frontend (for AI Studio development)
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (response.text) {
      return response.text.trim();
    }
    
    throw new Error('استجابة فارغة من الذكاء الاصطناعي');
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return `خطأ في التوليد: ${error?.message || 'خطأ غير معروف'}`;
  }
};
