/* UBnetwork-lite Local Database (IndexedDB) + Role & 1-Click Server Sync */
(function (global) {
  'use strict';

  var DB_NAME = 'ubnetwork_lite_db';
  var DB_VERSION = 2;

  var DEFAULT_SETTINGS = {
    id: 'main',
    lineName: 'UB ASSY',
    taktTime: 2.4,
    ccrTargetRed: 220,
    ccrTargetWhite: 220,
    serverApiUrl: 'https://bungtemin.net/ub/api',
    apiKey: '',
    sharepointSyncUrl: 'https://nudb.bungtemin.net/functions/ub_sp_sync',
    enableSharepointSync: true,
    airLeakageApiUrl: 'https://nudb.bungtemin.net/functions/air_leakage_api',
    role: 'ADMIN', // RED | WHITE | ADMIN | VIEWER
    picRed: 'GL RED',
    spvRed: 'TL RED',
    picWhite: 'GL WHITE',
    spvWhite: 'TL WHITE'
  };

  var DAY_SLOTS = [
    { no: 1, timeRange: '07:30 - 08:30', plan: 25, isOvertime: false },
    { no: 2, timeRange: '08:30 - 09:30', plan: 25, isOvertime: false },
    { no: 3, timeRange: '09:40 - 10:40', plan: 25, isOvertime: false },
    { no: 4, timeRange: '10:40 - 11:40', plan: 25, isOvertime: false },
    { no: 5, timeRange: '12:30 - 13:30', plan: 25, isOvertime: false },
    { no: 6, timeRange: '13:30 - 14:30', plan: 25, isOvertime: false },
    { no: 7, timeRange: '14:40 - 15:40', plan: 25, isOvertime: false },
    { no: 8, timeRange: '15:40 - 16:30', plan: 20, isOvertime: false },
    { no: 9, timeRange: '16:30 - 17:30', plan: 25, isOvertime: true },
    { no: 10, timeRange: '17:30 - 18:30', plan: 0, isOvertime: true }
  ];

  var NIGHT_SLOTS = [
    { no: 1, timeRange: '20:30 - 21:30', plan: 25, isOvertime: false },
    { no: 2, timeRange: '21:30 - 22:30', plan: 25, isOvertime: false },
    { no: 3, timeRange: '22:40 - 23:40', plan: 25, isOvertime: false },
    { no: 4, timeRange: '23:40 - 00:40', plan: 25, isOvertime: false },
    { no: 5, timeRange: '01:30 - 02:30', plan: 25, isOvertime: false },
    { no: 6, timeRange: '02:30 - 03:30', plan: 25, isOvertime: false },
    { no: 7, timeRange: '03:40 - 04:40', plan: 25, isOvertime: false },
    { no: 8, timeRange: '04:40 - 05:30', plan: 20, isOvertime: false },
    { no: 9, timeRange: '05:30 - 06:30', plan: 25, isOvertime: true },
    { no: 10, timeRange: '06:30 - 07:30', plan: 0, isOvertime: true }
  ];

  function wibToday() {
    return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
  }

  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (ev) {
        var db = ev.target.result;
        if (!db.objectStoreNames.contains('reports')) {
          var rs = db.createObjectStore('reports', { keyPath: 'id' });
          rs.createIndex('tanggal', 'tanggal', { unique: false });
          rs.createIndex('syncStatus', 'syncStatus', { unique: false });
        }
        if (!db.objectStoreNames.contains('daily_activities')) {
          db.createObjectStore('daily_activities', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sync_logs')) {
          db.createObjectStore('sync_logs', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('air_leakage_checks')) {
          db.createObjectStore('air_leakage_checks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('air_leakage_findings')) {
          db.createObjectStore('air_leakage_findings', { keyPath: 'id' });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function txOp(storeName, mode, fn) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(storeName, mode);
        var store = tx.objectStore(storeName);
        var req = fn(store);
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function getSettings() {
    return txOp('settings', 'readonly', function (s) { return s.get('main'); })
      .then(function (row) { return Object.assign({}, DEFAULT_SETTINGS, row || {}); });
  }

  function saveSettings(patch) {
    return getSettings().then(function (cur) {
      var next = Object.assign({}, cur, patch, { id: 'main', updatedAt: new Date().toISOString() });
      return txOp('settings', 'readwrite', function (s) { return s.put(next); }).then(function () { return next; });
    });
  }

  function makeReportId(tanggal, shift, lineName) {
    return (tanggal + '_' + shift + '_' + (lineName || 'UB ASSY')).replace(/\s+/g, '_');
  }

  function getReport(id) {
    return txOp('reports', 'readonly', function (s) { return s.get(id); });
  }

  function listReports() {
    return txOp('reports', 'readonly', function (s) { return s.getAll(); }).then(function (rows) {
      return (rows || []).sort(function (a, b) {
        if (a.tanggal !== b.tanggal) return (b.tanggal || '').localeCompare(a.tanggal || '');
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
      });
    });
  }

  function saveReport(rep) {
    rep.updatedAt = new Date().toISOString();
    if (!rep.syncStatus) rep.syncStatus = 'draft';
    return txOp('reports', 'readwrite', function (s) { return s.put(rep); }).then(function () { return rep; });
  }

  function deleteReport(id) {
    return txOp('reports', 'readwrite', function (s) { return s.delete(id); });
  }

  function addNumberPreservePad(raw, delta) {
    var digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return '';
    var num = parseInt(digits, 10);
    if (isNaN(num)) return '';
    var next = Math.max(0, num + delta);
    if (digits.length > 1 && digits.charAt(0) === '0') {
      return String(next).padStart(digits.length, '0');
    }
    return String(next);
  }

  function findLatestPrevFinish(targetDate, targetShift, isNight) {
    return listReports().then(function (all) {
      var cands = all.filter(function (r) {
        var fin = String(r.noBodyFinish || '').replace(/\D/g, '');
        if (!fin || !r.tanggal) return false;
        if (r.tanggal < targetDate) return true;
        if (r.tanggal === targetDate && r.shift !== targetShift) {
          return isNight ? r.session !== 'night' : false;
        }
        return false;
      });
      cands.sort(function (a, b) {
        if (a.tanggal !== b.tanggal) return b.tanggal.localeCompare(a.tanggal);
        var an = a.session === 'night' ? 1 : 0;
        var bn = b.session === 'night' ? 1 : 0;
        if (an !== bn) return bn - an;
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
      });
      if (!cands.length) return null;
      return {
        finish: cands[0].noBodyFinish,
        label: cands[0].shift + ' ' + (cands[0].session === 'night' ? 'Malam' : 'Siang') + ' (' + cands[0].tanggal + ')'
      };
    });
  }

  function canEditShift(role, shift) {
    if (role === 'ADMIN') return true;
    if (role === 'VIEWER') return false;
    return role === shift;
  }

  function syncOneReportToServer(rep) {
    return getSettings().then(function (cfg) {
      var totalPlan = 0, totalAct = 0, intDelay = 0, extDelay = 0;
      (rep.slots || []).forEach(function (sl) {
        totalPlan += Number(sl.plan || 0);
        if (sl.act !== '' && sl.act !== null && sl.act !== undefined) {
          totalAct += Number(sl.act || 0);
        }
        var d = Number(sl.delayMin || 0);
        if (sl.category === 'EXT') extDelay += d; else intDelay += d;
      });
      var totalDiff = totalAct - totalPlan;
      var eff = totalPlan > 0 ? Number(((totalAct / totalPlan) * 100).toFixed(1)) : 0;

      var payload = {
        tanggal: rep.tanggal,
        shift: rep.shift,
        line_name: rep.lineName || cfg.lineName,
        template_code: rep.session === 'night' ? 'malam_normal' : 'siang_normal',
        takt_time: Number(rep.taktTime || cfg.taktTime || 2.4),
        pic_name: rep.picName || '',
        spv_name: rep.spvName || '',
        no_body_start: rep.noBodyStart || '',
        no_body_finish: rep.noBodyFinish || '',
        jam_stop_produksi: rep.jamStopProduksi || '',
        ccr_plan: Number(rep.ccrPlan || 0),
        total_plan: totalPlan,
        total_act: totalAct,
        total_diff: totalDiff,
        int_delay_min: intDelay,
        ext_delay_min: extDelay,
        total_delay_min: intDelay + extDelay,
        act_ot_hours: Number(rep.actOtHours || 0),
        act_ot_units: Number(rep.actOtUnits || 0),
        issues: (rep.slots || []).map(function (sl) {
          return {
            slot_no: sl.no,
            time_range: sl.timeRange,
            plan: Number(sl.plan || 0),
            act: sl.act === '' || sl.act === null ? null : Number(sl.act),
            delay_min: Number(sl.delayMin || 0),
            category: sl.category || 'INT',
            problem: sl.problem || '',
            countermeasure: sl.countermeasure || ''
          };
        })
      };

      var tasks = [];
      // 1. Primary API (MySQL / Next.js /ub/api)
      if (cfg.serverApiUrl) {
        var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (cfg.apiKey) headers['x-ub-api-key'] = cfg.apiKey;
        tasks.push(
          fetch(cfg.serverApiUrl.replace(/\?.*$/, '') + '?action=save_report', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
          }).then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) {
              return { target: 'mysql', ok: r.ok && j.status !== 'error', status: r.status, message: j.message || j.error || '' };
            });
          }).catch(function (e) {
            return { target: 'mysql', ok: false, status: 0, message: e.message };
          })
        );
      }

      // 2. Optional SharePoint List via NUDB (1x upsert)
      if (cfg.enableSharepointSync && cfg.sharepointSyncUrl) {
        var spPayload = {
          listName: 'UB_Production_Reports',
          syncKey: rep.id,
          fields: {
            Title: rep.tanggal + ' | ' + rep.shift + ' | ' + (rep.lineName || cfg.lineName),
            SyncKey: rep.id,
            Tanggal: rep.tanggal,
            Shift: rep.shift,
            LineName: rep.lineName || cfg.lineName,
            TemplateCode: payload.template_code,
            TaktTime: payload.takt_time,
            TotalPlan: totalPlan,
            TotalAct: totalAct,
            TotalDiff: totalDiff,
            CcrPlan: payload.ccr_plan,
            EfficiencyPct: eff,
            IntDelayMin: intDelay,
            ExtDelayMin: extDelay,
            TotalDelayMin: intDelay + extDelay,
            NoBodyStart: payload.no_body_start,
            NoBodyFinish: payload.no_body_finish,
            JamStopProduksi: payload.jam_stop_produksi,
            ActOtHours: payload.act_ot_hours,
            ActOtUnits: payload.act_ot_units,
            PicName: payload.pic_name,
            SpvName: payload.spv_name,
            SyncedAt: new Date().toISOString()
          }
        };
        tasks.push(
          fetch(cfg.sharepointSyncUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(spPayload)
          }).then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) {
              return { target: 'sharepoint', ok: r.ok && j.success !== false, status: r.status, message: j.error || j.action || '' };
            });
          }).catch(function (e) {
            return { target: 'sharepoint', ok: false, status: 0, message: e.message };
          })
        );
      }

      return Promise.all(tasks).then(function (results) {
        var anyOk = results.some(function (x) { return x.ok; });
        rep.syncStatus = anyOk ? 'synced' : 'failed';
        rep.lastSyncedAt = anyOk ? new Date().toISOString() : (rep.lastSyncedAt || '');
        rep.lastSyncDetail = results;
        return saveReport(rep).then(function () {
          return txOp('sync_logs', 'readwrite', function (s) {
            return s.add({ reportId: rep.id, ok: anyOk, results: results, at: new Date().toISOString() });
          }).then(function () {
            return { ok: anyOk, results: results, report: rep };
          });
        });
      });
    });
  }

  function exportBackupJson() {
    return Promise.all([getSettings(), listReports()]).then(function (res) {
      return JSON.stringify({
        app: 'UBnetwork-lite',
        exportedAt: new Date().toISOString(),
        settings: res[0],
        reports: res[1]
      }, null, 2);
    });
  }

  function importBackupJson(rawText) {
    var parsed = JSON.parse(rawText);
    var reps = Array.isArray(parsed.reports) ? parsed.reports : [];
    return Promise.all(reps.map(function (r) { return saveReport(r); })).then(function () {
      return reps.length;
    });
  }

  function toast(msg) {
    var el = document.getElementById('ubl-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ubl-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }


  var AIR_POINTS = [
    { code: 'P1', point: 'Selang Angin & Quick Coupler', area: 'Station 1-3' },
    { code: 'P2', point: 'Fitting, Elbow & Tee Pneumatik', area: 'Station 1-5' },
    { code: 'P3', point: 'Regulator, Filter & FRL Unit', area: 'Main & Sub Line' },
    { code: 'P4', point: 'Solenoid Valve & Manifold', area: 'Jig & Clamp' },
    { code: 'P5', point: 'Cylinder Pneumatik & Seal Piston', area: 'Spot & Clamp' },
    { code: 'P6', point: 'Air Gun / Blow Off & Main Pipe', area: 'All Area' }
  ];

  function getAirCheck(date, shift) {
    var id = date + '_' + shift;
    return txOp('air_leakage_checks', 'readonly', function (s) { return s.get(id); }).then(function (row) {
      if (row) return row;
      return {
        id: id,
        date: date,
        shift: shift,
        inspector: '',
        notes: '',
        items: AIR_POINTS.map(function (pt) { return { code: pt.code, point: pt.point, area: pt.area, status: 'OK', note: '' }; }),
        syncStatus: 'draft'
      };
    });
  }

  function saveAirCheck(doc) {
    doc.updatedAt = new Date().toISOString();
    if (!doc.syncStatus) doc.syncStatus = 'draft';
    return txOp('air_leakage_checks', 'readwrite', function (s) { return s.put(doc); }).then(function () { return doc; });
  }

  function listAirFindings() {
    return txOp('air_leakage_findings', 'readonly', function (s) { return s.getAll(); }).then(function (rows) {
      return (rows || []).sort(function (a, b) {
        if (a.date !== b.date) return (b.date || '').localeCompare(a.date || '');
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
      });
    });
  }

  function saveAirFinding(item) {
    item.updatedAt = new Date().toISOString();
    if (!item.syncStatus) item.syncStatus = 'draft';
    return txOp('air_leakage_findings', 'readwrite', function (s) { return s.put(item); }).then(function () { return item; });
  }

  function deleteAirFinding(id) {
    return txOp('air_leakage_findings', 'readwrite', function (s) { return s.delete(id); });
  }

  function syncAirCheckToServer(doc) {
    return getSettings().then(function (cfg) {
      var url = (cfg.airLeakageApiUrl || 'https://nudb.bungtemin.net/functions/air_leakage_api') + '?type=checksheet';
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          date: doc.date,
          shift: doc.shift,
          inspector: doc.inspector || '',
          items: doc.items || [],
          notes: doc.notes || ''
        })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          var ok = r.ok && j.success !== false;
          doc.syncStatus = ok ? 'synced' : 'failed';
          return saveAirCheck(doc).then(function () { return { ok: ok, data: j }; });
        });
      }).catch(function (e) {
        doc.syncStatus = 'failed';
        return saveAirCheck(doc).then(function () { return { ok: false, error: e.message }; });
      });
    });
  }

  function syncAirFindingToServer(item) {
    return getSettings().then(function (cfg) {
      var base = cfg.airLeakageApiUrl || 'https://nudb.bungtemin.net/functions/air_leakage_api';
      var isUpdate = Boolean(item.remoteId);
      var url = isUpdate ? (base + '?action=update&id=' + encodeURIComponent(item.remoteId)) : (base + '?type=findings');
      return fetch(url, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          id: item.remoteId || undefined,
          date: item.date,
          shift: item.shift,
          member: item.member || '',
          area: item.area || '',
          problem: item.problem || '',
          severity: item.severity || 'sedang',
          countermeasure: item.countermeasure || '',
          kaizenTitle: item.kaizenTitle || '',
          kaizenBenefit: item.kaizenBenefit || '',
          isKaizen: Boolean(item.isKaizen || item.countermeasure),
          pic: item.pic || '',
          status: item.status || 'open'
        })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          var ok = r.ok && j.success !== false;
          if (ok && j.item && j.item.id) item.remoteId = j.item.id;
          item.syncStatus = ok ? 'synced' : 'failed';
          return saveAirFinding(item).then(function () { return { ok: ok, data: j }; });
        });
      }).catch(function (e) {
        item.syncStatus = 'failed';
        return saveAirFinding(item).then(function () { return { ok: false, error: e.message }; });
      });
    });
  }

  global.UBL = {
    DAY_SLOTS: DAY_SLOTS,
    NIGHT_SLOTS: NIGHT_SLOTS,
    wibToday: wibToday,
    getSettings: getSettings,
    saveSettings: saveSettings,
    makeReportId: makeReportId,
    getReport: getReport,
    listReports: listReports,
    saveReport: saveReport,
    deleteReport: deleteReport,
    addNumberPreservePad: addNumberPreservePad,
    findLatestPrevFinish: findLatestPrevFinish,
    canEditShift: canEditShift,
    syncOneReportToServer: syncOneReportToServer,
    exportBackupJson: exportBackupJson,
    importBackupJson: importBackupJson,
    AIR_POINTS: AIR_POINTS,
    getAirCheck: getAirCheck,
    saveAirCheck: saveAirCheck,
    listAirFindings: listAirFindings,
    saveAirFinding: saveAirFinding,
    deleteAirFinding: deleteAirFinding,
    syncAirCheckToServer: syncAirCheckToServer,
    syncAirFindingToServer: syncAirFindingToServer,
    toast: toast
  };
})(window);
