/* Panduan Wisata Surakarta
   Membutuhkan data.js (window.DB) yang dimuat lebih dulu. */
(function () {
  'use strict';

  const DB = window.DB;
  const KAT = Object.fromEntries(DB.kategori.map(k => [k.id, k]));
  const state = { kategori: 'semua', kata: '', pilih: null };

  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 899px)');

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

  /* ---------- Proyeksi koordinat ke kanvas 1000 x 620 ---------- */
  const lats = DB.tempat.map(t => t.lat);
  const lons = DB.tempat.map(t => t.lon);
  const L = {
    a: Math.min(...lats) - .004, b: Math.max(...lats) + .004,
    c: Math.min(...lons) - .008, d: Math.max(...lons) + .008
  };
  const px = lon => (lon - L.c) / (L.d - L.c) * 900 + 50;
  const py = lat => (L.b - lat) / (L.b - L.a) * 520 + 50;
  const pts = list => list.map(([lon, lat]) => `${px(lon).toFixed(1)},${py(lat).toFixed(1)}`).join(' ');

  /* ---------- Filter ---------- */
  function cocok(t, kategori = state.kategori) {
    const cocokKat = kategori === 'semua' || t.kategori === kategori;
    const teks = (t.nama + ' ' + t.deskripsi + ' ' + t.alamat + ' ' + KAT[t.kategori].nama).toLowerCase();
    return cocokKat && (!state.kata || teks.includes(state.kata));
  }

  /* ---------- Peta (bagian tetap) ---------- */
  function gambarDasar() {
    const g = $('base');
    const defs = svg('defs');
    const pat = svg('pattern', { id: 'grid', width: 50, height: 50, patternUnits: 'userSpaceOnUse' });
    pat.appendChild(svg('path', { d: 'M50 0H0V50', class: 'm-grid' }));
    defs.appendChild(pat);
    g.append(defs, svg('rect', { width: 1000, height: 620, fill: 'url(#grid)' }));

    // taman
    [[-7.5560, 110.8120, 70, 40], [-7.5688, 110.8110, 40, 28], [-7.5700, 110.8590, 55, 40]].forEach(([la, lo, w, h]) =>
      g.appendChild(svg('ellipse', { class: 'm-park', cx: px(lo), cy: py(la), rx: w, ry: h })));

    // Bengawan Solo
    g.appendChild(svg('polyline', { class: 'm-river', points: pts([[110.846, -7.5515], [110.851, -7.5600], [110.8565, -7.5660], [110.8530, -7.5730], [110.8580, -7.5830]]) }));
    g.appendChild(svg('text', { class: 'm-label', x: px(110.8565) + 20, y: py(-7.5665) }, 'Bengawan Solo'));

    // jalan lain
    [[[110.8276, -7.5560], [110.8276, -7.5800]], [[110.8312, -7.5700], [110.8590, -7.5690]], [[110.8150, -7.5560], [110.8290, -7.5790]]]
      .forEach(j => g.appendChild(svg('polyline', { class: 'm-road', points: pts(j) })));

    // Jl. Slamet Riyadi
    g.appendChild(svg('polyline', { class: 'm-main', points: pts([[110.790, -7.5655], [110.810, -7.5675], [110.8230, -7.5690], [110.8276, -7.5710], [110.8320, -7.5712]]) }));
    g.appendChild(svg('text', { class: 'm-label', x: px(110.800), y: py(-7.5665) - 12 }, 'Jl. Slamet Riyadi'));

    // area keraton
    g.appendChild(svg('rect', { class: 'm-kraton', x: px(110.8283) - 34, y: py(-7.5782) - 28, width: 68, height: 56, rx: 6 }));

    // kompas
    const k = svg('g', { transform: 'translate(940,60)' });
    k.append(svg('path', { class: 'm-compass', d: 'M0-22 L7 0 L0 22 L-7 0Z' }), svg('text', { class: 'm-compass-t', y: -27 }, 'U'));
    g.appendChild(k);
  }

  /* ---------- Peta (pin) ---------- */
  const PIN = 'M0 0C-2.5-5-10-10.5-10-17.5A10 10 0 1 1 10-17.5C10-10.5 2.5-5 0 0Z';

  function gambarPin() {
    const g = $('pins');
    const fokus = document.activeElement && document.activeElement.closest && document.activeElement.closest('.pin');
    const fokusId = fokus ? fokus.dataset.id : null;
    g.replaceChildren();

    // pin terpilih digambar paling akhir agar berada di atas
    const urut = [...DB.tempat].sort((a, b) => (a.id === state.pilih) - (b.id === state.pilih));
    const pasang = [];

    urut.forEach(t => {
      const sel = t.id === state.pilih;
      const x = px(t.lon), y = py(t.lat);
      const p = svg('g', {
        class: 'pin' + (sel ? ' is-selected' : '') + (cocok(t) ? '' : ' is-dim'),
        transform: `translate(${x.toFixed(1)},${y.toFixed(1)})`,
        tabindex: 0, role: 'button', 'aria-label': t.nama, 'aria-pressed': sel, 'data-id': t.id
      });
      p.style.setProperty('--c', KAT[t.kategori].warna);

      const body = svg('g', { class: 'pin__body' });
      body.append(svg('title', {}, t.nama), svg('path', { class: 'pin__shape', d: PIN }), svg('circle', { class: 'pin__dot', cy: -17.5, r: 3.6 }));
      p.appendChild(body);

      const kiri = x > 720;
      const label = svg('g', { class: 'pin__label' });
      const pill = svg('rect', { class: 'pin__pill' });
      const teks = svg('text', { class: 'pin__text', x: kiri ? -30 : 30, y: sel ? -26 : -22, 'text-anchor': kiri ? 'end' : 'start' }, t.nama);
      label.append(pill, teks);
      p.appendChild(label);

      p.addEventListener('click', () => buka(t.id, true));
      p.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buka(t.id, true); }
      });
      g.appendChild(p);
      pasang.push([pill, teks]);
    });

    // ukur teks setelah masuk DOM, lalu bentuk "pill" di belakangnya
    pasang.forEach(([pill, teks]) => {
      const b = teks.getBBox();
      pill.setAttribute('x', b.x - 10);
      pill.setAttribute('y', b.y - 4);
      pill.setAttribute('width', b.width + 20);
      pill.setAttribute('height', b.height + 8);
      pill.setAttribute('rx', (b.height + 8) / 2);
    });

    if (fokusId) {
      const lagi = g.querySelector(`.pin[data-id="${fokusId}"]`);
      if (lagi) lagi.focus({ preventScroll: true });
    }
  }

  /* ---------- Filter kategori ---------- */
  function buatChips() {
    const w = $('chips');
    [{ id: 'semua', nama: 'Semua', warna: null }, ...DB.kategori].forEach(k => {
      const b = html('button', 'chip');
      b.type = 'button';
      b.dataset.id = k.id;
      if (k.warna) b.style.setProperty('--c', k.warna);
      b.append(html('span', 'chip__dot'), html('span', 'chip__nama', k.nama), html('span', 'chip__n'));
      b.addEventListener('click', () => { state.kategori = k.id; segarkan(); });
      w.appendChild(b);
    });
  }
  function segarkanChips() {
    $('chips').querySelectorAll('.chip').forEach(b => {
      const id = b.dataset.id;
      b.setAttribute('aria-pressed', state.kategori === id);
      b.querySelector('.chip__n').textContent = DB.tempat.filter(t => cocok(t, id)).length;
    });
  }

  /* ---------- Daftar ---------- */
  function gambarDaftar() {
    const ul = $('list');
    ul.replaceChildren();
    const hasil = DB.tempat.filter(t => cocok(t));
    $('count').textContent = hasil.length + ' tempat';

    if (!hasil.length) {
      const li = html('li', 'empty', 'Tidak ada tempat yang cocok dengan pencarian ini.');
      const reset = html('button', null, 'Hapus filter');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        state.kategori = 'semua'; state.kata = ''; $('q').value = ''; segarkan();
      });
      li.appendChild(reset);
      ul.appendChild(li);
      return;
    }

    hasil.forEach(t => {
      const li = html('li');
      const b = html('button', 'item');
      b.type = 'button';
      b.dataset.id = t.id;
      b.style.setProperty('--c', KAT[t.kategori].warna);
      b.append(html('b', null, t.nama), html('small', null, KAT[t.kategori].nama + ', ' + t.alamat));
      b.addEventListener('click', () => buka(t.id, false));
      li.appendChild(b);
      ul.appendChild(li);
    });
    tandaiDaftar();
  }
  function tandaiDaftar() {
    $('list').querySelectorAll('.item').forEach(b => {
      if (Number(b.dataset.id) === state.pilih) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  /* ---------- Detail ---------- */
  function gambarDetail() {
    const d = $('detail');
    const t = DB.tempat.find(x => x.id === state.pilih);
    d.replaceChildren();

    if (!t) {
      d.dataset.empty = '';
      d.style.removeProperty('--c');
      const e = html('div', 'detail__empty');
      e.innerHTML = '<svg viewBox="0 0 24 34" width="30" height="42" aria-hidden="true"><path d="M12 33C10 27 1 21 1 12a11 11 0 1 1 22 0c0 9-9 15-11 21z" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>';
      e.appendChild(html('p', null, 'Pilih pin di peta atau tempat di daftar untuk melihat jam buka, tiket, dan tips kunjungan.'));
      d.appendChild(e);
      return;
    }

    delete d.dataset.empty;
    const k = KAT[t.kategori];
    d.style.setProperty('--c', k.warna);

    const close = html('button', 'detail__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Tutup detail');
    close.addEventListener('click', tutup);

    const body = html('div', 'detail__body');
    const dl = html('dl', 'facts');
    [['Alamat', t.alamat], ['Jam buka', t.jam], ['Tiket / harga', t.tiket], ['Koordinat', t.lat.toFixed(4) + ', ' + t.lon.toFixed(4)]]
      .forEach(([a, b]) => dl.append(html('dt', null, a), html('dd', null, b)));

    const tip = html('div', 'tip');
    tip.append(html('strong', null, 'Tips kunjungan'), document.createTextNode(t.tips));

    body.append(html('span', 'tag', k.nama), html('h2', null, t.nama), html('p', 'detail__desc', t.deskripsi), dl, tip);
    d.append(html('div', 'detail__bar'), close, body);
  }

  /* ---------- Interaksi ---------- */
  function buka(id, dariPeta) {
    state.pilih = id;
    gambarPin();
    tandaiDaftar();
    gambarDetail();

    if (!dariPeta) {
      // di layar sempit peta bisa digeser; bawa pin terpilih ke tengah
      const box = $('mapscroll');
      const t = DB.tempat.find(x => x.id === id);
      if (box.scrollWidth > box.clientWidth) {
        const lebar = $('map').getBoundingClientRect().width;
        box.scrollTo({ left: px(t.lon) / 1000 * lebar - box.clientWidth / 2, behavior: reduced.matches ? 'auto' : 'smooth' });
      }
    }
    if (mobile.matches) {
      $('detail').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    }
  }
  function tutup() {
    state.pilih = null;
    gambarPin(); tandaiDaftar(); gambarDetail();
  }
  function segarkan() {
    segarkanChips(); gambarPin(); gambarDaftar(); gambarDetail();
  }

  $('q').addEventListener('input', e => { state.kata = e.target.value.trim().toLowerCase(); segarkan(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.pilih != null) tutup(); });

  buatChips();
  gambarDasar();
  segarkan();
})();