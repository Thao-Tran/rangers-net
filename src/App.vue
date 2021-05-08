<template>
  <v-app>
    <desktop-app-bar v-if="$vuetify.breakpoint.mdAndUp"/>
    <mobile-app-bar v-else @drawerToggle="isDrawerVisible = !isDrawerVisible"/>
    <navigation-drawer
      v-if="$vuetify.breakpoint.mobile"
      v-model="isDrawerVisible"
      :sections="navSections"
      hideSelectionBox
      absolute
      temporary
    />
    <v-main class="app-main">
      <router-view class="app-router-view grey lighten-4"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import DesktopAppBar from '@/components/app-bar/DesktopAppBar.vue'
import MobileAppBar from '@/components/app-bar/MobileAppBar.vue'
import NavigationDrawer, { NavigationSection } from '@/components/NavigationDrawer.vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

@Component({ components: { DesktopAppBar, MobileAppBar, NavigationDrawer } })
export default class App extends Vue {
  name = 'App'

  isDrawerVisible = false

  navSections: NavigationSection[] = [
    {
      title: 'Management',
      items: [
        {
          label: 'General management',
          items: [
            { label: 'Team dashboard' },
            { label: 'Division dashboard' },
            { label: 'Roster', route: '/general-management/roster' },
            { label: 'Managers & bench staff' },
            { label: 'Communications' },
            { label: 'Gamesheets' },
            { label: 'Request substitute goalie' },
            { label: 'Draft management' },
            { label: 'Team budget' },
            { label: 'Awards voting' },
            {
              label: 'Tournaments & exhibitions',
              items: [
                { label: 'Tournament listing' },
                { label: 'Exhibition games' },
                { label: 'Verify tournaments' },
                { label: 'Pending convenor approval' },
                { label: 'Pending office approval' },
                { label: 'Approved permits' }
              ]
            },
            {
              label: 'Evaluations',
              items: [
                { label: 'Players', route: '/general-management/player-evaluation' },
                { label: 'Coaches' },
                { label: 'Completed' },
                { label: 'Missing' }
              ]
            }
          ]
        }
      ]
    }
  ]

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
html, body {
  height: 100%;
}

#app {
  height: 100%;
}

.app-main.v-main {
  height: 100%;
}

.app-router-view {
  height: 100%;
  max-height: 100%;
}

.route-with-nav-drawer {
  display: flex;
}

.max-width-100 {
  max-width: 100%;
}
</style>
