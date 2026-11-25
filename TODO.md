# TODO: UBnetwork-lite — 100% Visual & Functional Parity (Pure Local HTML)

Target: Menjadikan seluruh halaman **UBnetwork-lite** (100% HTML/CSS/JS lokal tanpa server, simpan di IndexedDB + 1-Click Sync) **identik 100%** secara visual & UX dengan **UBnetwork** (`ubnetwork` Next.js/Vercel).

---

## Status Saat Ini

- [x] **Fondasi Offline (`assets/db.js`)**: IndexedDB `ubnetwork_lite_db` (`reports`, `daily_activities`, `settings`, `sync_logs`, `air_leakage_checks`, `air_leakage_findings`), Role Switcher (`ADMIN`, `RED`, `WHITE`, `VIEWER`), 1-Click Sync, Export/Import JSON.
- [x] **`checksheet.html` (100% Identik 1:1)**: i-Reporter dot-matrix canvas, pan/drag & zoom, floating D-pad/zoom-bar, kertas fisik digital `950px × 1340px`, CBU/CKD master part (`57403-KK010` & `57404-KK010`), MP Absensi, No Body Start/Finish + Smart Carry-over `+ 1` & Auto CCR, Jam Stop, Signatures, macOS window titlebar, dan `@media print` A4 portrait.

---

## Phase 1 — Shared macOS Design System (`assets/macos.css` & `assets/macos.js`)

- [x] **macOS Top Menu Bar** (`32px` height, backdrop blur, logo UB, menu dropdown, live clock, Role badge, tombol Control Center & Spotlight).
- [x] **Spotlight Search (`Ctrl+K` / `Cmd+K`)**: Modal pencarian cepat lintas halaman `.html` lokal.
- [x] **Control Center Popover**: Switcher Role (`ADMIN`/`RED`/`WHITE`/`VIEWER`), API Config trigger, Sync Center shortcut.
- [x] **macOS Wallpaper & Background (`assets/macos-wallpaper.jpg`)**: Gradient mesh wallpaper khas UBnetwork + efek glassmorphism Finder window.
- [x] **macOS Bottom Dock & Footer**: Dock mengambang di bawah layar dengan ikon aplikasi utama.
- [x] **macOS Window Frame**: Titlebar dengan 3 *traffic lights* (merah/kuning/hijau).

---

## Phase 2 — Hub Utama & Productivity Hub (100% Identik)

- [x] **Upgrade `index.html` → macOS Desktop Shopfloor Hub** (setara `ubnetwork/app/page.tsx`):
  - [x] Terapkan macOS Top Menu Bar, Spotlight `Ctrl+K`, Control Center, dan Bottom Dock.
  - [x] Window utama Finder-style berisi 6 Pilar KPI (P, S, Q, C, H, E) dengan tampilan Grid/List, search filter, dan collapse.
  - [x] Tambahkan section Utilitas & Widgets ringkasan database lokal IndexedDB.
- [x] **Upgrade `productivity.html` → Productivity Hub** (setara `ubnetwork/app/productivity/page.tsx`):
  - [x] Gunakan macOS Background, Top Menu Bar, Window Frame, dan Bottom Dock.
  - [x] Tampilkan kartu modul Productivity lengkap dengan statistik lokal.

---

## Phase 3 — Halaman Operasional & Display (100% Identik)

- [x] **Upgrade `display-kpi.html` → GL Management Board (1–31)**
- [x] **Upgrade `daily.html` → Daily Activity & Sync Center**
- [x] **Upgrade `air-leakage.html` → Environment Air Leakage (`#lub` / `#l10`)**
- [x] **Upgrade `andon.html` → Andon Monitor Intranet**

---

## Phase 4 — Modul Lanjutan Offline

- [x] **`hr.html` — Matrik Baca Doa Asare (i-Reporter Canvas)**: Kertas fisik digital dengan dot-matrix pattern, pan/drag, zoom HUD (`[-][%][+][Fit][100%]`), klik sel interaktif, dan mode print A4 landscape.
- [x] **`safety.html`**, **`quality.html`**, **`cost.html`**: Modul offline lokal untuk pilar S, Q, dan C.

---

## Phase 5 — Verifikasi Akhir (Edge File-Safe)

- [x] Verifikasi sintaks JS & seluruh tautan lokal antar `.html` bebas error (`file://` safe tanpa ES module).
