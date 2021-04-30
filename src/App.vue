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
import { Watch } from 'vue-property-decorator'

@Component({ components: { AppBar } })
export default class App extends Vue {
  name = 'App'

  created (): void {
    document.title = this.$route.meta.title ?? 'RangersNet'
  }

  @Watch('$route.meta.title')
  onRouteTitleUpdated (pageTitle: string): void {
    document.title = pageTitle ?? 'RangersNet'
  }
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
