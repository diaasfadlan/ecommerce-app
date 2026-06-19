# Quick Start Guide - Panduan Setup Cepat

Panduan lengkap untuk setup dan menjalankan aplikasi ecommerce.

## 1. Clone Repository
```bash
git clone <repository-url>
cd ecommerce-app
```

## 2. Setup Backend

### Install Dependencies
```bash
cd backend
npm install
```

### Konfigurasi Firebase
1. Buat project di Firebase Console
2. Download service account JSON
3. Buat file `.env` dengan isi:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_cert_url
WHATSAPP_NUMBER=62812345678900
PORT=5000
NODE_ENV=development
```

### Jalankan Backend
```bash
npm start
```
Backend akan berjalan di `http://localhost:5000`

## 3. Setup Frontend

### Install Dependencies
```bash
cd ../frontend
npm install
```

### Konfigurasi Firebase
Buat file `.env` dengan isi:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_WHATSAPP_NUMBER=62812345678900
```

### Jalankan Frontend
```bash
npm start
```
Frontend akan berjalan di `http://localhost:3000`

## 4. Firebase Setup

### Firestore Rules
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

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 5. Akses Aplikasi

- **Public Site**: http://localhost:3000
- **Admin Panel**: Click "Admin" button di header

## Troubleshooting

### CORS Error
Pastikan backend berjalan dan URL di frontend sesuai dengan backend URL

### Firebase Connection Error
- Verifikasi kredensial di .env files
- Check Firebase Console permissions
- Pastikan Firestore sudah enable

### WhatsApp Link Tidak Berfungsi
- Periksa format nomor telepon (gunakan format international: 62812345678900)
- Pastikan admin memiliki WhatsApp
