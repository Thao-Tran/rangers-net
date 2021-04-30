<template>
  <v-app>
    <app-bar/>
    <v-main>
      <router-view class="app-router-view"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AppBar from '@/components/AppBar.vue'

export default Vue.extend({
  name: 'App',

  components: {
    AppBar
  },

  data: () => ({
    //
  })
})
</script>

<style lang="scss">
.v-main {
  height: 100vh;
}

.app-router-view {
  height: 100%;
}
</style>
