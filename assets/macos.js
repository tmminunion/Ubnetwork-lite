/* UBnetwork-lite Shared macOS Shell (Menu Bar, Wallpaper, Spotlight Ctrl+K, Control Center, Dock, Settings) */
(function (global) {
  'use strict';

  var PAGES = [
    { title: 'Shopfloor Hub (Beranda)', desc: 'Desktop utama 6 pilar KPI & Utilitas', href: 'index.html', icon: '🏠', kbd: '⌘1', cat: 'Navigasi' },
    { title: 'Productivity Hub', desc: 'Suite produksi, checksheet, daily, display KPI', href: 'productivity.html', icon: '🏭', kbd: '⌘4', cat: 'Pilar KPI' },
    { title: 'Daily Production Checksheet', desc: 'Kertas i-Reporter A4, CBU/CKD, No Body & Jam Stop', href: 'checksheet.html', icon: '📋', kbd: 'Input', cat: 'Productivity' },
    { title: 'Daily Activity & Sync Center', desc: 'Rekap lokal IndexedDB, 1-Klik Sync & Backup JSON', href: 'daily.html', icon: '☁️', kbd: 'Sync', cat: 'Productivity' },
    { title: 'GL Management Board (Display KPI)', desc: 'Papan KPI 7 Pilar & Grafik Efisiensi 1-31', href: 'display-kpi.html', icon: '📺', kbd: '⌘2', cat: 'Display' },
    { title: 'Environment · Air Leakage (#lub)', desc: 'Checksheet harian & Temuan Kaizen #l10', href: 'air-leakage.html', icon: '💨', kbd: '#lub', cat: 'Environment' },
    { title: 'Andon Monitor Intranet', desc: 'Live Andon 172.16.2.201 Fullscreen TV', href: 'andon.html', icon: '📡', kbd: 'TV', cat: 'Monitor' },
    { title: 'Safety Hub (Zero Accident)', desc: 'Temuan Safety, KYT & BIRA lokal', href: 'safety.html', icon: '🦺', kbd: 'S', cat: 'Pilar KPI' },
    { title: 'Quality Hub (Built-in Quality)', desc: 'Defect harian & Audit kualitas lokal', href: 'quality.html', icon: '🔍', kbd: 'Q', cat: 'Pilar KPI' },
    { title: 'Cost & HR Hub', desc: 'Cost control, Baca Doa i-Reporter & Idea Suggestion', href: 'hr.html', icon: '👥', kbd: 'H', cat: 'Pilar KPI' }
  ];

  function currentFile() {
    var p = (location.pathname || '').split('/').pop();
    return p || 'index.html';
  }

  function injectChrome(opts) {
    opts = opts || {};
    var pageTitle = opts.title || 'UBnetwork';
    var file = currentFile();

    // 1. Wallpaper Background
    var bg = document.createElement('div');
    bg.className = 'macos-bg';
    bg.innerHTML =
      '<div class="macos-bg-img"></div>' +
      '<div class="macos-bg-frost"></div>' +
      '<div class="macos-bg-veil"></div>' +
      '<div class="macos-bg-mesh"></div>';
    document.body.insertBefore(bg, document.body.firstChild);

    // 2. Top Menu Bar
    var header = document.createElement('header');
    header.className = 'macos-menubar';
    header.innerHTML =
      '<div class="mb-left">' +
        '<button type="button" id="mbAboutBtn" class="mb-logo-btn" title="Tentang UBnetwork Lite"><div class="mb-logo-box">UB</div></button>' +
        '<a href="index.html" class="mb-brand">' + pageTitle + '</a>' +
        '<div class="mb-menu-wrap">' +
          '<button type="button" class="mb-item" data-mb-menu="nav">Navigasi</button>' +
          '<div class="mb-dropdown" id="mbDrop-nav">' +
            '<a href="index.html" class="mb-drop-link"><span>Shopfloor Hub (Beranda)</span><span class="mb-kbd">⌘1</span></a>' +
            '<a href="display-kpi.html" class="mb-drop-link"><span>GL Management Board</span><span class="mb-kbd">⌘2</span></a>' +
            '<a href="productivity.html" class="mb-drop-link"><span>Productivity Suite</span><span class="mb-kbd">⌘4</span></a>' +
            '<a href="checksheet.html" class="mb-drop-link"><span>Daily Production Checksheet</span><span class="mb-kbd">A4</span></a>' +
            '<a href="daily.html" class="mb-drop-link"><span>Daily Activity &amp; Sync</span><span class="mb-kbd">DB</span></a>' +
            '<a href="andon.html" class="mb-drop-link"><span>Andon Intranet TV</span><span class="mb-kbd">TV</span></a>' +
            '<a href="http://mfg-connectivity.toyota.co.id/web#/henkaten-dashboard" target="_blank" rel="noreferrer" class="mb-drop-link"><span>Henkaten Board (Tab Baru)</span><span class="mb-kbd">↗</span></a>' +
            '<div class="mb-drop-sep"></div>' +
            '<button type="button" id="mbOpenAbout" class="mb-drop-link"><span>Tentang UBnetwork Lite...</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="mb-menu-wrap hide-sm">' +
          '<button type="button" class="mb-item" data-mb-menu="pillars">Pilar KPI</button>' +
          '<div class="mb-dropdown" id="mbDrop-pillars">' +
            '<a href="productivity.html" class="mb-drop-link"><span><b>P</b> · Productivity</span><span class="mb-kbd">Live</span></a>' +
            '<a href="safety.html" class="mb-drop-link"><span><b>S</b> · Safety &amp; KYT</span><span class="mb-kbd">Lokal</span></a>' +
            '<a href="quality.html" class="mb-drop-link"><span><b>Q</b> · Quality Control</span><span class="mb-kbd">Lokal</span></a>' +
            '<a href="cost.html" class="mb-drop-link"><span><b>C</b> · Cost &amp; Budget</span><span class="mb-kbd">Lokal</span></a>' +
            '<a href="hr.html" class="mb-drop-link"><span><b>H</b> · HR &amp; Baca Doa</span><span class="mb-kbd">Lokal</span></a>' +
            '<a href="air-leakage.html" class="mb-drop-link"><span><b>E</b> · Environment (#lub)</span><span class="mb-kbd">Live</span></a>' +
          '</div>' +
        '</div>' +
        '<div class="mb-menu-wrap hide-sm">' +
          '<button type="button" class="mb-item" data-mb-menu="tools">Utilitas</button>' +
          '<div class="mb-dropdown" id="mbDrop-tools">' +
            '<button type="button" id="mbOpenSpotlight" class="mb-drop-link"><span>Spotlight Search</span><span class="mb-kbd">Ctrl+K</span></button>' +
            '<button type="button" id="mbOpenSettings" class="mb-drop-link"><span>Pengaturan API &amp; Line</span><span class="mb-kbd">Admin</span></button>' +
            '<a href="daily.html" class="mb-drop-link"><span>Backup / Restore JSON</span><span class="mb-kbd">DB</span></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mb-right">' +
        '<span id="mbDraftPill" class="mb-pill amber" title="Status draft lokal IndexedDB">Draft: 0</span>' +
        '<button type="button" id="mbRoleBtn" class="mb-pill purple hide-sm" title="Klik untuk ganti Role">Role: -</button>' +
        '<button type="button" id="mbSpotBtn" class="mb-icon-btn" title="Spotlight Search (Ctrl+K)">🔍 <span class="hide-sm">⌘K</span></button>' +
        '<button type="button" id="mbCcBtn" class="mb-icon-btn" title="Control Center">🎛️</button>' +
        '<span id="mbClock" class="mb-clock hide-sm">--:--</span>' +
      '</div>';
    bg.insertAdjacentElement('afterend', header);

    // 3. Control Center Popover
    var cc = document.createElement('div');
    cc.id = 'mbControlCenter';
    cc.className = 'cc-popover';
    cc.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
        '<span style="font-size:12px;font-weight:800">Control Center</span>' +
        '<span class="pill pill-emerald" style="font-size:10px">Offline Ready</span>' +
      '</div>' +
      '<div class="glass-soft" style="padding:10px;margin-bottom:10px">' +
        '<div style="font-size:10px;color:var(--muted);font-weight:700;margin-bottom:6px">ROLE &amp; SHIFT AKTIF</div>' +
        '<select id="ccRoleSelect" class="select" style="font-weight:700">' +
          '<option value="ADMIN">ADMIN (All Shift + Settings)</option>' +
          '<option value="RED">RED (GL/TL Shift Merah)</option>' +
          '<option value="WHITE">WHITE (GL/TL Shift Putih)</option>' +
          '<option value="VIEWER">VIEWER (Read-Only)</option>' +
        '</select>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        '<button type="button" id="ccSettingsBtn" class="btn" style="font-size:11px">⚙ API Config</button>' +
        '<a href="daily.html" class="btn btn-emerald" style="font-size:11px">☁ Sync Center</a>' +
      '</div>';
    document.body.appendChild(cc);

    // 4. Spotlight Modal
    var spot = document.createElement('div');
    spot.id = 'mbSpotlightModal';
    spot.className = 'modal-backdrop';
    spot.innerHTML =
      '<div class="modal-card" style="max-width:540px;padding:14px">' +
        '<div style="display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:10px">' +
          '<span style="font-size:16px">🔍</span>' +
          '<input id="spotInput" class="input" style="border:none;background:transparent;font-size:14px;padding:4px" placeholder="Cari halaman, checksheet, KPI, atau fitur UBnetwork..." />' +
          '<span class="mb-kbd">ESC</span>' +
        '</div>' +
        '<div id="spotResults" style="margin-top:10px;display:grid;gap:4px;max-height:55vh;overflow-y:auto"></div>' +
      '</div>';
    document.body.appendChild(spot);

    // 5. About Modal
    var about = document.createElement('div');
    about.id = 'mbAboutModal';
    about.className = 'modal-backdrop';
    about.innerHTML =
      '<div class="modal-card" style="max-width:420px;text-align:center">' +
        '<img src="assets/ubnetwork-512.png" alt="UBnetwork" style="width:68px;height:68px;border-radius:18px;margin:0 auto 12px;display:block;box-shadow:0 12px 30px rgba(6,182,212,0.3)" onerror="this.style.display=\'none\'" />' +
        '<h3 style="margin:0;font-size:18px;font-weight:900">UBnetwork <span style="color:#67e8f9">Lite</span></h3>' +
        '<p style="margin:4px 0 12px;font-size:12px;color:var(--muted)">Underbody Plant Manufacturing System · Offline-First Edition</p>' +
        '<div class="glass-soft" style="padding:12px;text-align:left;font-size:11.5px;display:grid;gap:6px;margin-bottom:14px">' +
          '<div><b>Engine:</b> Pure HTML5 + CSS3 + Vanilla JS (Edge File-Safe)</div>' +
          '<div><b>Database:</b> IndexedDB <code>ubnetwork_lite_db</code> (Lokal PC)</div>' +
          '<div><b>Sync:</b> 1-Click Sync ke API &amp; SharePoint NUDB</div>' +
        '</div>' +
        '<button type="button" id="closeAboutBtn" class="btn btn-cyan" style="width:100%">Tutup</button>' +
      '</div>';
    document.body.appendChild(about);

    // 6. Settings Modal (ADMIN)
    var cfgModal = document.createElement('div');
    cfgModal.id = 'mbSettingsModal';
    cfgModal.className = 'modal-backdrop';
    cfgModal.innerHTML =
      '<div class="modal-card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
          '<h3 style="margin:0;font-size:16px;font-weight:800">⚙ Pengaturan Endpoint &amp; Default Line</h3>' +
          '<button id="mbCloseSet" class="btn" type="button" style="padding:4px 9px">✕</button>' +
        '</div>' +
        '<div style="display:grid;gap:10px">' +
          '<div class="grid-2">' +
            '<div><label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:4px">Nama Line</label><input id="cfgLine" class="input" placeholder="UB ASSY" /></div>' +
            '<div><label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:4px">Takt Time (menit)</label><input id="cfgTakt" class="input mono" type="number" step="0.1" /></div>' +
          '</div>' +
          '<div class="grid-2">' +
            '<div><label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:4px">Target CCR RED</label><input id="cfgCcrRed" class="input mono" type="number" /></div>' +
            '<div><label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:4px">Target CCR WHITE</label><input id="cfgCcrWhite" class="input mono" type="number" /></div>' +
          '</div>' +
          '<div><label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:4px">URL API Server (1-Klik Sync)</label><input id="cfgApiUrl" class="input mono" /></div>' +
          '<div><label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:4px">UB API Key (Opsional)</label><input id="cfgApiKey" class="input mono" type="password" /></div>' +
          '<div><label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:4px">URL SharePoint Sync (NUDB)</label><input id="cfgSpUrl" class="input mono" /></div>' +
          '<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#cbd5e1"><input id="cfgEnableSp" type="checkbox" /> Ikut kirim salinan ke SharePoint List saat Sync</label>' +
          '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px">' +
            '<button id="mbCancelSet" class="btn" type="button">Batal</button>' +
            '<button id="mbSaveSet" class="btn btn-emerald" type="button">Simpan Pengaturan</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(cfgModal);

    // 7. Footer & Floating macOS Dock (unless disabled)
    if (!opts.hideFooter) {
      var footer = document.createElement('footer');
      footer.className = 'mac-footer';
      footer.innerHTML =
        '<div class="mac-footer-inner">' +
          '<div><strong style="color:#e2e8f0">UBnetwork Lite</strong> &bull; Underbody Plant Manufacturing System &bull; Toyota Production System (TPS)</div>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
            '<a href="index.html">Beranda</a> &bull; ' +
            '<a href="productivity.html">Productivity</a> &bull; ' +
            '<a href="safety.html">Safety</a> &bull; ' +
            '<a href="quality.html">Quality</a> &bull; ' +
            '<a href="cost.html">Cost</a> &bull; ' +
            '<a href="hr.html">HR &amp; Morale</a> &bull; ' +
            '<a href="air-leakage.html">Environment</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(footer);
    }

    if (!opts.hideDock) {
      var dock = document.createElement('div');
      dock.className = 'dock-wrap';
      var items = [
        { href: 'index.html', icon: '🏠', title: 'Shopfloor Hub', cls: 'g-blue' },
        { href: 'productivity.html', icon: '🏭', title: 'Productivity Hub', cls: 'g-emerald' },
        { href: 'checksheet.html', icon: '📋', title: 'Daily Checksheet A4', cls: 'g-emerald' },
        { href: 'daily.html', icon: '☁️', title: 'Daily & Sync Center', cls: 'g-blue' },
        { href: 'display-kpi.html', icon: '📺', title: 'GL Management Board', cls: 'g-violet' },
        { sep: true },
        { href: 'safety.html', icon: '🦺', title: 'Safety & KYT', cls: 'g-rose' },
        { href: 'quality.html', icon: '🔍', title: 'Quality Control', cls: 'g-blue' },
        { href: 'hr.html', icon: '🙏', title: 'HR & Baca Doa', cls: 'g-purple' },
        { href: 'air-leakage.html', icon: '💨', title: 'Air Leakage (#lub)', cls: 'g-teal' },
        { href: 'andon.html', icon: '📡', title: 'Andon TV', cls: 'g-amber' }
      ];
      dock.innerHTML = '<nav class="dock-bar">' + items.map(function (it) {
        if (it.sep) return '<div class="dock-sep"></div>';
        var act = file === it.href ? ' dock-active' : '';
        return '<a href="' + it.href + '" class="dock-item ' + it.cls + act + '" title="' + it.title + '">' + it.icon + '</a>';
      }).join('') + '</nav>';
      document.body.appendChild(dock);
    }

    // --- Event Wiring ---
    function updateClock() {
      var now = new Date();
      var d = now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      var t = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      var el = document.getElementById('mbClock');
      if (el) el.textContent = d + '  ' + t;
    }
    updateClock();
    setInterval(updateClock, 1000);

    function closeDropdowns() {
      document.querySelectorAll('.mb-dropdown').forEach(function (d) { d.classList.remove('open'); });
      document.querySelectorAll('[data-mb-menu]').forEach(function (b) { b.classList.remove('active'); });
    }

    document.querySelectorAll('[data-mb-menu]').forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var id = 'mbDrop-' + btn.getAttribute('data-mb-menu');
        var drop = document.getElementById(id);
        var wasOpen = drop && drop.classList.contains('open');
        closeDropdowns();
        cc.classList.remove('open');
        if (drop && !wasOpen) {
          drop.classList.add('open');
          btn.classList.add('active');
        }
      });
    });

    document.addEventListener('click', function (ev) {
      if (!ev.target.closest('.mb-menu-wrap')) closeDropdowns();
      if (!ev.target.closest('#mbControlCenter') && !ev.target.closest('#mbCcBtn')) cc.classList.remove('open');
    });

    function openSpotlight() {
      closeDropdowns();
      cc.classList.remove('open');
      spot.classList.add('open');
      var inp = document.getElementById('spotInput');
      inp.value = '';
      renderSpot('');
      setTimeout(function () { inp.focus(); }, 40);
    }

    function renderSpot(q) {
      var list = document.getElementById('spotResults');
      var ql = (q || '').trim().toLowerCase();
      var hits = PAGES.filter(function (p) {
        return !ql || p.title.toLowerCase().indexOf(ql) >= 0 || p.desc.toLowerCase().indexOf(ql) >= 0 || p.cat.toLowerCase().indexOf(ql) >= 0;
      });
      list.innerHTML = hits.map(function (p) {
        return '<a href="' + p.href + '" class="mb-drop-link" style="padding:8px 10px">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span style="font-size:18px">' + p.icon + '</span>' +
            '<div><div style="font-weight:700">' + p.title + '</div><div style="font-size:11px;opacity:0.75">' + p.desc + '</div></div>' +
          '</div>' +
          '<span class="mb-kbd">' + p.kbd + '</span>' +
        '</a>';
      }).join('') || '<div style="padding:18px;text-align:center;color:var(--muted);font-size:12px">Tidak ditemukan hasil untuk "' + ql + '"</div>';
    }

    document.getElementById('spotInput').addEventListener('input', function (e) { renderSpot(e.target.value); });
    document.getElementById('mbSpotBtn').addEventListener('click', openSpotlight);
    document.getElementById('mbOpenSpotlight').addEventListener('click', openSpotlight);
    spot.addEventListener('click', function (e) { if (e.target === spot) spot.classList.remove('open'); });

    document.getElementById('mbCcBtn').addEventListener('click', function (ev) {
      ev.stopPropagation();
      closeDropdowns();
      cc.classList.toggle('open');
    });
    document.getElementById('mbRoleBtn').addEventListener('click', function (ev) {
      ev.stopPropagation();
      closeDropdowns();
      cc.classList.toggle('open');
    });

    function openAbout() { closeDropdowns(); about.classList.add('open'); }
    document.getElementById('mbAboutBtn').addEventListener('click', openAbout);
    document.getElementById('mbOpenAbout').addEventListener('click', openAbout);
    document.getElementById('closeAboutBtn').addEventListener('click', function () { about.classList.remove('open'); });
    about.addEventListener('click', function (e) { if (e.target === about) about.classList.remove('open'); });

    function openSettings() {
      closeDropdowns();
      cc.classList.remove('open');
      if (!global.UBL) return;
      global.UBL.getSettings().then(function (cfg) {
        if (cfg.role !== 'ADMIN') {
          global.UBL.toast('Pengaturan API hanya bisa diubah oleh role ADMIN.');
          return;
        }
        document.getElementById('cfgLine').value = cfg.lineName || 'UB ASSY';
        document.getElementById('cfgTakt').value = cfg.taktTime || 2.4;
        document.getElementById('cfgCcrRed').value = cfg.ccrTargetRed || 220;
        document.getElementById('cfgCcrWhite').value = cfg.ccrTargetWhite || 220;
        document.getElementById('cfgApiUrl').value = cfg.serverApiUrl || '';
        document.getElementById('cfgApiKey').value = cfg.apiKey || '';
        document.getElementById('cfgSpUrl').value = cfg.sharepointSyncUrl || '';
        document.getElementById('cfgEnableSp').checked = Boolean(cfg.enableSharepointSync);
        cfgModal.classList.add('open');
      });
    }
    document.getElementById('mbOpenSettings').addEventListener('click', openSettings);
    document.getElementById('ccSettingsBtn').addEventListener('click', openSettings);
    document.getElementById('mbCloseSet').addEventListener('click', function () { cfgModal.classList.remove('open'); });
    document.getElementById('mbCancelSet').addEventListener('click', function () { cfgModal.classList.remove('open'); });
    document.getElementById('mbSaveSet').addEventListener('click', function () {
      if (!global.UBL) return;
      global.UBL.saveSettings({
        lineName: document.getElementById('cfgLine').value.trim() || 'UB ASSY',
        taktTime: parseFloat(document.getElementById('cfgTakt').value) || 2.4,
        ccrTargetRed: parseInt(document.getElementById('cfgCcrRed').value, 10) || 220,
        ccrTargetWhite: parseInt(document.getElementById('cfgCcrWhite').value, 10) || 220,
        serverApiUrl: document.getElementById('cfgApiUrl').value.trim(),
        apiKey: document.getElementById('cfgApiKey').value.trim(),
        sharepointSyncUrl: document.getElementById('cfgSpUrl').value.trim(),
        enableSharepointSync: document.getElementById('cfgEnableSp').checked
      }).then(function () {
        cfgModal.classList.remove('open');
        global.UBL.toast('Pengaturan API & Line tersimpan!');
        if (typeof opts.onSettingsChanged === 'function') opts.onSettingsChanged();
      });
    });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (spot.classList.contains('open')) spot.classList.remove('open');
        else openSpotlight();
      } else if (e.key === 'Escape') {
        spot.classList.remove('open');
        about.classList.remove('open');
        cfgModal.classList.remove('open');
        cc.classList.remove('open');
        closeDropdowns();
      }
    });

    function refreshStatus() {
      if (!global.UBL) return;
      global.UBL.getSettings().then(function (cfg) {
        var r = cfg.role || 'ADMIN';
        document.getElementById('mbRoleBtn').textContent = 'Role: ' + r;
        document.getElementById('ccRoleSelect').value = r;
      });
      global.UBL.listReports().then(function (rows) {
        var drafts = rows.filter(function (r) { return r.syncStatus !== 'synced'; }).length;
        var pill = document.getElementById('mbDraftPill');
        pill.textContent = drafts > 0 ? ('Draft: ' + drafts) : ('Synced (' + rows.length + ')');
        pill.className = 'mb-pill ' + (drafts > 0 ? 'amber' : 'emerald');
      });
    }

    document.getElementById('ccRoleSelect').addEventListener('change', function (e) {
      if (!global.UBL) return;
      global.UBL.saveSettings({ role: e.target.value }).then(function () {
        refreshStatus();
        global.UBL.toast('Role aktif diubah ke ' + e.target.value);
        if (typeof opts.onRoleChanged === 'function') opts.onRoleChanged(e.target.value);
      });
    });

    refreshStatus();
    return { refreshStatus: refreshStatus, openSettings: openSettings, openSpotlight: openSpotlight };
  }

  global.MacOS = { injectChrome: injectChrome };
})(window);
