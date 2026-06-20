# Panduan Deployment - Ecommerce App

Panduan lengkap untuk mendeploy project ke:
- **Frontend**: Vercel
- **Backend**: Railway
- **Database & Storage**: Firebase

## Daftar Isi
1. [Prerequisites](#prerequisites)
2. [Setup Firebase](#setup-firebase)
3. [Deploy Backend ke Railway](#deploy-backend-ke-railway)
4. [Deploy Frontend ke Vercel](#deploy-frontend-ke-vercel)
5. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
6. [Verifikasi Deployment](#verifikasi-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Akun Firebase** (dengan project yang sudah dibuat)
- **Akun Railway** (https://railway.app)
- **Akun Vercel** (https://vercel.com)
- **Git** dan **Node.js** terinstall di local machine
- **GitHub repository** untuk project ini

### Setup Akun & Tools

```bash
# Verifikasi Node.js dan npm
node --version
npm --version

# Verifikasi Git
git --version
```

---

## Setup Firebase

### 1. Buat Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik "Create Project" atau tambahkan project baru
3. Masukkan nama project (misal: "kusnaeni-mart")
4. Pilih region yang sesuai (recommended: asia-southeast1)
5. Klik "Create project"

### 2. Setup Firestore Database

1. Di Firebase Console, pilih project Anda
2. Klik "Firestore Database" di menu kiri
3. Klik "Create database"
4. Pilih lokasi region (asia-southeast1)
5. Pilih "Start in production mode" atau "Start in test mode"
   - **Test mode**: Untuk development (kurang secure)
   - **Production mode**: Untuk production (lebih secure)
6. Klik "Create"

### 3. Setup Authentication

1. Di menu kiri, klik "Authentication"
2. Klik tab "Sign-in method"
3. Klik "Email/Password"
4. Enable "Email/Password"
5. Klik "Save"

### 4. Setup Storage

1. Di menu kiri, klik "Storage"
2. Klik "Get started"
3. Pilih lokasi yang sama seperti Firestore (asia-southeast1)
4. Pilih "Start in test mode" atau production
5. Klik "Done"

### 5. Setup Firestore Security Rules

Di Storage tab, update rules untuk production:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Ambil Firebase Credentials

**Untuk Frontend:**

1. Di Firebase Console, klik ⚙️ (Settings)
2. Klik "Project settings"
3. Di tab "General", scroll ke bawah
4. Cari section "Your apps" dan klik Web icon (</>)
5. Copy Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

**Untuk Backend (Service Account):**

1. Di Firebase Console, klik ⚙️ > "Project settings"
2. Klik tab "Service accounts"
3. Klik "Generate new private key"
4. Save file JSON yang di-download
5. Extract nilai-nilai ini untuk .env:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_CLIENT_ID`
   - `FIREBASE_AUTH_URI`
   - `FIREBASE_TOKEN_URI`
   - `FIREBASE_AUTH_PROVIDER_CERT_URL`
   - `FIREBASE_CLIENT_CERT_URL`

---

## Deploy Backend ke Railway

Railway adalah platform untuk deploy aplikasi backend dengan mudah.

### 1. Persiapan Backend

```bash
# Pastikan backend berjalan di local
cd backend
npm install

# Verifikasi package.json sudah ada start script
# Harus ada: "start": "node server.js"

# Verifikasi Procfile sudah ada
# Isi: web: node server.js
```

### 2. Push ke GitHub

```bash
cd ..  # Kembali ke root project
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

### 3. Connect Railway dengan GitHub

1. Buka [Railway.app](https://railway.app)
2. Login dengan GitHub account
3. Klik "New Project"
4. Pilih "Deploy from GitHub repo"
5. Authorize Railway untuk akses repository
6. Pilih repository "ecommerce-app"
7. Railway akan auto-detect backend folder

### 4. Setup Environment Variables di Railway

1. Di Railway dashboard, pilih Backend project
2. Klik tab "Variables"
3. Tambahkan semua environment variables dari backend/.env:

```
FIREBASE_PROJECT_ID=value
FIREBASE_PRIVATE_KEY_ID=value
FIREBASE_PRIVATE_KEY=value (important: gunakan format yang benar)
FIREBASE_CLIENT_EMAIL=value
FIREBASE_CLIENT_ID=value
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=value
WHATSAPP_NUMBER=your_phone_number
PORT=3000 (atau biarkan Railway assign port)
NODE_ENV=production
```

**PENTING**: Untuk `FIREBASE_PRIVATE_KEY`, jangan lupa:
- Hapus garis baru dan ganti dengan `\n`
- Atau copy langsung dari service account JSON

### 5. Deploy

1. Railway akan auto-deploy setelah Anda push
2. Lihat logs di Railway dashboard untuk memastikan sukses
3. Copy Railway backend URL (format: `https://your-app-name.railway.app`)

---

## Deploy Frontend ke Vercel

### 1. Persiapan Frontend

Pastikan file `vercel.json` sudah ada di folder frontend.

### 2. Connect Vercel dengan GitHub

1. Buka [Vercel.com](https://vercel.com)
2. Login atau sign up dengan GitHub
3. Klik "Add New..." > "Project"
4. Import repository "ecommerce-app"
5. Vercel akan auto-detect Next.js atau React project

### 3. Setup Environment Variables di Vercel

1. Di Vercel dashboard, pilih Frontend project
2. Klik "Settings" > "Environment Variables"
3. Tambahkan semua environment variables:

```
REACT_APP_FIREBASE_API_KEY=value
REACT_APP_FIREBASE_AUTH_DOMAIN=value
REACT_APP_FIREBASE_PROJECT_ID=value
REACT_APP_FIREBASE_STORAGE_BUCKET=value
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=value
REACT_APP_FIREBASE_APP_ID=value
REACT_APP_WHATSAPP_NUMBER=your_phone_number
REACT_APP_BACKEND_URL=https://your-railway-backend-url
```

4. Klik "Save"

### 4. Deploy

1. Vercel akan auto-deploy setelah Anda set environment variables
2. Lihat logs untuk memastikan build sukses
3. Copy Vercel frontend URL (format: `https://your-app-name.vercel.app`)

---

## Konfigurasi Environment Variables

### Backend (.env untuk Railway)

```
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-email@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/certificates/...

# Application Config
PORT=3000
NODE_ENV=production
WHATSAPP_NUMBER=62812345678900
```

**PENTING UNTUK FIREBASE_PRIVATE_KEY:**
- Copy dari service account JSON file
- Format harus: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
- Jangan lupa `\n` untuk newline characters

### Frontend (.env untuk Vercel)

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_WHATSAPP_NUMBER=62812345678900
REACT_APP_BACKEND_URL=https://your-railway-backend-url.railway.app
```

---

## Verifikasi Deployment

### 1. Test Backend (Railway)

```bash
# Copy Railway backend URL, lalu test:
curl https://your-railway-backend-url.railway.app/health

# Response yang diharapkan:
# {"status":"OK","message":"Server is running"}
```

### 2. Test API Endpoint

```bash
# Test get products
curl https://your-railway-backend-url.railway.app/api/products

# Response yang diharapkan:
# {"products":[...]}
```

### 3. Test Frontend (Vercel)

1. Buka frontend URL di browser: `https://your-app-name.vercel.app`
2. Verifikasi produk tampil dengan benar
3. Test login admin (klik tombol Admin)
4. Test WhatsApp button

### 4. Check Logs

**Railway Logs:**
- Buka Railway dashboard
- Klik project Backend
- Tab "Deployments" atau "Logs"
- Lihat error atau warning

**Vercel Logs:**
- Buka Vercel dashboard
- Klik project Frontend
- Tab "Deployments"
- Klik deployment terbaru untuk lihat logs

---

## Troubleshooting

### Error: Firebase Credentials Invalid

**Solusi:**
- Pastikan FIREBASE_PRIVATE_KEY format benar dengan `\n`
- Download ulang service account dari Firebase Console
- Cek bahwa semua field sudah diisi di env variables

### Error: CORS Issue

**Gejala:** Frontend tidak bisa connect ke backend

**Solusi:**
- Di backend (server.js), pastikan CORS sudah enabled:
  ```javascript
  app.use(cors());
  ```
- Jika masih error, tambahkan specific origin di Railway:
  ```javascript
  app.use(cors({
    origin: ['https://your-vercel-url.vercel.app'],
    credentials: true
  }));
  ```

### Error: Database Connection Failed

**Solusi:**
- Verifikasi Firestore sudah enabled di Firebase Console
- Pastikan security rules memungkinkan read/write
- Cek Firebase credentials di Railway env variables

### Error: Build Failed di Vercel

**Solusi:**
- Cek Vercel logs untuk error details
- Pastikan semua env variables sudah set
- Cek bahwa `npm run build` berjalan di local tanpa error
- Pastikan `react-scripts` ada di package.json dependencies

### Error: Port Already in Use (Local)

```bash
# Jika Port 3000 atau 5000 sudah digunakan
# Gunakan port lain:
PORT=3001 npm start  # Backend
PORT=3001 npm start  # Frontend
```

---

## Quick Checklist - Sebelum Deploy

- [ ] Firebase project sudah dibuat
- [ ] Firestore database sudah enabled
- [ ] Authentication (Email/Password) sudah enabled
- [ ] Storage sudah enabled
- [ ] Service account JSON sudah di-download
- [ ] GitHub repository sudah di-push
- [ ] Railway account sudah dibuat
- [ ] Vercel account sudah dibuat
- [ ] Backend Procfile sudah ada
- [ ] Frontend vercel.json sudah ada
- [ ] Semua env variables sudah collect dari Firebase
- [ ] Environment variables sudah set di Railway
- [ ] Environment variables sudah set di Vercel
- [ ] Backend deploy di Railway
- [ ] Frontend deploy di Vercel
- [ ] Test backend health endpoint
- [ ] Test API endpoints
- [ ] Test frontend di browser
- [ ] Admin login berfungsi
- [ ] WhatsApp integration berfungsi

---

## Quick Links

- Firebase Console: https://console.firebase.google.com
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub: https://github.com

---

## Next Steps Setelah Deploy

1. **Monitor Logs Regularly**
   - Railway logs untuk backend errors
   - Vercel logs untuk frontend build issues

2. **Setup Custom Domain**
   - Railway: Add custom domain di project settings
   - Vercel: Connect dengan domain provider

3. **Setup CI/CD Pipeline**
   - Auto-deploy saat push ke main branch
   - Railway & Vercel sudah setup auto-deploy by default

4. **Backup Data**
   - Setup Firebase backup
   - Monitor storage usage

5. **Performance Optimization**
   - Enable caching di Vercel
   - Optimize images di frontend
   - Monitor API response time

---

## Support & Resources

- Firebase Docs: https://firebase.google.com/docs
- Railway Docs: https://railway.app/docs
- Vercel Docs: https://vercel.com/docs
- Express.js Docs: https://expressjs.com
- React Docs: https://react.dev

---

**Last Updated:** June 2026
**Project:** Kusnaeni Mart Ecommerce
