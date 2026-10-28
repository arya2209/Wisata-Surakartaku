// INDEX.HTML
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#19215a" />
    <link rel="manifest" href="manifest.json" />
    <link rel="icon" href="assets/icon-192.png" />
    <link rel="apple-touch-icon" href="assets/icon-192.png" />
    <title>Panduan Wisata Surakarta</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header class="masthead">
      <div class="masthead__inner">
        <h1>Panduan Wisata Surakarta</h1>
        <p>
          Keraton, batik, dan kuliner malam Kota Solo. Buka sekali saat ada
          internet (Wi-Fi hotel, misalnya); setelah itu data dan foto tersimpan
          di perangkat dan bisa dipakai tanpa kuota. Hanya Google Maps yang
          butuh internet.
        </p>
        <span class="net" id="net" role="status"
          ><i></i><span id="nettxt"></span
        ></span>
      </div>
    </header>

    <main>
      <div class="tools">
        <div class="search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle
              cx="11"
              cy="11"
              r="7"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="m20 20-4-4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <input
            type="search"
            id="q"
            placeholder="Cari tempat, misalnya batik atau taman"
            aria-label="Cari tempat"
            autocomplete="off"
          />
        </div>
        <div
          class="chips"
          id="chips"
          role="group"
          aria-label="Filter kategori"
        ></div>
        <div
          class="chips"
          id="aksi"
          role="group"
          aria-label="Filter tambahan"
        ></div>
        <div class="chips" id="rute" role="group" aria-label="Rute sehari">
          <span class="chips__lbl">Rute sehari:</span>
        </div>
        <p class="info" id="info" role="status"></p>
      </div>

      <div class="layout">
        <div class="side">
          <section class="card mapcard" aria-label="Peta wisata">
            <div class="mapscroll" id="mapscroll">
              <svg
                id="map"
                viewBox="0 0 1000 620"
                role="group"
                aria-label="Peta ilustrasi Kota Surakarta"
              >
                <g id="base"></g>
                <g id="pins"></g>
              </svg>
            </div>
            <p class="note">
              Peta ilustrasi, tidak sesuai skala. Posisi tiap tempat dihitung
              dari koordinatnya. Untuk navigasi tanpa internet, salin koordinat
              lalu tempel ke aplikasi peta offline (Google Maps area offline,
              Organic Maps, dll).
            </p>
          </section>
          <aside class="card detail" id="detail" aria-live="polite"></aside>
        </div>

        <section class="listing" aria-labelledby="count">
          <div class="listing__head">
            <h2 class="listing__count" id="count"></h2>
            <button type="button" class="btn btn--sm" id="share" hidden>
              Bagikan daftar
            </button>
          </div>
          <ul class="list" id="list"></ul>
        </section>
      </div>
    </main>

    <footer class="foot">
      Jam buka dan harga bisa berubah. Status "Buka sekarang" hanyalah perkiraan
      dari jam buka (WIB). Cek kembali sebelum berkunjung.
    </footer>

    <script src="data.js"></script>

    <script src="app.js"></script>
  </body>
</html>




//STYLE.CSS
:root {
  --bg: #eef0f4;
  --sf: #fff;
  --sf2: #f5f6fa;
  --ink: #1b2233;
  --mut: #5b6478;
  --ln: #dbe0e9;
  --ind: #1f2a6b;
  --ind-ink: #fff;
  --gold: #a9772f;
  --hdr: #19215a;
  --map: #e8ecf1;
  --river: #c3d6e8;
  --road: #fff;
  --park: #2f7d4f;
  --ok: #1d7a46;
  --serif: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --shadow:
    0 1px 2px rgba(20, 28, 60, 0.06), 0 14px 30px -18px rgba(20, 28, 60, 0.28);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f121a;
    --sf: #171c2a;
    --sf2: #1d2335;
    --ink: #e8ebf2;
    --mut: #9aa3b8;
    --ln: #2a3147;
    --ind: #9aabff;
    --ind-ink: #0f121a;
    --gold: #d9a766;
    --hdr: #131a45;
    --map: #141a29;
    --river: #21374f;
    --road: #2b3348;
    --park: #4fae79;
    --ok: #5fd08e;
    --shadow:
      0 1px 2px rgba(0, 0, 0, 0.3), 0 14px 30px -18px rgba(0, 0, 0, 0.6);
  }
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
}
body {
  background: var(--bg);
  color: var(--ink);
  font: 15px/1.55 var(--sans);
  padding-bottom: env(safe-area-inset-bottom);
  -webkit-text-size-adjust: 100%;
}
:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}
.masthead {
  padding: calc(34px + env(safe-area-inset-top)) 20px 38px;
  color: #fff;
  background-color: var(--hdr);
  background-image:
    linear-gradient(95deg, var(--hdr) 18%, rgba(0, 0, 0, 0) 85%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cg fill='none' stroke='%23fff' stroke-opacity='.13' stroke-width='1.2'%3E%3Cellipse cx='32' cy='16' rx='7' ry='15'/%3E%3Cellipse cx='32' cy='48' rx='7' ry='15'/%3E%3Cellipse cx='16' cy='32' rx='15' ry='7'/%3E%3Cellipse cx='48' cy='32' rx='15' ry='7'/%3E%3C/g%3E%3Ccircle cx='32' cy='32' r='2.2' fill='%23d9a766' fill-opacity='.6'/%3E%3C/svg%3E");
  background-size:
    auto,
    64px 64px;
  border-bottom: 3px solid var(--gold);
}
.masthead__inner {
  max-width: 1100px;
  margin: 0 auto;
}
.masthead h1 {
  margin: 0;
  max-width: 16ch;
  font: 700 clamp(30px, 6vw, 48px)/1.08 var(--serif);
  letter-spacing: -0.01em;
  text-wrap: balance;
}
.masthead p {
  margin: 12px 0 0;
  max-width: 56ch;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
}
.net {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 13px;
}
.net i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7bdca0;
}
.net[data-s="off"] i {
  background: #f0a35e;
}
main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 22px 16px 8px;
}
.tools {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}
.search {
  position: relative;
  max-width: 420px;
}
.search svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--mut);
  pointer-events: none;
}
.search input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid var(--ln);
  border-radius: 12px;
  background: var(--sf);
  color: var(--ink);
  font: inherit;
}
.search input::placeholder {
  color: var(--mut);
}
.search input:hover {
  border-color: var(--mut);
}
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 6px;
  scrollbar-width: thin;
  align-items: center;
}
.chips__lbl {
  flex: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--mut);
}
.chip {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--ln);
  border-radius: 99px;
  background: var(--sf);
  color: var(--ink);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}
