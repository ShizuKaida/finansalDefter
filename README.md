# Finansal Defter Uygulaması

Kullanıcıların gelir ve gider işlemlerini yönetebileceği temel işlevlere sahip bir proje

##  Özellikler

-  Kayıt & Giriş (JWT Access + Refresh Token ile)
-  Gelir & Gider ekleme
-  İşlem güncelleme (modal ile)
-  İşlem silme
-  Oturum süresi bitince otomatik refresh token ile yenileme
-  Tailwind CSS ile responsive ve şık arayüz
-  MongoDB + Mongoose ile veri yönetimi
-  Next.js App Router(Normalde Page Router Kullanılacaktı) ile API ve UI bir arada

---

##  Kullanılan Teknolojiler

| Teknoloji       | Açıklama                        |
|----------------|---------------------------------|
| Next.js (App Router) | Fullstack React framework |
| MongoDB + Mongoose | Veritabanı                   |
| JWT             | Kimlik doğrulama (access/refresh) |
| Tailwind CSS    | Arayüz tasarımı                |
| TypeScript      | Tür güvenliği                  |

---
Ekranlar
/login
/register
/dashboard
/transactions

##  Kurulum
```bash
git clone https://github.com/ShizuKaida/finansalDefter.git
cd finansalDefter
npm install
npm run dev





