export type Evaluation = 'met' | 'not_met' | 'na' | null;

export interface ChecklistItem {
  id: string;
  text: string;
  doc?: boolean;
  obs?: boolean;
  int?: boolean;
}

export interface Department {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export const checklistData: Department[] = [
  {
    id: 'A',
    name: 'العيادات الخارجية',
    items: [
      { id: 'A1', text: 'نظافة الكراسي، الأرضيات، الأسطح، أجهزة slit lamp', doc: true, obs: true, int: true },
      { id: 'A2', text: 'تعقيم العدسات (fundus – slit lamp – tonometer – gonio) بالكحول 70% أو مطهر معتمد', obs: true, int: true },
      { id: 'A3', text: 'التزام الفريق الطبي بـ 5 Moments WHO', obs: true, int: true },
      { id: 'A4', text: 'الكمامة والقفازات عند الفحص أو الإجراءات', obs: true },
      { id: 'A5', text: 'التعامل مع النفايات الطبية', obs: true },
      { id: 'A6', text: 'توافر مطهرات اليدين', obs: true },
      { id: 'A7', text: 'توافر مطهرات الصابون و المناديل', obs: true },
      { id: 'A8', text: 'ملصقات غسل اليدين – الوقاية من العدوى', doc: true, obs: true },
      { id: 'A9', text: 'تنظيم جلوس المرضى – منع التكدس', obs: true },
    ],
  },
  {
    id: 'B',
    name: 'غرف التصوير الطبي',
    items: [
      { id: 'B1', text: 'نظافة الكراسي، الأرضيات، الأسطح، أجهزة التصوير', doc: true, obs: true, int: true },
      { id: 'B2', text: 'تعقيم الاجهزة و مواضع الذقن و الرأس', obs: true },
      { id: 'B3', text: 'التزام الفريق الطبي بـ 5 Moments WHO', obs: true, int: true },
      { id: 'B4', text: 'الكمامة والقفازات عند الفحص أو الإجراءات', obs: true },
      { id: 'B5', text: 'التعامل مع النفايات الطبية', obs: true, int: true },
      { id: 'B6', text: 'توافر مطهرات اليدين', obs: true },
      { id: 'B7', text: 'ملصقات غسل اليدين – الوقاية من العدوى', obs: true },
      { id: 'B8', text: 'اتباع سياسات الحقن الامن', obs: true, int: true },
      { id: 'B9', text: 'تنظيم جلوس المرضى – منع التكدس', obs: true },
    ],
  },
  {
    id: 'C',
    name: 'القسم الداخلي',
    items: [
      { id: 'C1', text: 'نظافة الأسرة – الأسطح – الأرضيات – دورات المياه', doc: true, obs: true, int: true },
      { id: 'C2', text: 'التباعد بين الأسرة', obs: true },
      { id: 'C3', text: 'فصل الأدوات وعدم مشاركتها بين المرضى', obs: true },
      { id: 'C4', text: 'التزام التمريض بـ 5 Moments WHO عند رعاية المرضى', obs: true, int: true },
      { id: 'C5', text: 'القفازات – الكمامات – العباءات عند الحاجة متوفرة', obs: true },
      { id: 'C6', text: 'نظافة وتطهير عربات التمريض بين استخدام وآخر', obs: true },
      { id: 'C7', text: 'حاويات sharps بجوار أماكن الإجراء – فصل النفايات المعدية', obs: true },
      { id: 'C8', text: 'غرفة العزل : التهوية – اللافتات – الالتزام بالاحتياطات القياسية', obs: true },
      { id: 'C9', text: 'تطهير الأسطح عالية اللمس', obs: true },
      { id: 'C10', text: 'ملصقات حول غسل الأيدي – و العطس', obs: true },
      { id: 'C11', text: 'التزام الطاقم بالتقنيات العقيمة عند الحقن – تركيب و ازالة القسطرة – IV lines', obs: true, int: true },
    ],
  },
  {
    id: 'D',
    name: 'غرف العمليات',
    items: [
      { id: 'D1', text: 'نظافة الأرضيات والجدران والأسقف – خلو من الغبار – عدم وجود شقوق أو تقشير دهانات', doc: true, obs: true, int: true },
      { id: 'D2', text: 'تخزين الأدوات في عبوات معقمة – فحص صلاحية الأغلفة – منع إعادة الاستخدام غير المصرح', obs: true },
      { id: 'D3', text: 'تنظيف العين – تعقيم الجلد بمطهر معتمد', obs: true },
      { id: 'D4', text: 'التزام الجراح/الممرض بغسل الأيدي الجراحي لمدة زمنية معتمدة', obs: true, int: true },
      { id: 'D5', text: 'ارتداء ملابس معقمة', obs: true },
      { id: 'D6', text: 'غلق الأبواب أثناء الجراحة – منع الحركة غير الضرورية – عدد الأشخاص داخل الغرفة محدود', obs: true },
      { id: 'D7', text: 'تعقيم microscopes – phaco machines قبل وبعد', doc: true, obs: true },
      { id: 'D8', text: 'الحقن الامن', obs: true, int: true },
      { id: 'D9', text: 'التخلص الامن من المخلفات', obs: true },
      { id: 'D10', text: 'اتباع المسارات المعتمدة لجمع المخلفات', obs: true, int: true },
      { id: 'D11', text: 'اتباع المسارات المعتمدة لجمع و توزيع الالات', obs: true, int: true },
      { id: 'D12', text: 'اتباع ارشادات تخزين الالات الجراحية المعقمة', obs: true, int: true },
    ],
  },
  {
    id: 'E',
    name: 'وحدة التعقيم',
    items: [
      { id: 'E1', text: 'فصل مناطق (متسخة – نظيفة – معقمة) – وجود تدفق أحادي الاتجاه', doc: true, obs: true, int: true },
      { id: 'E2', text: 'أحواض – استخدام مياه نقية ومعايير مناسبة', obs: true },
      { id: 'E3', text: 'استخدام أغلفة معتمدة – تاريخ وتعريف واضح – عدم وجود ثقوب أو رطوبة', obs: true },
      { id: 'E4', text: 'استخدام Autoclave/Plasma حسب نوع الأدوات – تحميل صحيح – عدم ازدحام', obs: true },
      { id: 'E5', text: 'وجود مؤشرات داخل كل عبوة معقمة + على كل دورة', obs: true },
      { id: 'E6', text: 'حفظ الأدوات المعقمة في مكان نظيف، جاف، بعيد عن أشعة الشمس والرطوبة', obs: true },
      { id: 'E7', text: 'توثيق تسليم الأدوات للأقسام – FIFO (First In First Out)', doc: true, obs: true },
      { id: 'E8', text: 'فرز الأدوات الصغيرة – تنظيف خاص', obs: true },
      { id: 'E9', text: 'فرز الأدوات غير القابلة للإصلاح – تسجيلها وإخراجها من الخدمة', obs: true },
      { id: 'E10', text: 'الدفاتر مكتملة ( المؤشرات الكيميائية والبيولوجية و الفيزيائية )', doc: true, obs: true },
      { id: 'E11', text: 'يومي قبل أول دورة Bowie-Dick Test', doc: true, obs: true },
      { id: 'E12', text: 'استخدام معدات الوقاية الشخصية', obs: true },
      { id: 'E13', text: 'الالتزام بغسل الايدى', obs: true, int: true },
    ],
  },
  {
    id: 'F',
    name: 'المغسلة',
    items: [
      { id: 'F1', text: 'وجود فصل بين المناطق الملوثة والنظيفة – تدفق أحادي الاتجاه', doc: true, obs: true, int: true },
      { id: 'F2', text: 'جمع الملابس الملوثة في أكياس حمراء محكمة الغلق – نقلها في عربات مخصصة مغلقة', obs: true },
      { id: 'F3', text: 'ارتداء PPE كامل أثناء الفرز – فصل الملابس الممزقة/المشبعة بالدم – إزالة sharps أو أدوات منسية', obs: true },
      { id: 'F4', text: 'الالتزام بساسات مكافحة العدوى بضبط درجات الحرارة', obs: true, int: true },
      { id: 'F5', text: 'صلاحية المطهرات الكيميائية – تخزينها في مكان آمن', obs: true },
      { id: 'F6', text: 'تجفيف الملابس بدرجة حرارة كافية ≤ 80°C – عدم خلط ملابس نظيفة بملوثة', obs: true },
      { id: 'F7', text: 'كي حراري بالضغط', obs: true },
      { id: 'F8', text: 'تخزين الملابس النظيفة في غرفة منفصلة محكمة – بعيدًا عن الرطوبة والحشرات', obs: true },
      { id: 'F9', text: 'نقل الملابس النظيفة في حاويات نظيفة – سجل يوضح الكمية، القسم، المستلم', doc: true, obs: true },
      { id: 'F10', text: 'التزام العاملين بالقفازات – الماسك – الجاون المقاوم للسوائل – أحذية', obs: true },
      { id: 'F11', text: 'غسل اليدين قبل وبعد التعامل مع الملابس – منع الأكل/الشرب في المغسلة – التخلص من sharps', obs: true, int: true },
      { id: 'F12', text: 'نظافة الأرضيات – تهوية جيدة – التخلص من النفايات يوميًا', obs: true },
    ],
  },
];
