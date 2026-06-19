# Toko Online - Ecommerce Website

Aplikasi website ecommerce profesional yang dibangun dengan React, Node.js/Express, dan Firebase. Fitur utama mencakup display produk, admin panel untuk manajemen produk, dan integrasi WhatsApp untuk pemesanan.

## Fitur Utama

- **Halaman Produk**: Tampilan produk yang responsif dan menarik
- **Admin Dashboard**: Panel untuk menambah, mengubah, dan menghapus produk
- **Admin Login**: Autentikasi Firebase untuk keamanan admin
- **WhatsApp Integration**: Tombol "Pesan via WhatsApp" untuk menghubungi admin
- **Responsive Design**: Dioptimalkan untuk desktop dan mobile
- **Modern UI**: Menggunakan Tailwind CSS untuk styling profesional

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios (HTTP Client)
- Firebase (Authentication & Storage)
- Tailwind CSS (Styling)

### Backend
- Node.js
- Express.js
- Firebase Admin SDK
- Firestore (Database)
- Firebase Storage (File Storage)

## Struktur Project

```
ecommerce-app/
├── backend/
│   ├── config/
│   │   └── firebase.js
│   ├── controllers/
│   │   └── productController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── products.js
│   │   └── admin.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductList.js
│   │   │   └── AdminDashboard.js
│   │   ├── config/
│   │   │   └── firebase.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
└── .gitignore
```

## Setup Instructions

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- npm atau yarn
- Firebase project dengan Firestore dan Authentication

### Backend Setup

1. Navigate ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` dengan konfigurasi Firebase Anda:
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
WHATSAPP_NUMBER=your_phone_number
PORT=5000
```

5. Start backend server:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

### Frontend Setup

1. Navigate ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` dengan konfigurasi Firebase Anda:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_WHATSAPP_NUMBER=6281234567890
```

5. Start frontend development server:
```bash
npm start
```

Aplikasi akan buka di `http://localhost:3000`

## API Endpoints

### Public Routes
- `GET /api/products` - Dapatkan semua produk
- `GET /api/products/:id` - Dapatkan produk berdasarkan ID

### Admin Routes (Protected)
- `POST /api/admin/products` - Tambah produk baru
- `PUT /api/admin/products/:id` - Update produk
- `DELETE /api/admin/products/:id` - Hapus produk

## Penggunaan

### Halaman Publik
1. Buka aplikasi di browser
2. Lihat daftar semua produk
3. Klik tombol "Pesan via WhatsApp" untuk menghubungi admin
4. Pesan akan dikirim ke WhatsApp admin dengan informasi produk

### Admin Panel
1. Klik tombol "Admin" di header halaman utama
2. Login menggunakan email dan password admin Firebase
3. Gunakan dashboard untuk:
   - Tambah produk baru dengan foto, harga, deskripsi, dan stok
   - Melihat daftar semua produk
   - Menghapus produk

## Konfigurasi Firebase

Untuk setup Firebase project:
1. Buat project baru di [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Enable Storage
5. Buat service account untuk backend
6. Copy kredensial ke file `.env`

## Development Tips

- Backend berjalan di port 5000
- Frontend berjalan di port 3000
- Pastikan CORS sudah dikonfigurasi dengan benar
- Gunakan Firestore Rules untuk security

## License

MIT License

## Support

Untuk pertanyaan atau masalah, silakan buat issue di repository ini.
