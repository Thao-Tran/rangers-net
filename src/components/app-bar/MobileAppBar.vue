<template>
  <v-app-bar
    app
    color="primary"
    dark
    flat
  >
    <v-app-bar-nav-icon @click="$emit('drawerToggle')"/>
    <div class="d-flex align-center">
      <v-img
        src="@/assets/logo.svg"
        alt="RangersNet Logo"
        class="shrink mr-2"
        contain
        transition="scale-transition"
        width="36"
      />
      <v-app-bar-title>
        <router-link to="/" class="app-bar-title-link">
          RangersNet
        </router-link>
      </v-app-bar-title>
    </div>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.menu {
  display: flex;
  height: 100%;
  align-items: center;

  &-item-group {
    background: white;
  }
}

.app-bar-title-link {
  color: white;
  text-decoration: none;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class AppBar extends Vue {
  name = 'MobileAppBar'
  activeTab = 0
  selectedMenuItems: Record<string, number> = {}

  get activeMenuItem (): Record<string, number> {
    return {
      [`${this.activeTab}`]: this.selectedMenuItems[`${this.activeTab}`]
    }
  }
}
</script>
