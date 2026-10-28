/* ============================================================
   Panel Admin — Portofolio PPG
   Vanilla JavaScript · GitHub Contents API
   ============================================================ */

"use strict";

/* ============================================================
   KONFIGURASI
   ============================================================ */

/* Slot foto: rasio harus sama dengan bingkai di css/style.css */
const PHOTO_SLOTS = [
  { id: "hero",        file: "hero.jpg",        label: "Foto Hero (Beranda)",     ratio: [4, 3.4], width: 1200 },
  { id: "profil-1",    file: "profil-1.jpg",    label: "Foto Profil",             ratio: [9, 16],  width: 1080 },
  { id: "profil-2",    file: "profil-2.jpg",    label: "Foto Tujuan (Inspirasi)", ratio: [16, 8],  width: 1600 },
  { id: "inspirasi",   file: "inspirasi.jpg",   label: "Banner Inspirasi",        ratio: [16, 8],  width: 1600 },
  { id: "refleksi",    file: "refleksi.jpg",    label: "Foto Refleksi",           ratio: [16, 5],  width: 1600 },
  { id: "candi-sukuh", file: "candi-sukuh.jpg", label: "Candi Sukuh",             ratio: [16, 9],  width: 1600 },
  { id: "grojogan-sewu", file: "grojogan-sewu.jpg", label: "Grojogan Sewu",       ratio: [16, 9],  width: 1600 },
  { id: "sate-kelinci", file: "sate-kelinci.jpg", label: "Sate Kelinci",          ratio: [16, 9],  width: 1600 },
  { id: "jadah-tempe", file: "jadah-tempe.jpg", label: "Jadah Tempe",             ratio: [16, 9],  width: 1600 },
];

const ARTEFAK_DOCS = [
  { id: "rpp",      label: "RPP" },
  { id: "media",    label: "Media Pembelajaran" },
  { id: "hasil",    label: "Contoh Hasil Kerja Murid" },
  { id: "foto",     label: "Foto / Video Pembelajaran" },
  { id: "analisis", label: "Analisis Artefak Produk" },
  { id: "refleksi", label: "Refleksi Artefak Produk" },
];

const DOC_GROUPS = [
  { key: "artefak:siklus-1", title: "Artefak — Siklus 1", items: ARTEFAK_DOCS },
  { key: "artefak:siklus-2", title: "Artefak — Siklus 2", items: ARTEFAK_DOCS },
  { key: "artefak:siklus-3", title: "Artefak — Siklus 3", items: ARTEFAK_DOCS },
  { key: "artefak:siklus-4", title: "Artefak — Siklus 4", items: ARTEFAK_DOCS },
  {
    key: "lk3",
    title: "Lembar Kerja 3 — Non-Mengajar",
    items: [
      { id: "laporan",   label: "Laporan LK3" },
      { id: "pendukung", label: "Dokumen Pendukung" },
    ],
  },
  {
    key: "lampiran",
    title: "Lampiran",
    items: [
      { id: "perangkat", label: "Penilaian Penyusunan Perangkat" },
      { id: "praktik",   label: "Penilaian Praktik Mengajar" },
      { id: "foto",      label: "Foto / Video Kegiatan" },
    ],
  },
];

const EMPTY_DATA = () => ({
  artefak: {
    "siklus-1": { rpp: "", media: "", hasil: "", foto: "", analisis: "", refleksi: "" },
    "siklus-2": { rpp: "", media: "", hasil: "", foto: "", analisis: "", refleksi: "" },
    "siklus-3": { rpp: "", media: "", hasil: "", foto: "", analisis: "", refleksi: "" },
    "siklus-4": { rpp: "", media: "", hasil: "", foto: "", analisis: "", refleksi: "" },
  },
  lk3: { laporan: "", pendukung: "" },
  lampiran: { perangkat: "", praktik: "", foto: "" },
  videos: [],
});

/* ============================================================
   STATE & ELEMEN
   ============================================================ */

const state = { token: "", repo: "", data: EMPTY_DATA() };

const $ = (id) => document.getElementById(id);

let toastTimer = null;
function toast(msg, type) {
  const el = $("toast");
  el.textContent = msg;
  el.className = "a-toast" + (type ? " a-toast--" + type : "");
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 4200);
}