.chip:hover {
  border-color: var(--ind);
}
.chip__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--c, var(--mut));
}
.chip__n {
  color: var(--mut);
  font-variant-numeric: tabular-nums;
}
.chip[aria-pressed="true"] {
  background: var(--ind);
  border-color: var(--ind);
  color: var(--ind-ink);
}
.chip[aria-pressed="true"] .chip__n {
  color: inherit;
  opacity: 0.75;
}
.chip[aria-pressed="true"] .chip__dot {
  box-shadow: 0 0 0 2px var(--ind-ink);
}
.info {
  margin: 0;
  min-height: 1.2em;
  font-size: 13px;
  color: var(--mut);
}
.layout {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "map" "detail" "list";
}
.side {
  display: contents;
}
.mapcard {
  grid-area: map;
}
.detail {
  grid-area: detail;
  scroll-margin-top: 12px;
}
.listing {
  grid-area: list;
}
@media (min-width: 900px) {
  .layout {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    grid-template-areas: "list side";
    align-items: start;
  }
  .side {
    grid-area: side;
    display: grid;
    gap: 18px;
    position: sticky;
    top: 16px;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    padding: 2px;
  }
  .mapcard,
  .detail {
    grid-area: auto;
  }
}
@media (max-width: 899px) {
  .detail[data-empty] {
    display: none;
  }
}
.card {
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 16px;
  box-shadow: var(--shadow);
}
.mapcard {
  padding: 10px;
}
.mapscroll {
  overflow-x: auto;
  border-radius: 10px;
}
#map {
  display: block;
  width: 100%;
  height: auto;
  background: var(--map);
  border-radius: 10px;
}
@media (max-width: 700px) {
  #map {
    min-width: 680px;
  }
}
.note {
  margin: 10px 6px 4px;
  font-size: 12.5px;
  color: var(--mut);
}
.m-grid {
  fill: none;
  stroke: var(--ln);
  stroke-opacity: 0.55;
  stroke-width: 1;
}
.m-park {
  fill: var(--park);
  fill-opacity: 0.16;
}
.m-river {
  fill: none;
  stroke: var(--river);
  stroke-width: 26;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.m-main {
  fill: none;
  stroke: var(--road);
  stroke-width: 9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.m-road {
  fill: none;
  stroke: var(--road);
  stroke-width: 5;
  stroke-linecap: round;
}
.m-kraton {
  fill: none;
  stroke: var(--gold);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}
.m-rute {
  fill: none;
  stroke: var(--gold);
  stroke-width: 4;
  stroke-dasharray: 3 9;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}
.m-label {
  fill: var(--mut);
  font: italic 15px var(--sans);
}
.m-compass {
  fill: var(--ink);
  fill-opacity: 0.55;
}
.m-compass-t {
  fill: var(--ink);
  font: 600 12px var(--sans);
  text-anchor: middle;
}
.pin {
  cursor: pointer;
  outline: none;
}
.pin__body {
  transform-origin: 0 0;
  transform: scale(1.3);
  transition: transform 0.15s ease;
}
.pin__shape {
  fill: var(--c);
  stroke: var(--sf);
  stroke-width: 2;
  stroke-linejoin: round;
}
.pin__dot {
  fill: #fff;
}
.pin:hover .pin__body,
.pin:focus-visible .pin__body {
  transform: scale(1.5);
}
.pin.is-selected .pin__body {
  transform: scale(1.8);
}
.pin:focus-visible .pin__shape {
  stroke: var(--gold);
  stroke-width: 3;
}
.pin.is-dim {
  opacity: 0.14;
  pointer-events: none;
}
.pin__label {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.pin:hover .pin__label,
.pin:focus-visible .pin__label,
.pin.is-selected .pin__label {
  opacity: 1;
}
.pin__pill {
  fill: var(--sf);
  stroke: var(--c);
  stroke-width: 1.5;
}
.pin__text {
  fill: var(--ink);
  font: 600 17px var(--sans);
}
.foto {
  display: block;
  object-fit: cover;
  background: var(--sf2);
}
.foto--thumb {
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: 10px;
}
.foto--hero {
  width: 100%;
  height: 300px;
}
.listing__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 0 0 10px;
}
.listing__count {
  margin: 0;
  font: 600 14px var(--sans);
  color: var(--mut);
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  padding: 10px 14px 10px 10px;
  border: 1px solid var(--ln);
  border-left: 5px solid var(--c);
  border-radius: 12px;
  background: var(--sf);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition:
    background 0.15s,
    box-shadow 0.15s;
}
.item:hover {
  background: var(--sf2);
}
.item[aria-current="true"] {
  background: var(--sf2);
  box-shadow: 0 0 0 1.5px var(--c) inset;
}
.item__txt {
  min-width: 0;
}
.item b {
  display: block;
  font-weight: 600;
}
.item small {
  display: block;
  margin-top: 1px;
  color: var(--mut);
  font-size: 13px;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--mut);
}
.st {
  padding: 1px 8px;
  border-radius: 99px;
  border: 1px solid var(--ln);
  font-weight: 600;
}
.st--on {
  color: var(--ok);
  border-color: var(--ok);
}
.fav {
  color: var(--gold);
  font-weight: 700;
}
.empty {
  padding: 28px 20px;
  text-align: center;
  color: var(--mut);
  border: 1px dashed var(--ln);
  border-radius: 12px;
}
.empty button {
  display: block;
  margin: 12px auto 0;
  padding: 8px 16px;
  border: 1px solid var(--ind);
  border-radius: 99px;
  background: transparent;
  color: var(--ind);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}
.empty button:hover {
  background: var(--ind);
  color: var(--ind-ink);
}
.detail {
  position: relative;
  overflow: hidden;
}
.detail__bar {
  height: 6px;
  background: var(--c);
}
.detail__body {
  padding: 20px 22px 24px;
}
.detail__close {
  position: absolute;
  top: 16px;
  right: 14px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border: 1px solid var(--ln);
  border-radius: 50%;
  background: var(--sf);
  color: var(--mut);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.detail__close:hover {
  color: var(--ink);
  border-color: var(--mut);
}
.tag {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 99px;
  background: var(--c);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.detail .st {
  margin-left: 6px;
  font-size: 13px;
}
.detail h2 {
  margin: 12px 0 8px;
  padding-right: 36px;
  font: 700 26px/1.18 var(--serif);
  text-wrap: balance;
}
.detail__desc {
  margin: 0;
  max-width: 60ch;
  font-family: var(--serif);
  font-size: 16px;
  line-height: 1.7;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
.actions:first-of-type {
  margin-top: 18px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--ind);
  border-radius: 99px;
  background: transparent;
  color: var(--ind);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
.btn:hover:not(:disabled) {
  background: var(--ind);
  color: var(--ind-ink);
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn--main,
.btn[aria-pressed="true"] {
  background: var(--ind);
  color: var(--ind-ink);
}
.btn--main:hover {
  opacity: 0.88;
}
.btn svg {
  flex: none;
}
.btn--sm {
  padding: 6px 12px;
  font-size: 13px;
}
.embed {
  margin-top: 14px;
}
.embed iframe {
  display: block;
  width: 100%;
  height: 260px;
  border: 1px solid var(--ln);
  border-radius: 12px;
  background: var(--sf2);
}
.embed p {
  margin: 6px 2px 0;
  font-size: 12.5px;
  color: var(--mut);
}
.facts {
  margin: 18px 0 0;
  display: grid;
  grid-template-columns: 7.5rem 1fr;
  font-size: 14.5px;
}
.facts dt,
.facts dd {
  padding: 10px 0;
  border-top: 1px solid var(--ln);
}
.facts dt {
  color: var(--mut);
}
.facts dd {
  margin: 0;
}
.tip {
  margin-top: 6px;
  padding: 12px 14px;
  border-left: 3px solid var(--gold);
  border-radius: 0 10px 10px 0;
  background: var(--sf2);
  font-size: 14.5px;
}
.tip strong {
  display: block;
  margin-bottom: 2px;
}
.detail__empty {
  padding: 40px 28px;
  text-align: center;
  color: var(--mut);
}
.detail__empty svg {
  display: block;
  margin: 0 auto 14px;
  color: var(--gold);
}
.detail__empty p {
  margin: 0 auto;
  max-width: 30ch;
}
.foot {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px 16px 34px;
  color: var(--mut);
  font-size: 13px;
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
/* Filter kategori responsif */
.filter-kategori,
.filter-buttons,
.route-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Tampilan HP */
@media (max-width: 576px) {
  .filter-kategori,
  .filter-buttons,
  .route-buttons {
    gap: 6px;
  }

  .filter-kategori button,
  .filter-buttons button,
  .route-buttons button {
    max-width: 100%;
    white-space: normal;
    font-size: 13px;
    padding: 8px 12px;
  }
}



//APP.JS
(function () {
  "use strict";
  const DB = window.DB;
  const KAT = Object.fromEntries(DB.kategori.map((k) => [k.id, k]));
  const state = {
    kategori: "semua",
    kata: "",
    pilih: null,
    rute: null,
    buka: false,
    fav: false,
    pos: null,
  };
  const $ = (id) => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 899px)");

  function svg(name, attrs, text) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }
  function html(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- Status jaringan & PWA ---------- */
  let siapOffline = false;
  function segarkanNet() {
    const on = navigator.onLine;
    $("net").dataset.s = on ? "on" : "off";
    $("nettxt").textContent = on
      ? siapOffline
        ? "Online. Panduan sudah tersimpan untuk dipakai offline"
        : "Online"
      : "Offline. Data dan foto tetap bisa dibuka";
  }
  addEventListener("online", () => {
    segarkanNet();
    if (state.pilih != null) gambarDetail();
  });
  addEventListener("offline", () => {
    segarkanNet();
    if (state.pilih != null) gambarDetail();
  });
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.ready.then(() => {
      siapOffline = true;
      segarkanNet();
    });

  /* ---------- Favorit (localStorage, aman jika diblokir) ---------- */
  const FK = "solo-favorit";
  let favs = new Set();
  try {
    favs = new Set(JSON.parse(localStorage.getItem(FK) || "[]"));
  } catch (e) { }
  function simpanFav() {
    try {
      localStorage.setItem(FK, JSON.stringify([...favs]));
    } catch (e) { }
  }

  /* ---------- Google Maps ---------- */
  const kueri = (t) => t.gmaps || t.nama + ", Surakarta";
  const mapsCari = (t) =>
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(kueri(t));
  const mapsRute = (t) =>
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(kueri(t));
  const mapsEmbed = (t) =>
    "https://maps.google.com/maps?hl=id&z=16&output=embed&q=" +
    encodeURIComponent(kueri(t));

  /* ---------- Foto: coba ekstensi lain sebelum menyerah ---------- */
  const EXT = ["webp", "jpg", "jpeg", "png"];
  function buatFoto(t, cls) {
    const img = document.createElement("img");
    img.className = "foto " + cls;
    const dasar = t.foto.replace(/\.\w+$/, "");
    const antrean = EXT.map((e) => dasar + "." + e).filter(
      (s) => s !== t.foto,
    );
    img.src = t.foto;
    img.alt = t.nama;
    img.loading = "lazy";
    img.onerror = () => {
      const next = antrean.shift();
      if (next) {
        img.src = next;
        return;
      }
      img.onerror = null;
      img.src =
        "data:image/svg+xml," +
        encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' width='4' height='3'><rect width='4' height='3' fill='" +
          KAT[t.kategori].warna +
          "'/></svg>",
        );
    };
    return img;
  }

  /* ---------- Salin ke papan klip ---------- */
  function salin(teks, btn) {
    const awal = btn.textContent;
    const selesai = (ok) => {
      btn.textContent = ok ? "Tersalin" : "Gagal menyalin";
      setTimeout(() => (btn.textContent = awal), 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(teks).then(
        () => selesai(true),
        () => selesai(false),
      );
      return;
    }
    const ta = html("textarea");
    ta.value = teks;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) { }
    ta.remove();
    selesai(ok);
  }

  /* ---------- Jam buka (WIB) ---------- */
  const HARI = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  function sekarang() {
    const p = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    return {
      h: HARI[g("weekday")],
      m: (+g("hour") % 24) * 60 + +g("minute"),
    };
  }
  const mnt = (s) => {
    const [a, b] = s.split(":");
    return +a * 60 + +b;
  };
  function statusBuka(t) {
    const j = DB.jadwal[t.id];
    if (!j) return null;
    const n = sekarang();
    if ((j.d && !j.d.includes(n.h)) || (j.x && j.x.includes(n.h)))
      return false;
    const a = mnt(j.a),
      b = mnt(j.b);
    return a <= b ? n.m >= a && n.m < b : n.m >= a || n.m < b;
  }

  /* ---------- Jarak ---------- */
  function jarak(a, b) {
    const r = Math.PI / 180,
      dLa = (b.lat - a.lat) * r,
      dLo = (b.lon - a.lon) * r;
    const x =
      Math.sin(dLa / 2) ** 2 +
      Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(x));
  }
  const fmtKm = (k) =>
    k < 1
      ? "± " + Math.round(k * 1000) + " m"
      : "± " + k.toFixed(1).replace(".", ",") + " km";

  /* ---------- Proyeksi koordinat ke kanvas 1000 x 620 ---------- */
  const lats = DB.tempat.map((t) => t.lat),
    lons = DB.tempat.map((t) => t.lon);
  const L = {
    a: Math.min(...lats) - 0.004,
    b: Math.max(...lats) + 0.004,
    c: Math.min(...lons) - 0.008,
    d: Math.max(...lons) + 0.008,
  };
  const px = (lon) => ((lon - L.c) / (L.d - L.c)) * 900 + 50;
  const py = (lat) => ((L.b - lat) / (L.b - L.a)) * 520 + 50;
  const pts = (list) =>
    list
      .map(([lon, lat]) => `${px(lon).toFixed(1)},${py(lat).toFixed(1)}`)
      .join(" ");

  /* ---------- Filter ---------- */
  const ruteAktif = () => DB.rute.find((r) => r.id === state.rute);
  function cocok(t, kategori = state.kategori) {
    if (kategori !== "semua" && t.kategori !== kategori) return false;
    const r = ruteAktif();
    if (r && !r.ids.includes(t.id)) return false;
    if (state.fav && !favs.has(t.id)) return false;
    if (state.buka && statusBuka(t) !== true) return false;
    const teks = (
      t.nama +
      " " +
      t.deskripsi +
      " " +
      t.alamat +
      " " +
      KAT[t.kategori].nama
    ).toLowerCase();
    return !state.kata || teks.includes(state.kata);
  }
  function daftarTampil() {
    const h = DB.tempat.filter((t) => cocok(t));
    const r = ruteAktif();
    if (r) h.sort((a, b) => r.ids.indexOf(a.id) - r.ids.indexOf(b.id));
    else if (state.pos)
      h.sort((a, b) => jarak(state.pos, a) - jarak(state.pos, b));
    return h;
  }

  /* ---------- Peta (bagian tetap) ---------- */
  function gambarDasar() {
    const g = $("base");
    const defs = svg("defs");
    const pat = svg("pattern", {
      id: "grid",
      width: 50,
      height: 50,
      patternUnits: "userSpaceOnUse",
    });
    pat.appendChild(svg("path", { d: "M50 0H0V50", class: "m-grid" }));
    defs.appendChild(pat);
    g.append(
      defs,
      svg("rect", { width: 1000, height: 620, fill: "url(#grid)" }),
    );
    [
      [-7.556, 110.812, 70, 40],
      [-7.5688, 110.811, 40, 28],
      [-7.57, 110.859, 55, 40],
    ].forEach(([la, lo, w, h]) =>
      g.appendChild(
        svg("ellipse", {
          class: "m-park",
          cx: px(lo),
          cy: py(la),
          rx: w,
          ry: h,
        }),
      ),
    );
    g.appendChild(
      svg("polyline", {
        class: "m-river",
        points: pts([
          [110.846, -7.5515],
          [110.851, -7.56],
          [110.8565, -7.566],
          [110.853, -7.573],
          [110.858, -7.583],
        ]),
      }),
    );
    g.appendChild(
      svg(
        "text",
        { class: "m-label", x: px(110.8565) + 20, y: py(-7.5665) },
        "Bengawan Solo",
      ),
    );
    [
      [
        [110.8276, -7.556],
        [110.8276, -7.58],
      ],
      [
        [110.8312, -7.57],
        [110.859, -7.569],
      ],
      [
        [110.815, -7.556],
        [110.829, -7.579],
      ],
    ].forEach((j) =>
      g.appendChild(svg("polyline", { class: "m-road", points: pts(j) })),
    );
    g.appendChild(
      svg("polyline", {
        class: "m-main",
        points: pts([
          [110.79, -7.5655],
          [110.81, -7.5675],
          [110.823, -7.569],
          [110.8276, -7.571],
          [110.832, -7.5712],
        ]),
      }),
    );
    g.appendChild(
      svg(
        "text",
        { class: "m-label", x: px(110.8), y: py(-7.5665) - 12 },
        "Jl. Slamet Riyadi",
      ),
    );
    g.appendChild(
      svg("rect", {
        class: "m-kraton",
        x: px(110.8283) - 34,
        y: py(-7.5782) - 28,
        width: 68,
        height: 56,
        rx: 6,
      }),
    );
    const k = svg("g", { transform: "translate(940,60)" });
    k.append(
      svg("path", { class: "m-compass", d: "M0-22 L7 0 L0 22 L-7 0Z" }),
      svg("text", { class: "m-compass-t", y: -27 }, "U"),
    );
    g.appendChild(k);
  }

  /* ---------- Peta (pin + garis rute) ---------- */
  const PIN =
    "M0 0C-2.5-5-10-10.5-10-17.5A10 10 0 1 1 10-17.5C10-10.5 2.5-5 0 0Z";
  function gambarPin() {
    const g = $("pins");
    const fokus =
      document.activeElement &&
      document.activeElement.closest &&
      document.activeElement.closest(".pin");
    const fokusId = fokus ? fokus.dataset.id : null;
    g.replaceChildren();

    const r = ruteAktif();
    if (r)
      g.appendChild(
        svg("polyline", {
          class: "m-rute",
          points: pts(
            r.ids.map((id) => {
              const t = DB.tempat.find((x) => x.id === id);
              return [t.lon, t.lat];
            }),
          ),
        }),
      );

    const urut = [...DB.tempat].sort(
      (a, b) => (a.id === state.pilih) - (b.id === state.pilih),
    );
    const pasang = [];
    urut.forEach((t) => {
      const sel = t.id === state.pilih,
        x = px(t.lon),
        y = py(t.lat);
      const p = svg("g", {
        class:
          "pin" +
          (sel ? " is-selected" : "") +
          (cocok(t) ? "" : " is-dim"),
        transform: `translate(${x.toFixed(1)},${y.toFixed(1)})`,
        tabindex: 0,
        role: "button",
        "aria-label": t.nama,
        "aria-pressed": sel,
        "data-id": t.id,
      });
      p.style.setProperty("--c", KAT[t.kategori].warna);
      const body = svg("g", { class: "pin__body" });
      body.append(
        svg("title", {}, t.nama),
        svg("path", { class: "pin__shape", d: PIN }),
        svg("circle", { class: "pin__dot", cy: -17.5, r: 3.6 }),
      );
      p.appendChild(body);
      const kiri = x > 720;
      const label = svg("g", { class: "pin__label" });
      const pill = svg("rect", { class: "pin__pill" });
      const teks = svg(
        "text",
        {
          class: "pin__text",
          x: kiri ? -30 : 30,
          y: sel ? -26 : -22,
          "text-anchor": kiri ? "end" : "start",
        },
        t.nama,
      );
      label.append(pill, teks);
      p.appendChild(label);
      p.addEventListener("click", () => buka(t.id, true));
      p.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          buka(t.id, true);
        }
      });
      g.appendChild(p);
      pasang.push([pill, teks]);
    });
    pasang.forEach(([pill, teks]) => {
      const b = teks.getBBox();
      pill.setAttribute("x", b.x - 10);
      pill.setAttribute("y", b.y - 4);
      pill.setAttribute("width", b.width + 20);
      pill.setAttribute("height", b.height + 8);
      pill.setAttribute("rx", (b.height + 8) / 2);
    });
    if (fokusId) {
      const lagi = g.querySelector(`.pin[data-id="${fokusId}"]`);
      if (lagi) lagi.focus({ preventScroll: true });
    }
  }

  /* ---------- Chip: kategori, filter tambahan, rute ---------- */
  let bBuka, bDekat, bFav;
  const ruteBtn = [];
  function chip(parent, label, fn) {
    const b = html("button", "chip");
    b.type = "button";
    b.append(html("span", null, label));
    b.addEventListener("click", fn);
    parent.appendChild(b);
    return b;
  }
  function buatChips() {
    const w = $("chips");
    [{ id: "semua", nama: "Semua", warna: null }, ...DB.kategori].forEach(
      (k) => {
        const b = html("button", "chip");
        b.type = "button";
        b.dataset.id = k.id;
        if (k.warna) b.style.setProperty("--c", k.warna);
        b.append(
          html("span", "chip__dot"),
          html("span", "chip__nama", k.nama),
          html("span", "chip__n"),
        );
        b.addEventListener("click", () => {
          state.kategori = k.id;
          state.rute = null;
          segarkan();
        });
        w.appendChild(b);
      },
    );
    bBuka = chip($("aksi"), "Buka sekarang", () => {
      state.buka = !state.buka;
      segarkan();
    });
    bDekat = chip($("aksi"), "Urutkan terdekat", toggleDekat);
    bFav = chip($("aksi"), "Favorit", () => {
      state.fav = !state.fav;
      segarkan();
    });
    DB.rute.forEach((r) =>
      ruteBtn.push([
        r.id,
        chip($("rute"), r.nama, () => {
          state.rute = state.rute === r.id ? null : r.id;
          if (state.rute) state.kategori = "semua";
          segarkan();
        }),
      ]),
    );
  }
  function segarkanChips() {
    $("chips")
      .querySelectorAll(".chip")
      .forEach((b) => {
        const id = b.dataset.id;
        b.setAttribute("aria-pressed", state.kategori === id);
        b.querySelector(".chip__n").textContent = DB.tempat.filter((t) =>
          cocok(t, id),
        ).length;
      });
    bBuka.setAttribute("aria-pressed", state.buka);
    bDekat.setAttribute("aria-pressed", !!state.pos);
    bFav.setAttribute("aria-pressed", state.fav);
    bFav.firstChild.textContent = "Favorit (" + favs.size + ")";
    ruteBtn.forEach(([id, b]) =>
      b.setAttribute("aria-pressed", state.rute === id),
    );
  }

  /* ---------- Lokasi pengguna (GPS bekerja tanpa internet) ---------- */
  function toggleDekat() {
    if (state.pos) {
      state.pos = null;
      segarkan();
      return;
    }
    if (!navigator.geolocation) {
      $("info").textContent = "Peramban ini tidak mendukung lokasi.";
      return;
    }
    $("info").textContent = "Mencari lokasi Anda...";
    navigator.geolocation.getCurrentPosition(
      (p) => {
        state.pos = { lat: p.coords.latitude, lon: p.coords.longitude };
        state.rute = null;
        segarkan();
      },
      () => {
        $("info").textContent =
          "Lokasi tidak tersedia. Izinkan akses lokasi di peramban, lalu coba lagi.";
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }

  /* ---------- Daftar ---------- */
  function badgeStatus(t) {
    const s = statusBuka(t);
    if (s === null) return null;
    return html(
      "span",
      "st" + (s ? " st--on" : ""),
      s ? "Buka sekarang" : "Tutup",
    );
  }
  function gambarDaftar() {
    const ul = $("list");
    ul.replaceChildren();
    const hasil = daftarTampil();
    const r = ruteAktif();
    $("count").textContent =
      (r ? "Rute: " + r.nama + ", " : "") + hasil.length + " tempat";
    const bagikan = $("share");
    bagikan.hidden = !(state.fav && favs.size);

    if (!hasil.length) {
      const li = html(
        "li",
        "empty",
        state.fav && !favs.size
          ? "Belum ada favorit. Buka sebuah tempat lalu pilih Simpan ke favorit."
          : "Tidak ada tempat yang cocok dengan pencarian ini.",
      );
      const reset = html("button", null, "Hapus filter");
      reset.type = "button";
      reset.addEventListener("click", () => {
        Object.assign(state, {
          kategori: "semua",
          kata: "",
          rute: null,
          buka: false,
          fav: false,
        });
        $("q").value = "";
        segarkan();
      });
      li.appendChild(reset);
      ul.appendChild(li);
      return;
    }
    hasil.forEach((t) => {
      const li = html("li");
      const b = html("button", "item");
      b.type = "button";
      b.dataset.id = t.id;
      b.style.setProperty("--c", KAT[t.kategori].warna);
      const txt = html("span", "item__txt");
      const nomor = r ? r.ids.indexOf(t.id) + 1 + ". " : "";
      const meta = html("span", "meta");
      const st = badgeStatus(t);
      if (st) meta.appendChild(st);
      if (state.pos)
        meta.appendChild(html("span", null, fmtKm(jarak(state.pos, t))));
      if (favs.has(t.id))
        meta.appendChild(html("span", "fav", "★ Favorit"));
      txt.append(
        html("b", null, nomor + t.nama),
        html("small", null, KAT[t.kategori].nama + ", " + t.alamat),
        meta,
      );
      b.append(buatFoto(t, "foto--thumb"), txt);
      b.addEventListener("click", () => buka(t.id, false));
      li.appendChild(b);
      ul.appendChild(li);
    });
    tandaiDaftar();
  }
  function tandaiDaftar() {
    $("list")
      .querySelectorAll(".item")
      .forEach((b) => {
        if (Number(b.dataset.id) === state.pilih)
          b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
  }
  $("share").addEventListener("click", (e) => {
    const d = DB.tempat.filter((t) => favs.has(t.id));
    const teks =
      "Daftar kunjungan Solo:\n" +
      d
        .map(
          (t, i) =>
            i + 1 + ". " + t.nama + " (" + t.alamat + ") " + mapsCari(t),
        )
        .join("\n");
    if (navigator.share)
      navigator
        .share({ title: "Daftar kunjungan Solo", text: teks })
        .catch(() => { });
    else salin(teks, e.currentTarget);
  });

  /* ---------- Detail ---------- */
  const IKON_PIN =
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/></svg>';
  const IKON_RUTE =
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12h14m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function tautan(href, cls, ikon, label) {
    const a = html("a", "btn " + cls);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = ikon;
    a.append(label);
    return a;
  }
  function tombol(label, fn) {
    const b = html("button", "btn", label);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  }

  function buatAksi(t) {
    const wrap = html("div");
    const row = html("div", "actions");
    const row2 = html("div", "actions");
    const embed = html("div", "embed");
    embed.hidden = true;

    const toggle = tombol("Tampilkan peta Google", () => {
      const buka = embed.hidden;
      embed.hidden = !buka;
      toggle.setAttribute("aria-expanded", buka);
      toggle.textContent = buka
        ? "Sembunyikan peta Google"
        : "Tampilkan peta Google";
      if (buka && !embed.firstChild) {
        const f = html("iframe");
        f.title = "Google Maps: " + t.nama;
        f.loading = "lazy";
        f.referrerPolicy = "no-referrer-when-downgrade";
        f.allowFullscreen = true;
        f.src = mapsEmbed(t);
        embed.append(
          f,
          html(
            "p",
            null,
            "Perlu koneksi internet. Jika kosong, gunakan tombol Buka di Google Maps.",
          ),
        );
      }
    });
    toggle.setAttribute("aria-expanded", "false");
    if (!navigator.onLine) {
      toggle.disabled = true;
      toggle.textContent = "Peta Google butuh internet";
    }

    const fb = tombol("", () => {
      favs.has(t.id) ? favs.delete(t.id) : favs.add(t.id);
      simpanFav();
      updFav();
      segarkanChips();
      gambarDaftar();
    });
    const updFav = () => {
      const s = favs.has(t.id);
      fb.setAttribute("aria-pressed", s);
      fb.textContent = s ? "★ Tersimpan" : "☆ Simpan ke favorit";
    };
    updFav();

    const koord = t.lat.toFixed(5) + ", " + t.lon.toFixed(5);
    const kb = tombol("Salin koordinat", () => salin(koord, kb));
    const ab = tombol("Salin alamat", () =>
      salin(t.nama + ", " + t.alamat + ", Surakarta", ab),
    );

    row.append(
      tautan(mapsCari(t), "btn--main", IKON_PIN, "Buka di Google Maps"),
      tautan(mapsRute(t), "", IKON_RUTE, "Petunjuk arah"),
      toggle,
    );
    row2.append(fb, kb, ab);
    wrap.append(row, row2, embed);
    return wrap;
  }

  function gambarDetail() {
    const d = $("detail");
    const t = DB.tempat.find((x) => x.id === state.pilih);
    d.replaceChildren();
    if (!t) {
      d.dataset.empty = "";
      d.style.removeProperty("--c");
      const e = html("div", "detail__empty");
      e.innerHTML =
        '<svg viewBox="0 0 24 34" width="30" height="42" aria-hidden="true"><path d="M12 33C10 27 1 21 1 12a11 11 0 1 1 22 0c0 9-9 15-11 21z" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>';
      e.appendChild(
        html(
          "p",
          null,
          "Pilih pin di peta atau tempat di daftar untuk melihat foto, jam buka, tiket, dan tips kunjungan.",
        ),
      );
      d.appendChild(e);
      return;
    }
    delete d.dataset.empty;
    const k = KAT[t.kategori];
    d.style.setProperty("--c", k.warna);
    const close = html("button", "detail__close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Tutup detail");
    close.addEventListener("click", tutup);

    const body = html("div", "detail__body");
    const dl = html("dl", "facts");
    [
      ["Alamat", t.alamat],
      ["Jam buka", t.jam],
      ["Tiket / harga", t.tiket],
      ["Koordinat", t.lat.toFixed(4) + ", " + t.lon.toFixed(4)],
    ].forEach(([a, b]) =>
      dl.append(html("dt", null, a), html("dd", null, b)),
    );
    if (state.pos)
      dl.append(
        html("dt", null, "Jarak"),
        html(
          "dd",
          null,
          fmtKm(jarak(state.pos, t)) + " dari lokasi Anda",
        ),
      );

    const tip = html("div", "tip");
    tip.append(
      html("strong", null, "Tips kunjungan"),
      document.createTextNode(t.tips),
    );

    const tagRow = html("div");
    tagRow.appendChild(html("span", "tag", k.nama));
    const st = badgeStatus(t);
    if (st) tagRow.appendChild(st);

    body.append(
      tagRow,
      html("h2", null, t.nama),
      html("p", "detail__desc", t.deskripsi),
      buatAksi(t),
      dl,
      tip,
    );
    d.append(
      html("div", "detail__bar"),
      close,
      buatFoto(t, "foto--hero"),
      body,
    );
  }

  /* ---------- Interaksi ---------- */
  function buka(id, dariPeta) {
    state.pilih = id;
    gambarPin();
    tandaiDaftar();
    gambarDetail();
    if (!dariPeta) {
      const box = $("mapscroll");
      const t = DB.tempat.find((x) => x.id === id);
      if (box.scrollWidth > box.clientWidth) {
        const lebar = $("map").getBoundingClientRect().width;
        box.scrollTo({
          left: (px(t.lon) / 1000) * lebar - box.clientWidth / 2,
          behavior: reduced.matches ? "auto" : "smooth",
        });
      }
    }
    if (mobile.matches)
      $("detail").scrollIntoView({
        behavior: reduced.matches ? "auto" : "smooth",
        block: "start",
      });
  }
  function tutup() {
    state.pilih = null;
    gambarPin();
    tandaiDaftar();
    gambarDetail();
  }
  function segarkan() {
    const r = ruteAktif();
    $("info").textContent = r ? r.ket : "";
    segarkanChips();
    gambarPin();
    gambarDaftar();
    gambarDetail();
  }

  $("q").addEventListener("input", (e) => {
    state.kata = e.target.value.trim().toLowerCase();
    segarkan();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.pilih != null) tutup();
  });

  buatChips();
  gambarDasar();
  segarkanNet();
  segarkan();

  if (
    "serviceWorker" in navigator &&
    /^https?:$/.test(location.protocol)
  ) {
    navigator.serviceWorker.register("sw.js").catch(() => { });
  }
})();



//DATA.JS
window.DB = {
    kategori: [
        { id: "budaya", nama: "Budaya & Sejarah", warna: "#8a4b2a" },
        { id: "kuliner", nama: "Kuliner", warna: "#c2410c" },
        { id: "alam", nama: "Alam & Taman", warna: "#2f7d4f" },
        { id: "belanja", nama: "Belanja & Batik", warna: "#6d3fa0" },
    ],
    /* Jadwal terstruktur. a/b = jam buka/tutup (WIB), x = hari tutup, d = hanya hari ini. 0=Minggu ... 6=Sabtu.
 Tempat tanpa entri (area terbuka) tidak diberi status. */
    jadwal: {
        1: { a: "09:00", b: "14:00" },
        2: { a: "09:00", b: "15:00" },
        3: { a: "08:00", b: "14:00", x: [1] },
        6: { a: "17:00", b: "23:00" },
        7: { a: "18:00", b: "03:00" },
        8: { a: "10:00", b: "17:00" },
        9: { a: "06:00", b: "14:00" },
        10: { a: "06:00", b: "17:00" },
        11: { a: "06:00", b: "17:00" },
        12: { a: "08:00", b: "17:00" },
        13: { a: "08:00", b: "17:00" },
        14: { a: "06:00", b: "17:00" },
        16: { a: "08:00", b: "17:00" },
        17: { a: "17:00", b: "22:00", d: [6] },
    },
    rute: [
        {
            id: "budaya",
            nama: "Setengah hari budaya",
            ids: [1, 5, 13, 11, 6],
            ket: "Keraton, Masjid Agung, Kauman, Pasar Klewer, lalu makan malam di Galabo. Mulai pagi sebelum Keraton tutup.",
        },
        {
            id: "pagi",
            nama: "Pagi di Pasar Gede",
            ids: [10, 8, 4, 6],
            ket: "Pasar Gede, timlo, Benteng Vastenburg, lalu jajan malam di Galabo.",
        },
        {
            id: "barat",
            nama: "Batik & taman barat",
            ids: [12, 3, 15, 14],
            ket: "Laweyan, Museum Radya Pustaka (tutup Senin), Taman Sriwedari, lalu Balekambang.",
        },
    ],
    tempat: [
        {
            id: 1,
            foto: "assets/keraton.webp",
            nama: "Keraton Kasunanan Surakarta",
            kategori: "budaya",
            lat: -7.5782,
            lon: 110.8283,
            alamat: "Jl. Siswa, Baluwarti",
            jam: "09.00-14.00 (Jumat tutup lebih awal)",
            tiket: "Sekitar Rp15.000",
            deskripsi:
                "Istana Kasunanan dengan museum pusaka, kereta kencana, dan bangunan khas Jawa. Tempat terbaik untuk mengenal tradisi keraton.",
            tips: "Berpakaian sopan dan ikuti arahan pemandu setempat.",
        },
        {
            id: 2,
            foto: "assets/pura_mangkunegaran.jpg",
            nama: "Pura Mangkunegaran",
            kategori: "budaya",
            lat: -7.5667,
            lon: 110.8228,
            alamat: "Jl. Ronggowarsito",
            jam: "09.00-15.00",
            tiket: "Sekitar Rp20.000",
            deskripsi:
                "Istana Mangkunegaran dengan pendapa luas dan koleksi topeng, perhiasan, serta perlengkapan tari.",
            tips: "Pemandu tersedia pada jam kunjungan.",
        },
        {
            id: 3,
            foto: "assets/museum_radya_pustaka.jpeg",
            nama: "Museum Radya Pustaka",
            kategori: "budaya",
            lat: -7.5683,
            lon: 110.8105,
            alamat: "Jl. Slamet Riyadi",
            jam: "08.00-14.00, Senin tutup",
            tiket: "Sekitar Rp10.000",
            deskripsi:
                "Salah satu museum tertua di Indonesia, berisi arca, wayang, naskah kuno, dan benda bersejarah.",
            tips: "Cocok dikombinasikan dengan jalan kaki ke Taman Sriwedari.",
        },
        {
            id: 4,
            foto: "assets/benteng-vasternburg.jpeg",
            nama: "Benteng Vastenburg",
            kategori: "budaya",
            lat: -7.572,
            lon: 110.833,
            alamat: "Jl. Jend. Sudirman",
            jam: "Area luar terbuka",
            tiket: "Gratis",
            deskripsi:
                "Benteng peninggalan kolonial Belanda di pusat kota. Sering dipakai untuk acara budaya.",
            tips: "Dekat dengan Pasar Gede, bagus untuk satu rute pendek.",
        },
        {
            id: 5,
            foto: "assets/masjid-agung.jpg",
            nama: "Masjid Agung Surakarta",
            kategori: "budaya",
            lat: -7.5775,
            lon: 110.827,
            alamat: "Jl. Alun-alun Utara",
            jam: "Mengikuti waktu salat",
            tiket: "Gratis",
            deskripsi:
                "Masjid bersejarah di kompleks keraton dengan arsitektur Jawa yang kuat.",
            tips: "Gunakan pakaian tertutup dan jaga ketenangan.",
        },
        {
            id: 6,
            foto: "assets/galabo.jpeg",
            nama: "Galabo (Gladak Langen Bogan)",
            kategori: "kuliner",
            lat: -7.5713,
            lon: 110.8276,
            alamat: "Jl. Slamet Riyadi, kawasan Gladak",
            jam: "Malam hari, sekitar 17.00-23.00",
            tiket: "Gratis (bayar jajanan)",
            deskripsi:
                "Sentra jajanan malam di sepanjang jalan. Banyak pilihan makanan khas Solo dalam satu tempat.",
            tips: "Datang sebelum pukul 19.00 untuk menghindari antrean panjang.",
        },
        {
            id: 7,
            foto: "assets/nasi-liwet-wongso.jpeg",
            nama: "Nasi Liwet Wongso Lemu",
            kategori: "kuliner",
            lat: -7.567,
            lon: 110.819,
            alamat: "Kawasan Keprabon",
            jam: "Malam hingga dini hari",
            tiket: "Rp15.000-30.000 per porsi",
            deskripsi:
                "Nasi liwet khas Solo dengan santan gurih, suwiran ayam, telur, dan areh.",
            tips: "Pilihan pas untuk makan malam setelah jalan-jalan.",
        },
        {
            id: 8,
            foto: "assets/timlo-sastro.jpg",
            nama: "Timlo Solo Sastro",
            kategori: "kuliner",
            lat: -7.5733,
            lon: 110.8293,
            alamat: "Dekat Pasar Gede",
            jam: "Siang hingga sore",
            tiket: "Rp20.000-40.000 per porsi",
            deskripsi:
                "Timlo, sup berkuah bening dengan isian sosis Solo, ati ampela, dan telur pindang.",
            tips: "Tanyakan jam buka terlebih dahulu karena bisa berubah.",
        },
        {
            id: 9,
            foto: "assets/serabi-notosuman.jpeg",
            nama: "Serabi Notosuman",
            kategori: "kuliner",
            lat: -7.5598,
            lon: 110.817,
            alamat: "Jl. Notosuman",
            jam: "Pagi hingga siang",
            tiket: "Rp5.000-15.000",
            deskripsi:
                "Serabi gurih-manis yang dibakar di tungku tanah liat. Cocok untuk oleh-oleh.",
            tips: "Datang pagi karena sering cepat habis.",
        },
        {
            id: 10,
            foto: "assets/pasar-gedhe.jpeg",
            nama: "Pasar Gede Hardjonagoro",
            kategori: "belanja",
            lat: -7.57,
            lon: 110.8312,
            alamat: "Jl. Jend. Sudirman",
            jam: "Pagi hingga sore",
            tiket: "Gratis",
            deskripsi:
                "Pasar tradisional bersejarah dengan jajanan, dawet, dan bumbu. Dekat Klenteng Tien Kok Sie.",
            tips: "Coba es dawet telasih sebagai penutup.",
        },
        {
            id: 11,
            foto: "assets/pasar-klewer.jpeg",
            nama: "Pasar Klewer",
            kategori: "belanja",
            lat: -7.5753,
            lon: 110.8277,
            alamat: "Jl. Dr. Rajiman, dekat Keraton",
            jam: "Pagi hingga sore",
            tiket: "Gratis",
            deskripsi: "Pusat grosir batik dan tekstil terbesar di Solo.",
            tips: "Tawar-menawar sudah biasa; bandingkan harga di beberapa kios.",
        },
        {
            id: 12,
            foto: "assets/kampung-batik-laweyan.jpeg",
            nama: "Kampung Batik Laweyan",
            kategori: "belanja",
            lat: -7.5718,
            lon: 110.7985,
            alamat: "Laweyan",
            jam: "Sekitar 08.00-17.00",
            tiket: "Gratis",
            deskripsi:
                "Kampung pengrajin batik dengan galeri, workshop, dan bangunan lama bergaya Jawa-Eropa.",
            tips: "Ikut kelas membatik singkat jika ada waktu.",
        },
        {
            id: 13,
            foto: "assets/kauman.jpeg",
            nama: "Kampung Batik Kauman",
            kategori: "belanja",
            lat: -7.576,
            lon: 110.826,
            alamat: "Kauman, dekat Masjid Agung",
            jam: "Sekitar 08.00-17.00",
            tiket: "Gratis",
            deskripsi:
                "Kampung batik tua dengan gang sempit dan banyak rumah produksi batik tulis.",
            tips: "Jelajahi dengan berjalan kaki.",
        },
        {
            id: 17,
            foto: "assets/ngarsopuro.jpg",
            nama: "Ngarsopuro Night Market",
            kategori: "belanja",
            lat: -7.567,
            lon: 110.8222,
            alamat: "Jl. Diponegoro, depan Mangkunegaran",
            jam: "Sabtu malam, sekitar 17.00-22.00",
            tiket: "Gratis",
            deskripsi:
                "Pasar malam mingguan dengan kerajinan, jajanan, dan pertunjukan kecil.",
            tips: "Jadwal bisa berubah, cek informasi terbaru.",
        },
        {
            id: 14,
            foto: "assets/balekambang.webp",
            nama: "Taman Balekambang",
            kategori: "alam",
            lat: -7.556,
            lon: 110.812,
            alamat: "Jl. Ahmad Yani, Manahan",
            jam: "06.00-17.00",
            tiket: "Murah, sekitar Rp5.000",
            deskripsi:
                "Taman kota rindang dengan kolam, pohon besar, dan area santai keluarga.",
            tips: "Bagus untuk jalan pagi atau piknik singkat.",
        },
        {
            id: 15,
            foto: "assets/sriwedari.jpg",
            nama: "Taman Sriwedari",
            kategori: "alam",
            lat: -7.5688,
            lon: 110.811,
            alamat: "Jl. Slamet Riyadi",
            jam: "Sepanjang hari",
            tiket: "Gratis",
            deskripsi:
                "Ruang terbuka hijau di tengah kota, dekat Museum Radya Pustaka.",
            tips: "Pas untuk istirahat di tengah rute wisata.",
        },
        {
            id: 16,
            foto: "assets/jurug.jpg",
            nama: "Taman Satwa Taru Jurug",
            kategori: "alam",
            lat: -7.57,
            lon: 110.859,
            alamat: "Jebres, tepi Bengawan Solo",
            jam: "08.00-17.00",
            tiket: "Sekitar Rp20.000",
            deskripsi:
                "Kebun binatang di tepi Bengawan Solo dengan koleksi satwa dan area bermain.",
            tips: "Cocok untuk keluarga dengan anak.",
        },
        
    ],
};



//SW.JS
const VERSI = "solo-v1";
const INTI = [
  "./",
  "index.html",
  "manifest.json",
  "assets/icon-192.png",
  "assets/icon-512.png",
];
const FOTO = [
  "keraton.webp",
  "pura_mangkunegaran.jpg",
  "museum_radya_pustaka.jpeg",
  "benteng-vasternburg.jpeg",
  "masjid-agung.jpg",
  "galabo.jpeg",
  "nasi-liwet-wongso.jpeg",
  "timlo-sastro.jpg",
  "serabi-notosuman.jpeg",
  "pasar-gedhe.jpeg",
  "pasar-klewer.jpeg",
  "kampung-batik-laweyan.jpeg",
  "kauman.jpeg",
  "balekambang.webp",
  "sriwedari.jpg",
  "jurug.jpg",
  "ngarsopuro.jpg",
].map((f) => "assets/" + f);

self.addEventListener("install", (e) => {
  // Satu berkas gagal (misalnya foto belum ada) tidak membatalkan yang lain.
  e.waitUntil(
    caches
      .open(VERSI)
      .then((c) => Promise.allSettled([...INTI, ...FOTO].map((u) => c.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) =>
        Promise.all(ks.filter((k) => k !== VERSI).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Cache dulu, perbarui di latar belakang. Permintaan lintas-situs (Google Maps) tidak disentuh.
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then((hit) => {
      const jaringan = fetch(r)
        .then((res) => {
          if (res.ok) {
            const salinan = res.clone();
            caches.open(VERSI).then((c) => c.put(r, salinan));
          }
          return res;
        })
        .catch(
          () =>
            hit ||
            (r.mode === "navigate"
              ? caches.match("index.html")
              : Response.error()),
        );
      return hit || jaringan;
    }),
  );
});



//MANIFEST.JSON
{
  "name": "Panduan Wisata Surakarta",
  "short_name": "Wisata Solo",
  "description": "Panduan wisata offline Kota Surakarta: keraton, batik, dan kuliner.",
  "lang": "id",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "background_color": "#19215a",
  "theme_color": "#19215a",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}