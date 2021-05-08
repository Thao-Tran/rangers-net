<template>
  <div class="route-with-nav-drawer">
    <navigation-drawer v-if="$vuetify.breakpoint.mdAndUp" title="General management" :sections="sections"/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import _ from 'lodash-es'
import Vue from 'vue'
import Component from 'vue-class-component'

export const ROUTE_PATH = '/general-management'

@Component({ components: { NavigationDrawer } })
export default class GeneralManagement extends Vue {
  name = 'GeneralManagement'
  sections = [
    {
      title: 'General management',
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
            { label: 'Players', route: `${ROUTE_PATH}/player-evaluation` },
            { label: 'Coaches' },
            { label: 'Completed' },
            { label: 'Missing' }
          ]
        }
      ]
    }
  ]

  created () {
    this.$store.commit('getLeagues')
  }

  beforeDestroy () {
    const { league, division, subDivision, team, ...query } = this.$route.query

    if ([league, division, subDivision, team].every(_.isNil)) {
      return
    }

    this.$router.replace({ query })
  }
}
</script>

<style lang="scss" scoped>
</style>
