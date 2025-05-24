# Quiz Master

Quiz Master adalah aplikasi kuis interaktif yang dibangun menggunakan React dan TypeScript. Aplikasi ini memungkinkan pengguna untuk menguji pengetahuan mereka melalui serangkaian pertanyaan pilihan ganda dengan fitur-fitur modern dan user-friendly.

## Fitur Utama

### 1. Sistem Autentikasi
- Login dan registrasi pengguna
- Penyimpanan data pengguna menggunakan localStorage
- Proteksi rute untuk halaman kuis

### 2. Manajemen Kuis
- Timer 5 menit untuk setiap sesi kuis
- Tampilan satu pertanyaan per halaman
- Navigasi otomatis ke pertanyaan berikutnya
- Progress indicator untuk melacak posisi pertanyaan

### 3. Fitur Resume
- Penyimpanan otomatis progress kuis
- Resume kuis dari posisi terakhir setelah browser ditutup
- Penyimpanan sisa waktu dan jawaban yang telah dipilih
- Seamless state restoration

### 4. Hasil Kuis
- Tampilan skor akhir
- Statistik jawaban benar dan salah
- Progress bar visual
- Opsi untuk memulai kuis baru

## Teknologi yang Digunakan

- **React**: Library UI utama
- **TypeScript**: Untuk type safety dan developer experience yang lebih baik
- **Zustand**: State management dengan fitur persistence
- **React Query**: Data fetching dan caching
- **React Router**: Routing dan navigasi
- **Tailwind CSS**: Styling dan UI components
- **Zod**: Validasi form dan data
- **Vite**: Build tool dan development server

## Struktur Proyek

```
src/
├── api/            # API calls dan service layer
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Route components/pages
├── schema/        # Validation schemas
├── store/         # Zustand stores
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

## Fitur State Management

### Quiz Store
- Menyimpan state kuis (pertanyaan, jawaban, skor)
- Menggunakan Zustand dengan middleware persist
- Automatic state restoration

### Auth Store
- Manajemen state autentikasi
- Penyimpanan data user
- Integrasi dengan localStorage

## Timer dan Resume Mechanism

Timer diimplementasikan menggunakan custom hook `useQuizTimer` yang menyediakan:
- Countdown timer 5 menit
- Automatic state saving sebelum browser ditutup
- Precise time tracking
- Integration dengan quiz state

## Getting Started

1. Clone repository
```bash
git clone <repository-url>
cd react-quiz
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

## Environment Variables

Buat file `.env` di root project dan tambahkan:
```
VITE_API_URL=https://opentdb.com/api.php
```

