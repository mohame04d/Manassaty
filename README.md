<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success.svg?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge" alt="License">

  <h1>🚀 منصتي (Manassaty) | Techacher SaaS</h1>
</div>

<br />

## 🌟 نبذة عن المشروع
**منصتي (Manassaty)** هو مشروع SaaS متكامل مصمم خصيصاً لخدمة المدرسين في مصر والوطن العربي. يتيح النظام لأي مدرس إنشاء **منصته التعليمية الخاصة (بنظام Subdomains)** في ثوانٍ معدودة.
يقوم المدرس برفع الكورسات، إنشاء الامتحانات التفاعلية، ومتابعة تقدم الطلاب، بينما تتكفل المنصة بكل الجوانب التقنية والإدارية مثل الدفع الإلكتروني وتصحيح الامتحانات بل وإرسال درجات الطلاب لأولياء أمورهم!

---

## 🔥 المميزات الخارقة (Features)

### 👨‍🏫 بوابة المدرسين (Teacher Space)
- **منصة خاصة (Subdomain):** كل مدرس يمتلك رابطاً خاصاً به (مثل: `mr-ahmed.manassaty.com`).
- **إدارة الكورسات (Course Management):** إضافة فيديوهات، دروس، نصوص، وإدارة كاملة للمحتوى.
- **الامتحانات الآلية (Auto-graded Quizzes):** إضافة امتحانات للدروس، ليقوم النظام بتصحيحها فوراً دون تدخل بشري.
- **نظام دفع متكامل:** متصل ببوابة **Paymob** لدعم الدفع المحلي (محافظ إلكترونية وكروت بنكية).

### 🎓 بوابة الطلاب (Student Portal)
- **تجربة مشاهدة سينمائية (Course Player):** مشغل كورسات احترافي يتابع نسبة تقدم الطالب (Progress Tracking).
- **التصحيح اللحظي:** أداء الامتحانات والحصول على النتيجة فورياً مع المؤثرات البصرية.
- **تنبيهات أولياء الأمور (Parent Notifications):** إرسال رسائل SMS/WhatsApp لولي الأمر تلقائياً بدرجات الطالب لضمان المتابعة.

### 👑 لوحة تحكم الإدارة (SuperAdmin Dashboard)
- **إدارة الاشتراكات:** متابعة إيرادات المنصة من اشتراكات المدرسين (SaaS Subscriptions).
- **إيقاف/تشغيل المنصات:** إغلاق منصة أي مدرس لا يجدد اشتراكه تلقائياً ومنع طلابه من الدخول حتى يتم التجديد.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

### واجهة المستخدم (Frontend)
- **React.js** مع **Vite** لسرعة أداء فائقة.
- **React Router v6** لإدارة المسارات ونظام الـ Subdomains.
- تصميم **Glassmorphism** عصري وجذاب مع Animations مريحة للعين.

### الخوادم وقواعد البيانات (Backend & DB)
- **NestJS:** الإطار الأقوى والأكثر تنظيماً لبناء خوادم Node.js.
- **Prisma ORM:** لإدارة قواعد البيانات بشكل آمن وسريع.
- **PostgreSQL:** مستضافة على **Supabase** لقوة التحمل العالية.
- **JWT (JSON Web Tokens):** لحماية المسارات وصلاحيات المستخدمين.

---

## 🚀 كيفية تشغيل المشروع محلياً

### 1. المتطلبات الأساسية
- Node.js (v18+)
- حساب Supabase (لقاعدة البيانات)

### 2. تثبيت المشروع
```bash
# استنساخ المستودع
git clone https://github.com/mohame04d/Manassaty.git
cd Manassaty

# تثبيت حزم واجهة المستخدم
cd frontend
npm install

# تثبيت حزم الخادم الخلفي
cd ../backend
npm install
```

### 3. إعداد البيئة (Environment Variables)
قم بإنشاء ملف `.env` في مجلد الـ `backend` وضع فيه الروابط الخاصة بك:
```env
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
JWT_SECRET="super-secret-jwt-key"
```

### 4. تشغيل المشروع
**الخادم الخلفي (Backend):**
```bash
cd backend
npx prisma db push
npm run start:dev
```

**واجهة المستخدم (Frontend):**
```bash
cd frontend
npm run dev
```
👉 سيفتح المشروع على الرابط: `http://localhost:5173/`

---

## 📸 لقطات الشاشة (Screenshots)
*(يمكنك إضافة صور للمشروع هنا لاحقاً)*

---

<div align="center">
  <b>تم برمجته بكل ❤️ من أجل تطوير التعليم </b><br>
  © 2026 Manassaty
</div>
