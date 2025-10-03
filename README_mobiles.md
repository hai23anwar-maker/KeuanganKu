
Aplikasi Keuangan - Panduan Konversi ke Aplikasi Mobile
======================================================

File di folder 'pwa_files' adalah aplikasi web (PWA) Anda. Berikut tiga cara yang bisa Anda pilih
untuk mengonversi PWA ini menjadi aplikasi Android (APK/AAB). Pilih salah satu metode di bawah.

PERSIAPAN UMUM (wajib):
- Node.js (versi LTS) dan npm
- Java JDK 11+
- Android SDK (Android Studio atau command-line tools) + set ANDROID_HOME
- Jika ingin upload ke Google Play: akun developer Google Play dan status pembayaran

---- METODE A: PWABUILDER (Paling mudah) ----
1. Host aplikasi PWA Anda di URL publik (GitHub Pages, Netlify, Vercel, atau hosting lain).
   Contoh cepat: deploy folder 'pwa_files' ke GitHub Pages (repo -> Pages) atau drag & drop di Netlify.
2. Buka https://www.pwabuilder.com
3. Masukkan URL situs Anda, ikuti wizard, pilih 'Android' -> 'Generate APK/AAB'.
4. PWABuilder akan menghasilkan paket yang bisa di-download. Ikuti instruksi untuk menandatangani dan meng-upload ke Play Store.

Kelebihan: sangat cepat, tak perlu Android Studio jika memilih AAB dari PWABuilder. 
Kekurangan: bergantung pada layanan pihak ketiga untuk packaging.

---- METODE B: Bubblewrap (Trusted Web Activity - untuk Play Store, kontrol penuh) ----
Cocok jika ingin pengalaman native dan upload ke Play Store menggunakan TWA.

1. Host situs Anda di HTTPS (wajib) — gunakan hosting publik.
2. Instal bubblewrap (Node.js must be installed):
   npm install -g @bubblewrap/cli
3. Siapkan manifest URL (manifest.json) yang valid di hosting Anda.
4. Jalankan inisialisasi:
   bubblewrap init --manifest https://your-site/manifest.json
   atau gunakan file konfigurasi contoh 'pwa_files/twa-config.json' (ubah host & manifestUrl)
5. Generate project:
   bubblewrap build
6. Buka folder output Android, buka dengan Android Studio untuk build/sign/release APK atau AAB.
7. Upload AAB ke Google Play Console.

Catatan penting: Bubblewrap membutuhkan Android SDK and a configured keystore to sign the app.

---- METODE C: Capacitor (Ionic) / Cordova (Hybrid) ----
Cocok jika ingin menambahkan plugin native (kamera, file system, db lokal) atau offline lebih canggih.

1. Pastikan Node.js & npm terpasang.
2. Di folder proyek, inisialisasi node + copy web build ke folder 'www'. Contoh commands:
   npm init -y
   npm install @capacitor/cli @capacitor/core
3. Buat struktur baseline:
   npx cap init "Catatan Keuangan" com.user.financeapp
   (ketika diminta, set directory web ke 'www' dan nama/appId sesuai)
4. Copy semua file dari 'pwa_files' ke folder 'www' (atau buat build step).
5. Tambahkan Android platform:
   npx cap add android
6. Buka Android Studio project:
   npx cap open android
7. Build & generate signed APK/AAB lewat Android Studio (Build -> Generate Signed Bundle / APK).
8. Jika ingin sinkronisasi perubahan web:
   npx cap copy android
   npx cap sync android

Kelebihan: fleksibel, plugin native. Kekurangan: sedikit lebih rumit.

---- FILES INCLUDED IN THIS PACKAGE ----
- pwa_files/          => aplikasi PWA Anda (copy dari app sebelumnya)
  - index.html, styles.css, script.js, manifest.json, sw.js, icons/...
  - twa-config.json (contoh untuk Bubblewrap)
  - capacitor.config.json (contoh untuk Capacitor)
- README_mobiles.md   => file ini (panduan lengkap)

---- CATATAN TAMBAHAN ----
- Untuk metode Bubblewrap & Capacitor, Anda butuh Android SDK & JDK.
- Jika Anda mau, saya bisa: 
  - (A) Membuatkan konfigurasi Bubblewrap yang sudah terisi jika Anda beri URL hosting & packageId.
  - (B) Membuatkan project Capacitor skeleton (package.json + config) dan ZIP yang siap dibuka di Android Studio — saya bisa buatkan itu sekarang jika Anda setuju.
  - (C) Bantuan langkah demi langkah saat Anda melakukan build lokal (saya akan beri perintah dan file yang Anda jalankan).

Jika Anda ingin saya langsung membuat project Capacitor skeleton dan ZIP yang siap dibuka di Android Studio, jawab "CAPACITOR".
Jika Anda ingin saya buat konfigurasi Bubblewrap siap pakai (minta URL hosting & package id), jawab "BUBBLEWRAP" dan sertakan URL situs Anda serta package id (contoh: com.nama.app).
Jika Anda ingin paket mudah via PWABuilder tapi Anda ingin saya host sementara file untuk Anda, jawab "HOST", saya akan beri opsi hosting (note: saya tidak can perform hosting live, but can provide instructions).
