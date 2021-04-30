<template>
  <v-app>
    <app-bar/>
    <v-main>
      <router-view class="app-router-view"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import AppBar from '@/components/AppBar.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({ components: { AppBar } })
export default class App extends Vue {
  name = 'App'
}
</script>

<style lang="scss">
.v-main {
  height: 100vh;
}

.app-router-view {
  height: 100%;
}
</style>
