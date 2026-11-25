# UBnetwork-lite (Offline-First HTML/CSS/JS + 1-Click Server Sync)

**UBnetwork-lite** adalah versi ringan **100% HTML + CSS + JavaScript murni** tanpa server lokal, tanpa Node.js, dan tanpa `.exe` — cukup klik 2x **`index.html`** langsung di **Microsoft Edge** PC pabrik.

Seluruh input sepanjang shift disimpan secara lokal di **IndexedDB** (database terstruktur bawaan browser Edge, setara SQLite lokal, kapasitas ratusan MB, tetap aman meski browser ditutup/PC restart). Di akhir shift (sore/pagi), operator cukup klik **1 tombol ("Kirim ke Server · 1x Sync")** agar seluruh laporan masuk ke server API (`ubassy.bungtemin.net` / `bungtemin.net/ub/api` + opsional SharePoint `UB_Production_Reports`) sehingga langsung terbaca di HP / jaringan pribadi.

---

## 1. Role & Hak Akses

Role mengikuti standar **UBnetwork** dan dapat diganti melalui tombol Role di pojok kanan atas:

| Role | Shift Aktif | Hak Input Checksheet & Daily | Hak Sync ke Server | Hak Pengaturan Endpoint & Hapus Data |
|---|---|---|---|---|
| **RED (GL/TL Red)** | `RED` | Input & edit laporan Shift `RED` | Ya (1-Click Sync Shift `RED`) | Tidak (hanya ubah data shift `RED`) |
| **WHITE (GL/TL White)** | `WHITE` | Input & edit laporan Shift `WHITE` | Ya (1-Click Sync Shift `WHITE`) | Tidak (hanya ubah data shift `WHITE`) |
| **ADMIN** | `RED` & `WHITE` | Input & edit semua shift | Ya (Sync satuan & batch semua draft) | Ya (Atur URL API, API Key, Export/Import DB, Hapus) |
| **VIEWER** | Read-Only | Hanya lihat rekap & cetak | Tidak | Tidak |

---

## 2. Todo & Roadmap Migrasi Bertahap

- [x] **Tahap 1 — Fondasi Offline & IndexedDB (`assets/db.js`, `assets/app.css`):** Database lokal `ubnetwork_lite_db` (`reports`, `daily_activities`, `settings`, `sync_logs`) + Export/Import JSON backup.
- [x] **Tahap 2 — Hub Utama (`index.html`) & Productivity Hub (`productivity.html`):** Tampilan dark-glass identik dengan UBnetwork, switcher Role, dan indikator jumlah draft lokal yang belum di-sync.
- [x] **Tahap 3 — Productivity Checksheet Lokal (`checksheet.html`):** Input per jam (Plan/Act/Delay/Problem), Modal **Update No Body & Jam Stop** (dengan *Smart Carry-over* `Finish + 1` & Auto CCR), CBU/CKD, Overtime, Manpower, simpan lokal instan, dan **1-Click Sync ke Server**.
- [x] **Tahap 4 — Daily Activity & Sync Center (`daily.html`):** Tabel rekap harian/bulanan lokal, filter status (`Draft Lokal` vs `Synced`), tombol **Sync Semua Draft (1 Klik)**, dan backup/restore `.json`.
- [ ] **Tahap 5 (Opsional Lanjutan):** Tambah modul offline **Air Leakage (`#lub`)** & **Voice Member (`#vm`)** jika dibutuhkan di PC tanpa akses Vercel.

---

## 3. Cara Pakai di PC Windows (Microsoft Edge)

1. Salin seluruh folder **`Ubnetwork-lite`** ke Desktop atau drive `D:\` PC kantor.
2. Klik 2x **`index.html`** → otomatis terbuka di **Microsoft Edge**.
3. Pilih Role (**RED**, **WHITE**, atau **ADMIN**), lalu buka **Productivity → Daily Production Checksheet**.
4. Sepanjang shift, semua perubahan tersimpan otomatis di lokal PC (**0 request ke internet**).
5. Saat produksi selesai, klik **"Kirim ke Server (1x Sync)"** — aplikasi hanya menembak API **1 kali** untuk menyinkronkan laporan shift tersebut ke server.
