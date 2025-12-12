<template>
  <div id="app">
    <nav class="navbar" v-if="authStore.isAuthenticated">
      <div class="nav-brand">
        <h2>D&D Platform</h2>
      </div>
      <div class="nav-links">
        <router-link to="/dashboard">Дашборд</router-link>
        <router-link to="/characters">Персонажи</router-link>
        <router-link to="/campaigns">Кампании</router-link>
        <button @click="authStore.logout">Выйти</button>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
}

.nav-links a.router-link-active {
  color: #42b983;
}

.nav-links button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>