/* ============================================================
   GITHUB API
   ============================================================ */

async function gh(path, method, body) {
  const res = await fetch("https://api.github.com" + path, {
    method: method || "GET",
    headers: {
      Authorization: "Bearer " + state.token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = "HTTP " + res.status;
    try {
      const err = await res.json();
      if (err.message) msg = err.message;
    } catch (e) { /* abaikan */ }
    throw new Error(msg);
  }
  return res.json();
}

/* Ambil isi file teks (null bila belum ada) */
async function getFileText(path) {
  try {
    const info = await gh(
      `/repos/${state.repo}/contents/${encodeURI(path)}?ref=main`
    );
    const text = atob(info.content.replace(/\n/g, ""));
    return { text, sha: info.sha };
  } catch (e) {
    return null; /* 404 atau masalah lain — anggap belum ada */
  }
}

/* Unggah file (base64) — membuat commit otomatis */
async function putFile(path, base64, message) {
  const existing = await gh(
    `/repos/${state.repo}/contents/${encodeURI(path)}?ref=main`
  ).catch(() => null);
  const body = { message, content: base64, branch: "main" };
  if (existing) body.sha = existing.sha;
  return gh(`/repos/${state.repo}/contents/${encodeURI(path)}`, "PUT", body);
}

function b64encode(str) {
  return btoa(
    new Uint8Array(new TextEncoder().encode(str)).reduce(
      (a, b) => a + String.fromCharCode(b), ""
    )
  );
}

function fileToBase64(blob) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result.split(",")[1]);
    fr.readAsDataURL(blob);
  });
}

/* ============================================================
   LOGIN
   ============================================================ */

async function tryLogin(token, repo) {
  state.token = token.trim();
  state.repo = repo.trim();
  const info = await gh(`/repos/${state.repo}`);
  localStorage.setItem("ppg_admin_token", state.token);
  localStorage.setItem("ppg_admin_repo", state.repo);
  $("repoInfo").textContent = `Terhubung: ${info.full_name} (branch ${info.default_branch})`;
  $("loginView").hidden = true;
  $("appView").hidden = false;
  await bootApp();
}

async function bootApp() {
  await Promise.all([loadData(), renderPhotoSlots()]);
  buildDocGroups();
  buildVideoList();
}

function initLogin() {
  const savedToken = localStorage.getItem("ppg_admin_token");
  const savedRepo = localStorage.getItem("ppg_admin_repo");
  if (savedRepo) $("repoInput").value = savedRepo;
  if (savedToken) $("tokenInput").value = savedToken;

  $("tokenShow").addEventListener("click", () => {
    const inp = $("tokenInput");
    inp.type = inp.type === "password" ? "text" : "password";
    $("tokenShow").textContent = inp.type === "password" ? "Tampil" : "Sembunyi";
  });

  $("loginBtn").addEventListener("click", async () => {
    const err = $("loginError");
    err.hidden = true;
    const token = $("tokenInput").value;
    const repo = $("repoInput").value;
    if (!token || !repo.includes("/")) {
      err.textContent = "Isi repository (owner/nama-repo) dan token GitHub.";
      err.hidden = false;
      return;
    }
    const btn = $("loginBtn");
    btn.disabled = true;
    btn.textContent = "Menghubungkan…";
    try {
      await tryLogin(token, repo);
    } catch (e) {
      err.textContent =
        "Gagal: " + e.message +
        " — pastikan token punya izin Contents (Read and write) dan repo-nya benar.";
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = "Simpan & Masuk";
    }
  });

  $("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("ppg_admin_token");
    location.reload();
  });
}

/* ============================================================
   TAB
   ============================================================ */

function initTabs() {
  const tabs = document.querySelectorAll(".a-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      ["foto", "dok", "video"].forEach((k) => {
        $("atab-" + k).hidden = k !== tab.dataset.atab;
      });
    });
  });
}

/* ============================================================
   FOTO — slot & thumbnail
   ============================================================ */

function rawUrl(file) {
  return (
    "https://raw.githubusercontent.com/" +
    state.repo + "/main/assets/img/" + file +
    "?v=" + Date.now()
  );
}

