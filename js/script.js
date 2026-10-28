/* ============================================================
   Portofolio PPG — Ilham Kresnamurti, S.Kom.
   Vanilla JavaScript
   ============================================================ */

"use strict";

/* ---------- Data Artefak Produk (per siklus) ---------- */
/*
 * Artefak tiap siklus. Isi driveId (ID file Google Drive) agar dokumen
 * tampil langsung di situs. Cara mendapatkan ID:
 *   https://drive.google.com/file/d/1AbC...XYZ/view  →  ID = 1AbC...XYZ
 * Set file ke akses "Anyone with the link" agar bisa ditampilkan.
 * Kosongkan driveId ("") bila dokumen belum siap — tampil placeholder.
 * images: array path foto hasil upload sendiri, mis. ["assets/img/rpp-1.jpg"]
 */
const ARTEFAK_ITEMS = [
  {
    id: "rpp",
    icon: "📄",
    title: "Rencana Pelaksanaan Pembelajaran (RPP)",
    slug: "rencana-pelaksanaan-pembelajaran-rpp",
    note: "Perangkat pembelajaran lengkap",
    desc:
      "Rencana Pelaksanaan Pembelajaran berisi identitas sekolah, capaian pembelajaran, tujuan pembelajaran, materi ajar, tahapan kegiatan (pendahuluan, inti, penutup), penilaian, serta refleksi pembelajaran.",
    driveId: "",
    images: [],
  },
  {
    id: "media",
    icon: "🖥️",
    title: "Media Pembelajaran",
    slug: "media-pembelajaran",
    note: "Media & sumber belajar digital",
    desc:
      "Media dan sumber belajar yang digunakan dalam pembelajaran — slide presentasi, video interaktif, aplikasi simulasi, atau LKPD digital yang mendukung pemahaman murid terhadap materi Informatika.",
    driveId: "",
    images: [],
  },
  {
    id: "hasil",
    icon: "✍️",
    title: "Contoh Hasil Kerja Murid",
    slug: "contoh-hasil-kerja-murid",
    note: "Bukti capaian belajar peserta didik",
    desc:
      "Kumpulan contoh hasil karya peserta didik sebagai bukti capaian pembelajaran, lengkap dengan umpan balik dan rubrik penilaian yang digunakan.",
    driveId: "",
    images: [],
  },
  {
    id: "foto",
    icon: "📸",
    title: "Foto / Video Pembelajaran",
    slug: "fotovideo-pembelajaran",
    note: "Dokumentasi kegiatan di kelas",
    desc:
      "Dokumentasi visual pelaksanaan pembelajaran di kelas: suasana kegiatan, interaksi guru–murid, serta aktivitas diskusi dan praktik peserta didik.",
    driveId: "",
    images: [],
  },
  {
    id: "analisis",
    icon: "📊",
    title: "Analisis Artefak Produk",
    slug: "analisis-artefak-produk",
    note: "Analisis produk pembelajaran",
    desc:
      "Analisis terhadap dokumen dan hasil pembelajaran: kekuatan, kelemahan, serta aspek yang perlu diperbaiki pada siklus berikutnya berdasarkan data dan observasi kelas.",
    driveId: "",
    images: [],
  },
  {
    id: "refleksi",
    icon: "🔍",
    title: "Refleksi Artefak Produk",
    slug: "refleksi-artefak-produk",
    note: "Refleksi proses pembelajaran",
    desc:
      "Refleksi menyeluruh atas perencanaan, pelaksanaan, dan evaluasi pembelajaran pada siklus ini — menjadi dasar perbaikan mutu pembelajaran secara berkelanjutan.",
    driveId: "",
    images: [],
  },
];

const SIKLUS_DATA = {
  "siklus-1": {
    label: "Siklus 1",
    desc:
      "Pada Siklus 1 ini terdapat beberapa artefak produk sebagai bagian dari dokumentasi proses pembelajaran: RPP, media pembelajaran, contoh hasil kerja murid, foto/video kegiatan pembelajaran, analisis produk, serta refleksi terhadap proses pembelajaran. Setiap bagian disusun untuk memberikan gambaran yang utuh mengenai perencanaan, pelaksanaan, hingga evaluasi pembelajaran yang telah dilakukan.",
  },
  "siklus-2": {
    label: "Siklus 2",
    desc:
      "Bagian Siklus 2 memuat dan mengulas berbagai artefak produk sebagai bentuk rekam jejak proses pembelajaran. Ragam instrumen yang ditampilkan meliputi RPP, media instruksional, lembar kerja hasil murid, rekaman visual kegiatan, analisis produk, dan refleksi pembelajaran. Melalui penyajian komparatif ini, diharapkan pembaca dapat melihat benang merah yang kuat antara desain kurikulum dengan realitas pembelajaran serta kompetensi yang berhasil diraih murid.",
  },
  "siklus-3": {
    label: "Siklus 3",
    desc:
      "Siklus 3 menjadi penutup dari rangkaian penyusunan artefak produk pembelajaran. Dokumen pada siklus ini menampilkan hasil perbaikan dari siklus sebelumnya, mulai dari RPP, media pembelajaran, hasil kerja murid, dokumentasi kegiatan, analisis, hingga refleksi akhir — sebagai bukti peningkatan mutu pembelajaran secara berkelanjutan.",
  },
  "siklus-4": {
    label: "Siklus 4",
    desc:
      "Siklus 4 merupakan kelanjutan dari siklus-siklus sebelumnya sebagai wujud perbaikan dan pemantapan mutu pembelajaran. Artefak pada siklus ini memuat RPP hasil peninjauan, media pembelajaran yang telah disempurnakan, contoh hasil kerja murid terbaru, dokumentasi kegiatan, analisis produk, serta refleksi akhir — menegaskan komitmen saya dalam menerapkan pembelajaran yang berpusat pada murid secara berkesinambungan.",
  },
};

