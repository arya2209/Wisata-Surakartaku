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