async function renderPhotoSlots() {
  const host = $("photoGrid");
  host.innerHTML = "";

  const existing = await getFileText("assets/img/.ada").catch(() => null);
  void existing;

  PHOTO_SLOTS.forEach((slot) => {
    const card = document.createElement("div");
    card.className = "a-slot";
    card.innerHTML =
      `<div class="a-slot__head">` +
      `<h3>${slot.label}</h3>` +
      `<span class="a-slot__ratio">${slot.ratio[0]}:${slot.ratio[1]}</span>` +
      `</div>` +
      `<div class="a-slot__thumb"><img alt="${slot.label}" src="${rawUrl(slot.file)}"></div>` +
      `<button class="a-btn a-btn--ghost" type="button">📷 Pilih &amp; Atur Foto</button>`;
    const img = card.querySelector("img");
    img.addEventListener("error", () => {
      img.remove();
      card.querySelector(".a-slot__thumb").textContent = "Belum ada foto";
    });
    card.querySelector("button").addEventListener("click", () => pickPhoto(slot));
    host.appendChild(card);
  });
}

/* ============================================================
   FOTO — pemilih file
   ============================================================ */

function pickPhoto(slot) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => openCrop(slot, img, file.name);
      img.onerror = () => toast("File tidak bisa dibaca sebagai gambar.", "error");
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
  input.click();
}

/* ============================================================
   FOTO — editor crop (geser + zoom)
   ============================================================ */

const crop = { slot: null, img: null, scale: 1, minScale: 1, x: 0, y: 0, frameW: 0, frameH: 0 };

function openCrop(slot, img, fileName) {
  crop.slot = slot;
  crop.img = img;

  const [r0, r1] = slot.ratio;
  const frame = $("cropFrame");
  frame.style.aspectRatio = r0 + " / " + r1;
  $("cropTitle").textContent = slot.label + (fileName ? " — " + fileName : "");

  /* Ukuran tampil frame (px) */
  crop.frameW = frame.clientWidth;
  crop.frameH = frame.clientHeight;

  crop.minScale = Math.max(crop.frameW / img.naturalWidth, crop.frameH / img.naturalHeight);
  crop.scale = crop.minScale;

  const zoom = $("cropZoom");
  zoom.min = 1;
  zoom.max = 3;
  zoom.value = 1;

  /* Posisi awal: mendekati bagian atas (wajah) */
  const dw = img.naturalWidth * crop.scale;
  const dh = img.naturalHeight * crop.scale;
  crop.x = (crop.frameW - dw) / 2;
  crop.y = Math.min(0, (crop.frameH - dh) * 0.2);

  layoutCrop();
  $("cropModal").hidden = false;
}

function layoutCrop() {
  const el = $("cropImg");
  el.src = crop.img.src;
  el.style.width = crop.img.naturalWidth * crop.scale + "px";
  el.style.height = crop.img.naturalHeight * crop.scale + "px";
  el.style.left = crop.x + "px";
  el.style.top = crop.y + "px";
}

function clampCrop() {
  const dw = crop.img.naturalWidth * crop.scale;
  const dh = crop.img.naturalHeight * crop.scale;
  crop.x = Math.min(0, Math.max(crop.frameW - dw, crop.x));
  crop.y = Math.min(0, Math.max(crop.frameH - dh, crop.y));
}

