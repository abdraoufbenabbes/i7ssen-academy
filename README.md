# إحسان أكاديمي — موقع تعريفي

موقع تعريفي (إعلامي) لأكاديمية **إحسان أكاديمي / i7ssen academy**: دورات طبية على شكل
**موديلات مشروحة** لطلبة كليات الطب (السنة الأولى إلى الرابعة + دورات عامة)، حيث تُحلّ
الأسئلة داخل الشرح نفسه.

الموقع **لا يسجّل ولا يدفع**؛ قناة التواصل والاشتراك الوحيدة هي إنستغرام:
[@i7ssen_academy](https://www.instagram.com/i7ssen_academy/)

## التشغيل

1. افتح `index.html` مباشرة (نقر مزدوج)، أو
2. ارفع المجلد كما هو على GitHub Pages / Netlify / Vercel.

الخطوط من Google Fonts عند توفّر الإنترنت، مع بديل تلقائي.

## الصفحات

| الملف | المحتوى |
|---|---|
| `index.html` | الرئيسية: مقدّمة، مميزات، الأكثر طلبًا، الدورات حسب السنة، خطوات الاستخدام |
| `courses.html` | كل الدورات + بحث وتصفية حسب السنة والمادة والترتيب |
| `course.html` | تفاصيل دورة: `course.html?id=anatomie-year-1` |
| `guide.html` | إرشادات الدراسة: 7 أقسام + جداول + خطة مراجعة |
| `faq.html` | الأسئلة الشائعة (اشتراك، محتوى، أسعار، دعم) |
| `contact.html` | قناة إنستغرام + ما تكتبه في رسالتك |

## الدورات المدرجة (18)

| السنة | الدورات |
|---|---|
| **الأكثر طلبًا** | Interprétation des Radiographies Thoraciques · Anglais Médical |
| الأولى | Biochimie (EN) · Anatomie · Biostatistique (مجانية) · Histologie |
| الثانية | Physiologie — cardio-respiratoire · Physiologie — urinaire |
| الثالثة | Physiopathologie · Sémiologie · Immunologie (مجانية) · Anapathologie · Pharmacologie · Parasitologie · Sémiologie neuro · Radiologie neuro · Biochimie neuro |
| الرابعة | Hématologie |

- السعر: **1,000 دج** لكل دورة، والدورتان المجانيتان مجانية بالكامل.
- الإحصاءات في الرئيسية تُحسب تلقائيًا من `data.js` (العدد، المجانية، السعر، السنوات).

## البنية

```
index.html · courses.html · course.html · guide.html · faq.html · contact.html
assets/css/style.css     التنسيقات (متغيّرات الألوان في :root)
assets/js/data.js        الدورات + السنوات + المواد
assets/js/main.js        التنقّل، البحث والتصفية، بناء صفحات الدورات، الإحصاءات
assets/img/logo.svg      الشعار (نسخة SVG قريبة من الأصل)
```

## طريقة تعديل المحتوى

- **إضافة دورة:** انسخ أي كائن في `COURSES` داخل `assets/js/data.js` وعدّل:
  `id` (فريد)، `title`، `year` (1—4 أو `0` لدورة عامة)، `subject` (من `SUBJECTS`)،
  `language`، `price` (`0` = مجانية)، `badge`/`badgeType`، `featured` (تظهر في
  «الأكثر طلبًا»)، `summary`، `intro`، `outcomes`، `topics`، `requirements`.
- **السنوات التي فيها دورات** تُبنى فلاترها تلقائيًا، والدورات العامة تظهر آخر القائمة.
- **الألوان:** `:root` في أعلى `assets/css/style.css` (الفيروزي `--primary: #2e7e97`).
- **السعر:** متغيّر في كل دورة؛ لو تغيّر سعر المنصة عمومًا عدّل `price` في الدورات.
- **الاسم والشعار:** ابحث عن «إحسان أكاديمي» في ملفات HTML؛ الشعار في `assets/img/logo.svg`.
- **إنستغرام:** الرابط مكرّر في التذييل وصفحة التواصل — ابحث عن `instagram.com/i7ssen_academy`.

## الشعار

`assets/img/logo.svg` إعادة رسم قريبة من الشعار المرفق. لاستخدام الأصل: احفظ الصورة
باسم `assets/img/logo.png` واستبدل `logo.svg` بـ `logo.png` في ملفات HTML الست.

## ملاحظات

- لا توجد شهادات معلنة في الموقع (لم تُذكر من الأكاديمية)، ولا قسم مراجعات، ولا سنة
  في التذييل.
- ملفات `_*.py` و`_logo_preview.png` أدوات فحص مؤقّتة — يمكن حذفها.
