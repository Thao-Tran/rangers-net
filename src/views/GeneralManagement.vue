<template>
  <div>
    <navigation-drawer title="General management" :sections="sections" :selectionBoxFields="selectionBoxFields" v-model="selectedFilters"/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import { defaultItems, defaultSelectionFields, SelectionItem } from '@/components/SelectionBox.vue'
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
        {
          label: 'Team dashboard'
        },
        {
          label: 'Division dashboard'
        },
        {
          label: 'Roster',
          route: `${ROUTE_PATH}/roster`
        },
        {
          label: 'Managers & bench staff'
        },
        {
          label: 'Communications'
        },
        {
          label: 'Gamesheets'
        },
        {
          label: 'Request substitute goalie'
        },
        {
          label: 'Draft management'
        },
        {
          label: 'Team budget'
        },
        {
          label: 'Awards voting'
        }
      ]
    },
    {
      title: 'Tournaments & exhibitions',
      items: [
        {
          label: 'Tournament listing'
        },
        {
          label: 'Exhibition games'
        },
        {
          label: 'Verify tournaments'
        },
        {
          label: 'Pending convenor approval'
        },
        {
          label: 'Pending office approval'
        },
        {
          label: 'Approved permits'
        }
      ]
    },
    {
      title: 'Evaluations',
      items: [
        {
          label: 'Players'
        },
        {
          label: 'Coaches'
        },
        {
          label: 'Completed'
        },
        {
          label: 'Missing'
        }
      ]
    }
  ]

  get selectionBoxFields (): SelectionItem[] {
    return defaultItems.division.slice(0, 4).includes(this.selectedFilters.division)
      ? defaultSelectionFields.filter(({ id }) => id !== 'subdivision') : defaultSelectionFields
  }
}
</script>

<style lang="scss" scoped>
</style>
