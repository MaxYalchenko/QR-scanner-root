<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://avatars.mds.yandex.net/get-shedevrum/11473245/img_bc4f2cb60aec11efbb203ac3123cbc49/orig">
          </q-avatar>
          Заметки
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>