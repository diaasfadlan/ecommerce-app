# Firebase Setup Guide - Panduan Setup Firebase

Panduan lengkap untuk mendapatkan Firebase credentials dan mengkonfigurasi project.

## 1. Buat Firebase Project

1. Buka https://console.firebase.google.com
2. Klik "Add project"
3. Masukkan nama project: "ecommerce-app"
4. Ikuti langkah-langkah wizard
5. Tunggu project dibuat

## 2. Setup Firestore Database

1. Di Firebase Console, pilih project Anda
2. Di sidebar, klik "Firestore Database"
3. Klik "Create database"
4. Pilih lokasi region terdekat
5. Pilih "Start in production mode"
6. Klik "Enable"

## 3. Setup Authentication

1. Di sidebar, klik "Authentication"
2. Klik tab "Sign-in method"
3. Klik "Email/Password"
4. Enable "Email/Password"
5. Klik "Save"

## 4. Setup Storage

1. Di sidebar, klik "Storage"
2. Klik "Get started"
3. Pilih lokasi region yang sama dengan Firestore
4. Klik "Done"

## 5. Dapatkan Web API Key (untuk Frontend)

1. Di Firebase Console, buka "Project Settings"
2. Klik tab "General"
3. Scroll ke bawah dan cari "Your apps"
4. Jika belum ada, klik icon Web (</> )
5. Daftarkan app dengan nama "ecommerce-app"
6. Copy kredensial yang tampil, termasuk:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### Update frontend/.env

Buka file `frontend/.env` dan ganti dengan nilai dari Firebase:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_WHATSAPP_NUMBER=6289699205601
```

## 6. Dapatkan Service Account Key (untuk Backend)

1. Di Firebase Console, buka "Project Settings"
2. Klik tab "Service Accounts"
3. Klik "Generate New Private Key"
4. File JSON akan download otomatis
5. Buka file JSON dan copy informasi berikut:
   - project_id → FIREBASE_PROJECT_ID
   - private_key_id → FIREBASE_PRIVATE_KEY_ID
   - private_key → FIREBASE_PRIVATE_KEY
   - client_email → FIREBASE_CLIENT_EMAIL
   - client_id → FIREBASE_CLIENT_ID

### Update backend/.env

Buka file `backend/.env` dan update dengan nilai dari service account:

```env
FIREBASE_PROJECT_ID=your_project_id_dari_json
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_dari_json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_PRIVATE_KEY_DARI_JSON_DISINI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email_dari_json
FIREBASE_CLIENT_ID=your_client_id_dari_json
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_cert_url_dari_json
WHATSAPP_NUMBER=6289699205601
PORT=5000
NODE_ENV=development
```

## 7. Setup Firestore Rules

1. Di Firebase Console, buka "Firestore Database"
2. Klik tab "Rules"
3. Replace dengan rules berikut:

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

4. Klik "Publish"

## 8. Setup Storage Rules

1. Di Firebase Console, buka "Storage"
2. Klik tab "Rules"
3. Replace dengan rules berikut:

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

4. Klik "Publish"

## 9. Buat Admin User

1. Di Firebase Console, buka "Authentication"
2. Klik tab "Users"
3. Klik "Add user"
4. Masukkan email dan password admin
5. Klik "Add user"

Gunakan kredensial ini untuk login ke admin panel aplikasi.

## 10. Verifikasi Setup

1. Pastikan semua file .env sudah terisi dengan benar
2. Pastikan tidak ada quotes yang salah di FIREBASE_PRIVATE_KEY
3. Pastikan semua rules sudah di-publish di Firebase Console

## Troubleshooting

### "Failed to initialize Firebase"
- Pastikan .env file terisi dengan benar
- Pastikan tidak ada typo di values
- Clear node_modules dan install ulang

### "Permission denied" di Firestore
- Check Firestore Rules di Firebase Console
- Pastikan rules sudah di-publish
- Restart backend server

### WhatsApp link tidak berfungsi
- Pastikan nomor WhatsApp format international (62...)
- Pastikan nomor adalah nomor yang aktif
- Pastikan nomor punya WhatsApp

Ready untuk lanjut!
