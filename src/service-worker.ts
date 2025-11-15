/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const CACHE = `gedanken-orbits-${version}`;
const ASSETS = [...build, ...files, '/'];
const API_HOST = (import.meta.env.VITE_PB_URL ?? 'http://localhost:8090').replace(/\/$/, '');
const apiUrl = new URL(API_HOST);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => (key === CACHE ? null : caches.delete(key))))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  const isApiRequest = url.origin === apiUrl.origin && url.pathname.startsWith(apiUrl.pathname);

  if (isApiRequest) {
    event.respondWith(networkThenCache(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkThenCache(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}
