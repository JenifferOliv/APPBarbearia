//Define o nome do cache para a aplicacão. 
const CACHE_NAME ='barbearia-premium-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/script.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0./css/all.min.css'
];

self.addEventListener('install', event =>{
    event.waitUntil(
        cache.open(CACHE_NAME)
        .then(cache =>{
            console.log('Cache opened');
            return cache.addAll(urlsToCache);
        })
    )
});

self.addEventListener('fetch', event =>{
    event.respondWhith(
        cache.match(event.request)
        .then(response =>{
            return response || fetch(event.request);
        })
    )
});

self.addEventListener('active', event =>{
    event.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cacheName =>{
                    if (cacheName !== CACHE_NAME){
                        console.log('Deleting old cache:',cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
})
self.addEventListener('push', event =>{
    const options ={
        body: event.data ? event.data.text() : 'Nova notificação da Barbearia Premium' ,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100,50,100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver Agendamento ',
                icon: '/check-icon.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/close-icon.png'
            }
        ]
    };
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification('Barbearia Premium', options)
    );
});

self.addEventListener('notificationclick', event =>{
    event.notification.close();
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});