function initCropModal() {
  const frame = $("cropFrame");

  /* Geser dengan pointer (mouse / sentuh) */
  let drag = null;
  frame.addEventListener("pointerdown", (e) => {
    drag = { sx: e.clientX, sy: e.clientY, ox: crop.x, oy: crop.y };
    frame.setPointerCapture(e.pointerId);
  });
  frame.addEventListener("pointermove", (e) => {
    if (!drag) return;
    crop.x = drag.ox + (e.clientX - drag.sx);
    crop.y = drag.oy + (e.clientY - drag.sy);
    clampCrop();
    layoutCrop();
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    frame.addEventListener(ev, () => (drag = null))
  );

  $("cropZoom").addEventListener("input", (e) => {
    const oldScale = crop.scale;
    crop.scale = crop.minScale * parseFloat(e.target.value);
    /* Jaga posisi titik tengah frame tetap di tempat yang sama */
    const k = crop.scale / oldScale;
    crop.x = crop.x * k + (crop.frameW / 2) * (1 - k);
    crop.y = crop.y * k + (crop.frameH / 2) * (1 - k);
    clampCrop();
    layoutCrop();
  });

  $("cropReset").addEventListener("click", () => {
    $("cropZoom").value = 1;
    crop.scale = crop.minScale;
    const dw = crop.img.naturalWidth * crop.scale;
    const dh = crop.img.naturalHeight * crop.scale;
    crop.x = (crop.frameW - dw) / 2;
    crop.y = Math.min(0, (crop.frameH - dh) * 0.2);
    clampCrop();
    layoutCrop();
  });

  const close = () => {
    $("cropModal").hidden = true;
    $("cropImg").removeAttribute("src");
  };
  $("cropClose").addEventListener("click", close);
  $("cropCancel").addEventListener("click", close);

  $("cropSave").addEventListener("click", saveCrop);
}

async function saveCrop() {
  const btn = $("cropSave");
  btn.disabled = true;
  btn.textContent = "Mengunggah…";
  try {
    const [r0, r1] = crop.slot.ratio;
    const TW = crop.slot.width;
    const TH = Math.round((TW * r1) / r0);

    const canvas = document.createElement("canvas");
    canvas.width = TW;
    canvas.height = TH;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, TW, TH);
    ctx.imageSmoothingQuality = "high";

    const sx = -crop.x / crop.scale;
    const sy = -crop.y / crop.scale;
    const sw = crop.frameW / crop.scale;
    const sh = crop.frameH / crop.scale;
    ctx.drawImage(crop.img, sx, sy, sw, sh, 0, 0, TW, TH);

    const blob = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", 0.88)
    );
    const b64 = await fileToBase64(blob);

    await putFile(
      "assets/img/" + crop.slot.file,
      b64,
      `Perbarui foto ${crop.slot.label} via panel admin`
    );

    $("cropModal").hidden = true;
    $("cropImg").removeAttribute("src");
    await renderPhotoSlots();
    toast(`Foto "${crop.slot.label}" terunggah — tampil di situs ±1 menit.`, "ok");
  } catch (e) {
    toast("Gagal mengunggah: " + e.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "💾 Simpan & Kirim";
  }
}

/* ============================================================
   DOKUMEN — muat & tampilkan
   ============================================================ */

async function loadData() {
  const res = await getFileText("data/dokumen.json");
  if (res && res.text) {
    try {
      const parsed = JSON.parse(res.text);
      state.data = Object.assign(EMPTY_DATA(), parsed);
    } catch (e) {
      /* pakai default */
    }
  }
}

function extractDriveId(v) {
  if (!v) return "";
  const s = String(v).trim();
  const m =
    s.match(/\/file\/d\/([\w-]{10,})/) ||
    s.match(/[?&]id=([\w-]{10,})/) ||
    s.match(/^([\w-]{20,})$/);
  return m ? m[1] : s;
}

function valueAt(groupKey) {
  if (groupKey.indexOf("artefak:") === 0) {
    const sk = groupKey.split(":")[1];
    if (!state.data.artefak[sk]) state.data.artefak[sk] = {};
    return state.data.artefak[sk];
  }
  if (!state.data[groupKey]) state.data[groupKey] = {};
  return state.data[groupKey];
}

