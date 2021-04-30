<template>
  <div>
    <navigation-drawer title="General management" v-bind:sections="sections"/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

export const ROUTE_PATH = '/general-management'

const GeneralManagementComponents = Vue.extend({
  components: {
    NavigationDrawer
  }
})

@Component
export default class GeneralManagement extends GeneralManagementComponents {
  name = 'GeneralManagement'

  sections = [
    {
      items: [
        {
          label: 'Team dashboard',
          route: `${ROUTE_PATH}/team-dashboard`
        },
        {
          label: 'Division dashboard',
          route: `${ROUTE_PATH}/division-dashboard`
        },
        {
          label: 'Roster',
          route: `${ROUTE_PATH}/roster`
        },
        {
          label: 'Managers & bench staff',
          route: `${ROUTE_PATH}/bench-staff`
        },
        {
          label: 'Communications',
          route: `${ROUTE_PATH}/communications`
        },
        {
          label: 'Gamesheets',
          route: `${ROUTE_PATH}/gamesheets`
        },
        {
          label: 'Request substitute goalie',
          route: `${ROUTE_PATH}/sub-goalie`
        },
        {
          label: 'Draft management',
          route: `${ROUTE_PATH}/draft`
        },
        {
          label: 'Team budget',
          route: `${ROUTE_PATH}/budget`
        },
        {
          label: 'Awards voting',
          route: `${ROUTE_PATH}/awards`
        }
      ]
    },
    {
      title: 'Tournaments & exhibitions',
      items: [
        {
          label: 'Tournament listing',
          route: `${ROUTE_PATH}/tournaments`
        },
        {
          label: 'Exhibition games',
          route: `${ROUTE_PATH}/exhibitions`
        },
        {
          label: 'Verify tournaments',
          route: `${ROUTE_PATH}/verify-tournaments`
        },
        {
          label: 'Pending convenor approval',
          route: `${ROUTE_PATH}/pending-covenor`
        },
        {
          label: 'Pending office approval',
          route: `${ROUTE_PATH}/pending-office`
        },
        {
          label: 'Approved permits',
          route: `${ROUTE_PATH}/approved-permits`
        }
      ]
    },
    {
      title: 'Evaluations',
      items: [
        {
          label: 'Plavers',
          route: `${ROUTE_PATH}/player-evaluations`
        },
        {
          label: 'Coaches',
          route: `${ROUTE_PATH}/coach-evaluations`
        },
        {
          label: 'Completed',
          route: `${ROUTE_PATH}/completed-evaluations`
        },
        {
          label: 'Missing',
          route: `${ROUTE_PATH}/missing-evaluations`
        }
      ]
    }
  ]
}
</script>

<style lang="scss" scoped>
</style>
