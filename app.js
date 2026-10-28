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