/* ---------- Lampiran (modal — tanpa tautan keluar) ---------- */
const LAMPIRAN_ITEMS = [
  {
    id: "perangkat",
    icon: "📋",
    title: "Penilaian Penyusunan Perangkat Pembelajaran",
    note: "Lampiran",
    desc:
      "Dokumen penilaian hasil penyusunan perangkat pembelajaran — skor, catatan pemeriksa, serta umpan balik untuk penyempurnaan RPP dan media pembelajaran.",
    driveId: "",
    images: [],
  },
  {
    id: "praktik",
    icon: "🎤",
    title: "Penilaian Praktik Mengajar",
    note: "Lampiran",
    desc:
      "Hasil penilaian praktik mengajar selama program PPG — rubrik penilaian, skor tiap aspek, serta catatan pembimbing mengenai kinerja di ruang kelas.",
    driveId: "",
    images: [],
  },
  {
    id: "foto",
    icon: "📸",
    title: "Foto / Video Kegiatan",
    note: "Lampiran",
    desc:
      "Dokumentasi visual kegiatan pembelajaran dan praktik lapangan: suasana kelas, interaksi guru–murid, serta rangkaian kegiatan PPG.",
    driveId: "",
    images: [],
  },
];

function renderLampiran() {
  const host = document.getElementById("lampiranGrid");
  if (!host) return;

  LAMPIRAN_ITEMS.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card link-card";
    btn.setAttribute("data-reveal", "");
    const hasDoc = !!getDriveIdFor("lampiran", item);
    btn.innerHTML =
      `<span class="link-card__icon">${item.icon}</span>` +
      `<h3>${item.title}</h3>` +
      `<p>${item.desc}</p>` +
      `<span class="link-card__go">${hasDoc ? "Lihat dokumen" : "Lihat detail"} →</span>`;
    btn.addEventListener("click", () => openDoc(item, "lampiran"));
    host.appendChild(btn);
  });
}

/* ---------- Lembar Kerja 3 — Non-Mengajar (modal — tanpa tautan keluar) ---------- */
const LK3_ITEMS = [
  {
    id: "laporan",
    icon: "📄",
    title: "Laporan Lembar Kerja 3 (Non-Mengajar)",
    note: "Dokumen utama",
    desc:
      "Laporan lengkap kegiatan non-mengajar: identitas peserta didik, latar belakang, tujuan, tahapan pelaksanaan kegiatan non-mengajar, hasil yang dicapai, hingga evaluasi dan tindak lanjut.",
    driveId: "",
    images: [],
  },
  {
    id: "pendukung",
    icon: "📎",
    title: "Dokumen Pendukung",
    note: "Lampiran laporan",
    desc:
      "Dokumen pendukung laporan kegiatan non-mengajar — lembar observasi, jadwal kegiatan, hasil karya, atau berkas pendukung lainnya.",
    driveId: "",
    images: [],
  },
];

function renderLk3() {
  const host = document.getElementById("lk3Grid");
  if (!host) return;

  LK3_ITEMS.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card link-card";
    btn.setAttribute("data-reveal", "");
    const hasDoc = !!getDriveIdFor("lk3", item);
    btn.innerHTML =
      `<span class="link-card__icon">${item.icon}</span>` +
      `<h3>${item.title}</h3>` +
      `<p>${item.desc}</p>` +
      `<span class="link-card__go">${hasDoc ? "Lihat dokumen" : "Lihat detail"} →</span>`;
    btn.addEventListener("click", () => openDoc(item, "lk3"));
    host.appendChild(btn);
  });
}

