<template>
  <main class="w-full h-screen flex">
    <router-link to="/dashboard" class="w-1/2 bg-blue-500 h-full flex justify-center items-center hover:bg-blue-600 hover:w-10/18 transition-all group">
      <h1 class="text-4xl font-semibold text-white group-hover:scale-110 group-hover:drop-shadow-2xl transition-all">{{ $t('dashboard.title') }}</h1>
    </router-link>
    <router-link to="/preview" class="w-1/2 bg-red-500 h-full flex justify-center items-center hover:bg-red-600 hover:w-10/18 transition-all group">
      <h1 class="text-4xl font-semibold text-white group-hover:scale-110 group-hover:drop-shadow-2xl transition-all">{{ $t('preview.title') }}</h1>
    </router-link>
  </main>
</template>
