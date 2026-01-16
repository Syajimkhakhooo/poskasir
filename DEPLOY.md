# 🚀 Cara Deploy ke Vercel dengan Supabase (GRATIS!)

## ✅ Kenapa Supabase?

- **100% GRATIS** untuk project kecil
- **PostgreSQL** (lebih powerful dari MySQL)
- **500MB database gratis**
- **Unlimited API requests**
- **Auto-backup**
- **Dashboard yang mudah**

---

## 📋 Step-by-Step Setup

### 1. Setup Supabase (Database Cloud - GRATIS)

1. **Daftar di Supabase**
   - Buka: https://supabase.com
   - Klik "Start your project"
   - Sign up dengan GitHub (gratis)

2. **Create New Project**
   - Klik "New Project"
   - Nama project: `kasirpos` (atau terserah)
   - Database Password: buat password (SIMPAN INI!)
   - Region: pilih Singapore (terdekat)
   - Klik "Create new project" (tunggu 2-3 menit)

3. **Import Database Schema**
   - Klik "SQL Editor" di sidebar kiri
   - Klik "New query"
   - Copy SEMUA isi file: `api/config/schema.sql`
   - Paste di SQL Editor
   - Klik "Run" (tombol play)
   - Kalau sukses, akan muncul "Success. No rows returned"

4. **Get Connection String**
   - Klik "Project Settings" (icon gear di bawah)
   - Klik "Database" di sidebar
   - Scroll ke bawah, cari "Connection string"
   - Pilih tab "URI"
   - Copy connection string (format: `postgresql://postgres:[YOUR-PASSWORD]@...`)
   - **PENTING**: Ganti `[YOUR-PASSWORD]` dengan password yang Anda buat tadi

---

### 2. Push Code ke GitHub

```bash
# Di folder project kasirpos
git init
git add .
git commit -m "Add PostgreSQL backend with Supabase support"

# Buat repository baru di GitHub, lalu:
git remote add origin https://github.com/username/kasirpos.git
git branch -M main
git push -u origin main
```

---

### 3. Deploy ke Vercel

1. **Login ke Vercel**
   - Buka: https://vercel.com
   - Sign up/login dengan GitHub

2. **Import Project**
   - Klik "Add New" → "Project"
   - Pilih repository `kasirpos` dari GitHub
   - Klik "Import"

3. **Configure Project**
   - Framework Preset: **Vite** (auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**
   
   Klik "Environment Variables" tab, tambahkan:

   **Variable 1:**
   ```
   Name: VITE_API_URL
   Value: https://your-app-name.vercel.app/api
   ```
   (Ganti `your-app-name` dengan nama project Vercel Anda, lihat di atas)

   **Variable 2:**
   ```
   Name: DATABASE_URL
   Value: (paste connection string dari Supabase)
   ```
   Contoh: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`

   **Variable 3:**
   ```
   Name: NODE_ENV
   Value: production
   ```

5. **Deploy!**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - Selesai! 🎉

---

### 4. Update Aplikasi (Setelah Deploy Pertama)

Setiap kali mau update:

```bash
# 1. Edit code seperti biasa

# 2. Commit
git add .
git commit -m "Update: deskripsi perubahan"

# 3. Push
git push origin main
```

**Vercel akan otomatis deploy ulang!** ✨

---

## 🧪 Testing

### Test Lokal (Sebelum Deploy)

1. **Install PostgreSQL** (opsional, bisa langsung pakai Supabase):
   - Download: https://www.postgresql.org/download/
   - Atau pakai Supabase langsung untuk development

2. **Setup Environment**
   
   Edit `api/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   PORT=5000
   NODE_ENV=development
   ```

3. **Run Backend**
   ```bash
   cd api
   npm start
   ```

4. **Run Frontend**
   ```bash
   # Di folder root
   npm run dev
   ```

5. **Test di Browser**
   - Buka: `http://localhost:5173`
   - Test semua fitur

---

## 📱 Akses dari HP

Setelah deploy ke Vercel:

1. Buka URL Vercel Anda di HP: `https://your-app.vercel.app`
2. Bookmark di home screen
3. Data tersimpan di Supabase, bisa diakses dari mana saja!

---

## 🔧 Troubleshooting

### Error: "Database connection failed"
- Check connection string di environment variables Vercel
- Pastikan password benar (tidak ada `[YOUR-PASSWORD]`)
- Pastikan schema sudah di-import di Supabase

### Error: "VITE_API_URL is not defined"
- Check environment variable `VITE_API_URL` di Vercel
- Pastikan formatnya: `https://your-app.vercel.app/api`
- Redeploy setelah menambah env variable

### Data tidak muncul
- Buka Supabase dashboard → Table Editor
- Check apakah data ada di tables
- Check browser console (F12) untuk error

---

## 💰 Biaya

**GRATIS 100%!**

- Supabase Free Tier: 500MB database, unlimited requests
- Vercel Free Tier: unlimited deployments, 100GB bandwidth
- Cocok untuk penggunaan pribadi atau bisnis kecil

---

## 🎯 Next Steps

Setelah deploy berhasil:

- [ ] Test semua fitur di production
- [ ] Bookmark URL di HP
- [ ] Setup custom domain (opsional)
- [ ] Enable auto-backup di Supabase (sudah otomatis)

---

**Selamat! Aplikasi Anda sudah online! 🎉**

URL: `https://your-app-name.vercel.app`