/* ---------- Render panel tabs artefak ---------- */
function renderArtefak() {
  const host = document.getElementById("tabsPanels");
  if (!host) return;

  Object.entries(SIKLUS_DATA).forEach(([key, data], index) => {
    const panel = document.createElement("div");
    panel.className = "tabs__panel" + (index === 0 ? " active" : "");
    panel.id = key;
    panel.setAttribute("role", "tabpanel");

    const desc = document.createElement("p");
    desc.className = "tabs__desc";
    desc.textContent = data.desc;
    panel.appendChild(desc);

    const grid = document.createElement("div");
    grid.className = "artefak-grid";

    ARTEFAK_ITEMS.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "artefak-item";
      const hasDoc = !!getDriveIdFor("artefak:" + key, item);
      btn.innerHTML =
        `<span class="artefak-item__icon">${item.icon}</span>` +
        `<h4>${item.title}</h4>` +
        `<span>${item.note}</span>` +
        `<span class="artefak-item__cta">${hasDoc ? "Lihat dokumen" : "Lihat detail"} →</span>`;
      btn.addEventListener("click", () => openDoc(item, "artefak:" + key));
      grid.appendChild(btn);
    });

    panel.appendChild(grid);
    host.appendChild(panel);
  });
}

/* ---------- Modal dokumen artefak ---------- */
function openDoc(item, groupKey) {
  const modal = document.getElementById("docModal");
  if (!modal) return;

  let label = "";
  if (groupKey && groupKey.indexOf("artefak:") === 0) {
    const sk = groupKey.split(":")[1];
    if (SIKLUS_DATA[sk]) label = SIKLUS_DATA[sk].label;
  }
  document.getElementById("docIcon").textContent = item.icon;
  document.getElementById("docTitle").textContent = item.title;
  document.getElementById("docSub").textContent =
    label ? `${item.note} · ${label}` : item.note;
  document.getElementById("docDesc").textContent = item.desc || "";

  /* Area dokumen: embed Google Drive bila driveId diisi */
  const driveId = getDriveIdFor(groupKey, item);
  const frame = document.getElementById("docFrame");
  if (driveId) {
    frame.classList.remove("doc-frame--empty");
    frame.innerHTML =
      `<iframe src="https://drive.google.com/file/d/${item.driveId}/preview" ` +
      `title="${item.title}" allow="autoplay" allowfullscreen></iframe>`;
  } else {
    frame.classList.add("doc-frame--empty");
    frame.innerHTML =
      '<div class="doc-empty">' +
      "<span>📂</span>" +
      `<h4>${item.title} — belum ditautkan</h4>` +
      "<p>Unggah dokumen ke <strong>Google Drive</strong> dengan akses " +
      "<em>Anyone with the link</em>, lalu kirimkan linknya. " +
      "Dokumen akan tampil langsung di tempat ini.</p>" +
      "</div>";
  }

  /* Galeri foto (opsional) */
  const gallery = document.getElementById("docGallery");
  gallery.innerHTML =
    (item.images && item.images.length)
      ? item.images
          .map(
            (src) =>
              `<img src="${src}" alt="${item.title}" loading="lazy" ` +
              `onerror="this.onerror=null;this.remove();">`
          )
          .join("")
      : "";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDoc() {
  const modal = document.getElementById("docModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("docFrame").innerHTML = "";
  document.getElementById("docGallery").innerHTML = "";
  document.body.style.overflow = "";
}

function initDocModal() {
  const modal = document.getElementById("docModal");
  if (!modal) return;
  modal.querySelectorAll("[data-close-doc]").forEach((el) =>
    el.addEventListener("click", closeDoc)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDoc();
  });
}

/* ---------- Tab switching ---------- */
function initTabs() {
  const buttons = document.querySelectorAll(".tabs__btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      document.querySelectorAll(".tabs__panel").forEach((p) => {
        p.classList.toggle("active", p.id === btn.dataset.tab);
      });
    });
  });
}

/* ---------- Navbar: shadow saat scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Scroll-spy: highlight menu aktif ---------- */
function initScrollSpy() {
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle(
            "active",
            l.getAttribute("href") === "#" + entry.target.id
          )
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Tema gelap / terang ---------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");

  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.setAttribute("data-theme", "dark");
  }

  toggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

/* ---------- Tombol kembali ke atas ---------- */
function initToTop() {
  const btn = document.getElementById("toTop");
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 500),
    { passive: true }
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ---------- Tahun di footer ---------- */
function initYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* ============================================================
   VIDEO MENGAJAR
   Tambahkan link video di daftar VIDEOS di bawah ini.
   Dukungan: YouTube (watch / youtu.be / shorts) & Google Drive.
   Contoh:
     { title: "Praktik Mengajar Siklus 1", desc: "Materi Algoritma",
       url: "https://youtu.be/XXXXXXXXXXX" }
     { title: "Video dari Drive", desc: "...",
       url: "https://drive.google.com/file/d/FILE_ID/view" }
   ============================================================ */
