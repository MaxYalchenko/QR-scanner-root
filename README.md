# QR Scanner & Generator App

Web & Android-приложение для генерации и сканирования QR-кодов с сохранением истории сканирований. Реализовано на стеке **Quasar + Vue 3 + TypeScript + Node.js**.

---

## Установка зависимостей

Сначала убедитесь, что у вас установлен Node.js (рекомендую >=18) и npm.

1. **Клонируем репозиторий**:

```bash
git clone <URL_репозитория>
cd <имя_папки_проекта>
```
2. **Создаём базу данных и таблицы в PostgreSql**:
   *Предположим что порт будет 5432 а пароль root*
 ```sql
   create database qrcodedb;
   CREATE TABLE qrcodes (
    id SERIAL PRIMARY KEY,
    qr_content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
   );
   CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE TABLE qr_scan_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qr_code_id INTEGER REFERENCES qrcodes(id) ON DELETE SET NULL,
    qr_content TEXT NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   CREATE INDEX idx_qr_scan_user ON qr_scan_history(user_id);
   CREATE INDEX idx_qr_scan_date ON qr_scan_history(scanned_at);
```
3. **Запускаем сервер в папке ServerAPI**:
   ```bash
   ..\ServerAPI>npm run dev
   ```
5. (По желанию) Запустите туннель Сloudflared
   ```bash
   tunnel --url http://localhost:8082
   ```
7. Скопируйте URL туннеля в max-note-app/boot/axios.ts (В baseURL оставьте перед вашей ссылкой /api)
8. Запустите клиент в режиме dev или build
   ```bash
   ..\max-note-app>quasar dev
   ```
   
> **Готово.**

**Запуск приложения на Android <img src="https://cdn.simpleicons.org/android/3DDC84" width="25" height="25" alt="Android logo" style="pointer-events: none;">**:

*Убедитесь что у вас установлена Android Studio и SDK*

1. **Вводим на клиенте команду**:
 ```bash
   \max-note-app>quasar dev -m capacitor -T android --ide (в режиме разработки)
   \max-note-app>quasar build -m capacitor -T android --ide (в режиме APK)
   ```
!!!Не забудьте в Manifest указать разрешение на использование камеры!!!
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```
2. **Запускаем на эмуляторе или на физическом устройстве, все должно работать :)**
   
    ![Demo](./assets/qrvideo.gif)
