<template>
  <div class="route-with-nav-drawer">
    <navigation-drawer title="General management" :sections="sections"/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

export const ROUTE_PATH = '/general-management'

@Component({ components: { NavigationDrawer } })
export default class GeneralManagement extends Vue {
  name = 'GeneralManagement'
  selectedFilters: Record<string, string> = {}
  sections = [
    {
      items: [
        { label: 'Team dashboard' },
        { label: 'Division dashboard' },
        { label: 'Roster', route: `${ROUTE_PATH}/roster` },
        { label: 'Managers & bench staff' },
        { label: 'Communications' },
        { label: 'Gamesheets' },
        { label: 'Request substitute goalie' },
        { label: 'Draft management' },
        { label: 'Team budget' },
        { label: 'Awards voting' }
      ]
    },
    {
      title: 'Tournaments & exhibitions',
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
      title: 'Evaluations',
      items: [
        { label: 'Players', route: `${ROUTE_PATH}/player-evaluation` },
        { label: 'Coaches' },
        { label: 'Completed' },
        { label: 'Missing' }
      ]
    }
  ]
}
</script>

<style lang="scss" scoped>
</style>