const VIDEOS = [
  // { title: "", desc: "", url: "" },
];

/* ---------- Ekstrak ID video ---------- */
function getYouTubeId(url) {
  const m =
    url.match(/(?:youtu\.be\/)([\w-]{6,})/) ||
    url.match(/[?&]v=([\w-]{6,})/) ||
    url.match(/shorts\/([\w-]{6,})/) ||
    url.match(/embed\/([\w-]{6,})/);
  return m ? m[1] : null;
}

function getDriveId(url) {
  const m =
    url.match(/\/file\/d\/([\w-]{10,})/) ||
    url.match(/[?&]id=([\w-]{10,})/) ||
    url.match(/\/d\/([\w-]{10,})/);
  return m ? m[1] : null;
}

function getVideoMeta(video) {
  const yt = getYouTubeId(video.url);
  if (yt) {
    return {
      type: "YouTube",
      embed: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`,
      thumb: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
    };
  }
  const drive = getDriveId(video.url);
  if (drive) {
    return {
      type: "Drive",
      embed: `https://drive.google.com/file/d/${drive}/preview`,
      thumb: "assets/img/placeholder-teaching.svg",
    };
  }
  return null;
}

/* ---------- Render kartu video ---------- */
function renderVideos() {
  const grid = document.getElementById("videoGrid");
  const empty = document.getElementById("videoEmpty");
  if (!grid || !empty) return;

  const valid = VIDEOS.filter((v) => getVideoMeta(v));
  empty.hidden = valid.length > 0;
  if (!valid.length) return;

  valid.forEach((video, i) => {
    const meta = getVideoMeta(video);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "video-card card";
    card.setAttribute("data-index", String(i));
    card.innerHTML =
      '<div class="video-card__thumb">' +
      `<img src="${meta.thumb}" alt="${video.title || "Video mengajar"}" loading="lazy" ` +
      `onerror="this.onerror=null;this.src='assets/img/placeholder-teaching.svg';">` +
      `<span class="video-card__badge${meta.type === "Drive" ? " video-card__badge--drive" : ""}">${meta.type}</span>` +
      '<span class="video-card__play"><span>▶</span></span>' +
      "</div>" +
      '<div class="video-card__body">' +
      `<h3>${video.title || "Video Mengajar"}</h3>` +
      `<p>${video.desc || ""}</p>` +
      "</div>";
    card.addEventListener("click", () => openVideo(valid[i]));
    grid.appendChild(card);
  });
}

/* ---------- Modal player ---------- */
function openVideo(video) {
  const meta = getVideoMeta(video);
  if (!meta) return;

  const modal = document.getElementById("videoModal");
  document.getElementById("modalFrame").innerHTML =
    `<iframe src="${meta.embed}" title="${video.title || "Video Mengajar"}" ` +
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
    "allowfullscreen></iframe>";
  document.getElementById("modalTitle").textContent = video.title || "Video Mengajar";
  document.getElementById("modalDesc").textContent = video.desc || "";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("modalFrame").innerHTML = "";
  document.body.style.overflow = "";
}

function initVideoModal() {
  const modal = document.getElementById("videoModal");
  if (!modal) return;
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeVideo)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideo();
  });
}

/* ---------- Data dokumen dari panel admin (data/dokumen.json) ---------- */
const DOC_DRIVES = {};

function parseDriveId(v) {
  if (!v) return "";
  const s = String(v).trim();
  const m =
    s.match(/\/file\/d\/([\w-]{10,})/) ||
    s.match(/[?&]id=([\w-]{10,})/) ||
    s.match(/^([\w-]{20,})$/);
  return m ? m[1] : s;
}

function getDriveIdFor(groupKey, item) {
  const map = DOC_DRIVES[groupKey];
  return parseDriveId((map && map[item.id]) || item.driveId || "");
}

async function loadDokumenData() {
  try {
    const res = await fetch("data/dokumen.json", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (data.artefak) {
      Object.entries(data.artefak).forEach(
        ([k, v]) => (DOC_DRIVES["artefak:" + k] = v || {})
      );
    }
    if (data.lk3) DOC_DRIVES["lk3"] = data.lk3;
    if (data.lampiran) DOC_DRIVES["lampiran"] = data.lampiran;
    if (Array.isArray(data.videos) && data.videos.length) {
      VIDEOS.length = 0;
      data.videos.forEach((v) => VIDEOS.push(v));
    }
  } catch (e) {
    /* file:// atau offline — pakai data default */
  }
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  await loadDokumenData();
  renderArtefak();
  renderLampiran();
  renderLk3();
  initTabs();
  initDocModal();
  renderVideos();
  initVideoModal();
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initReveal();
  initTheme();
  initToTop();
  initYear();
});
