import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'auth', component: () => import('pages/AuthorizationPage.vue') },
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'qr-scanner', component: () => import('pages/QrScannerPage.vue') },
      { path: 'qr-generator', component: () => import('pages/QrCodeGenerator.vue') }

    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