function buildDocGroups() {
  const host = $("docGroups");
  host.innerHTML = "";

  DOC_GROUPS.forEach((group) => {
    const box = document.createElement("details");
    box.className = "a-group";
    if (group.key === "artefak:siklus-1") box.open = true;

    const map = valueAt(group.key);
    let filled = 0;
    group.items.forEach((it) => { if (map[it.id]) filled++; });

    box.innerHTML =
      `<summary>${group.title}<span class="a-docrow__badge ${filled ? "a-docrow__badge--ok" : "a-docrow__badge--empty"}">${filled}/${group.items.length} terisi</span></summary>` +
      `<div class="a-group__body"></div>`;
    const body = box.querySelector(".a-group__body");

    group.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "a-docrow";
      row.innerHTML =
        `<span class="a-docrow__label">${item.label}</span>` +
        `<input type="text" placeholder="https://drive.google.com/file/d/..." value="${map[item.id] || ""}">` +
        `<button class="a-btn a-btn--ghost" type="button" data-act="preview">Pratinjau</button>` +
        `<span class="a-docrow__badge ${map[item.id] ? "a-docrow__badge--ok" : "a-docrow__badge--empty"}">${map[item.id] ? "✓ terisi" : "kosong"}</span>`;

      const input = row.querySelector("input");
      const badge = row.querySelectorAll(".a-docrow__badge")[1];

      input.addEventListener("input", () => {
        const val = input.value.trim();
        map[item.id] = val ? extractDriveId(val) : "";
        const ok = !!map[item.id];
        badge.textContent = ok ? "✓ terisi" : "kosong";
        badge.className = "a-docrow__badge " + (ok ? "a-docrow__badge--ok" : "a-docrow__badge--empty");
        refreshGroupBadge(box, group, map);
      });

      row.querySelector('[data-act="preview"]').addEventListener("click", () => {
        const id = map[item.id] || extractDriveId(input.value);
        if (!id) {
          toast("Isi dulu link Drive-nya.", "error");
          return;
        }
        window.open("https://drive.google.com/file/d/" + id + "/preview", "_blank");
      });

      body.appendChild(row);
    });

    host.appendChild(box);
  });
}

function refreshGroupBadge(box, group, map) {
  let filled = 0;
  group.items.forEach((it) => { if (map[it.id]) filled++; });
  const badge = box.querySelector("summary .a-docrow__badge");
  badge.textContent = `${filled}/${group.items.length} terisi`;
  badge.className = "a-docrow__badge " + (filled ? "a-docrow__badge--ok" : "a-docrow__badge--empty");
}

async function saveDocs() {
  const btn = $("saveDocs");
  btn.disabled = true;
  btn.textContent = "Menyimpan…";
  try {
    const json = JSON.stringify(state.data, null, 2);
    await putFile("data/dokumen.json", b64encode(json), "Perbarui dokumen tugas via panel admin");
    toast("Dokumen tersimpan — perubahan live di situs ±1 menit.", "ok");
  } catch (e) {
    toast("Gagal menyimpan: " + e.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "💾 Simpan Semua ke GitHub";
  }
}

/* ============================================================
   VIDEO — daftar & simpan
   ============================================================ */

function buildVideoList() {
  const host = $("videoList");
  host.innerHTML = "";
  state.data.videos.forEach((v, i) => host.appendChild(videoRow(v, i)));
}

function videoRow(video, index) {
  const row = document.createElement("div");
  row.className = "a-videorow";
  row.innerHTML =
    `<label>Judul<input type="text" data-f="title" value="${video.title || ""}" placeholder="Praktik Mengajar Siklus 1"></label>` +
    `<label>Deskripsi<input type="text" data-f="desc" value="${video.desc || ""}" placeholder="Materi Algoritma"></label>` +
    `<button class="a-btn a-btn--danger" type="button">Hapus</button>` +
    `<label class="a-field--wide">Link video<input type="text" data-f="url" value="${video.url || ""}" placeholder="https://youtu.be/... atau https://drive.google.com/file/d/..."></label>`;
  row.querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("input", () => {
      state.data.videos[index][inp.dataset.f] = inp.value.trim();
    });
  });
  row.querySelector("button").addEventListener("click", () => {
    state.data.videos.splice(index, 1);
    buildVideoList();
  });
  return row;
}

function initVideos() {
  $("addVideo").addEventListener("click", () => {
    state.data.videos.push({ title: "", desc: "", url: "" });
    buildVideoList();
    const rows = $("videoList").querySelectorAll(".a-videorow input");
    if (rows.length) rows[rows.length - 3].focus();
  });
  $("saveVideos").addEventListener("click", async () => {
    const btn = $("saveVideos");
    btn.disabled = true;
    btn.textContent = "Menyimpan…";
    try {
      state.data.videos = state.data.videos.filter((v) => v.url);
      const json = JSON.stringify(state.data, null, 2);
      await putFile("data/dokumen.json", b64encode(json), "Perbarui daftar video via panel admin");
      buildVideoList();
      toast("Video tersimpan — live di situs ±1 menit.", "ok");
    } catch (e) {
      toast("Gagal menyimpan: " + e.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "💾 Simpan Semua ke GitHub";
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initTabs();
  initCropModal();
  initVideos();
  $("saveDocs").addEventListener("click", saveDocs);
});
