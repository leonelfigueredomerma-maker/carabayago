const CACHE_NAME = "carabaya-taxi-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./estilos.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", (evento) => {

    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ARCHIVOS);
            })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (evento) => {

    evento.waitUntil(
        caches.keys().then((nombres) => {

            return Promise.all(
                nombres
                    .filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
            );

        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (evento) => {

    evento.respondWith(
        caches.match(evento.request)
            .then((respuesta) => {

                return respuesta ||
                    fetch(evento.request);

            })
    );
});