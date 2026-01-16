# Kasir POS - Setup Guide

Aplikasi Kasir POS dengan backend PostgreSQL/Supabase untuk penggunaan pribadi.

## 📋 Prerequisites

- **Node.js** (v16 atau lebih baru)
- **npm** atau **yarn**
- **Supabase Account** (gratis) - https://supabase.com

## 🚀 Setup Lokal

### 1. Setup Database (Supabase - GRATIS!)

1. **Daftar di Supabase**: https://supabase.com
2. **Create New Project**
   - Nama: `kasirpos`
   - Database Password: buat dan simpan
   - Region: Singapore
3. **Import Schema**
   - Buka "SQL Editor"
   - Copy isi file `api/config/schema.sql`
   - Paste dan Run
4. **Get Connection String**
   - Settings → Database → Connection string (URI)
   - Copy dan simpan

### 2. Setup Backend API

```bash
# Masuk ke folder api
cd api

# Install dependencies
npm install

# Edit .env file
# Tambahkan connection string dari Supabase:
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Jalankan backend server
npm start
```

Backend akan berjalan di: `http://localhost:5000`

### 3. Setup Frontend

```bash
# Kembali ke root folder
cd ..

# Install dependencies
npm install

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

## 🌐 Deploy ke Vercel (GRATIS!)

**Lihat panduan lengkap di: [DEPLOY.md](./DEPLOY.md)**

Ringkasan:
1. Setup Supabase (sudah dilakukan di atas)
2. Push code ke GitHub
3. Import project di Vercel
4. Set environment variables:
   - `VITE_API_URL` = `https://your-app.vercel.app/api`
   - `DATABASE_URL` = (connection string dari Supabase)
   - `NODE_ENV` = `production`
5. Deploy!

### Update Aplikasi di Vercel

```bash
git add .
git commit -m "Update: deskripsi"
git push origin main
```

Vercel akan otomatis deploy ulang! 🚀

## 📝 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`api/.env`)
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
PORT=5000
NODE_ENV=development
```

## 🎯 Fitur

- ✅ Manajemen Produk (CRUD)
- ✅ Transaksi Penjualan
- ✅ Manajemen Keuangan (Income/Expense)
- ✅ Stock Opname
- ✅ Dashboard Analytics
- ✅ Dark Mode
- ✅ Print Receipt (PDF)
- ✅ Responsive Design
- ✅ Multi-device Access (via Supabase)

## 💰 Biaya

**100% GRATIS!**
- Supabase: 500MB database, unlimited requests
- Vercel: unlimited deployments, 100GB bandwidth

## 🔧 Troubleshooting

### Backend tidak bisa connect ke database
- Check connection string di `api/.env`
- Pastikan Supabase project sudah running
- Verify schema sudah di-import

### Frontend tidak bisa fetch data
- Pastikan backend running di port 5000
- Check `VITE_API_URL` di `.env`
- Buka browser console untuk lihat error

## 📱 Akses dari HP

Setelah deploy ke Vercel, aplikasi bisa diakses dari HP dengan membuka URL Vercel Anda. Data akan tersimpan di Supabase sehingga bisa diakses dari device mana saja.

## 🎨 Customization

- Logo: Edit di `src/components/DashboardLayout.jsx`
- Warna: Edit di `tailwind.config.js`
- Receipt Footer: Edit di Settings page

---

**Selamat menggunakan Kasir POS! 🎉**

Untuk panduan deploy lengkap, lihat: **[DEPLOY.md](./DEPLOY.md)**
