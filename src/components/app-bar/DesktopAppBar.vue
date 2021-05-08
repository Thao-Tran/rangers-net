<template>
  <v-app-bar
    app
    color="primary"
    dark
    flat
  >
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

    <app-bar-tabs :right="true" :items="items" v-model="activeTab"/>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.app-bar-title-link {
  color: white;
  text-decoration: none;
}
</style>

<script lang="ts">
import AppBarTabs from '@/components/app-bar/Tabs.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

export interface AppBarItem {
  title: string
  class?: string
  route?: string
  items?: AppBarItem[]
}

@Component({ components: { AppBarTabs } })
export default class AppBar extends Vue {
  name = 'DesktopAppBar'
  activeTab = 0
  selectedMenuItems: Record<string, number> = {}
  items: AppBarItem[] = [
    {
      title: 'Management',
      items: [
        {
          title: 'General',
          route: '/general-management'
        },
        {
          title: 'Profile'
        },
        {
          title: 'Roster'
        }
      ],
      class: 'management'
    },
    {
      title: 'Reporting'
    },
    {
      title: 'Users'
    },
    {
      title: 'Operations'
    },
    {
      title: 'System'
    }
  ]
}
</script>
