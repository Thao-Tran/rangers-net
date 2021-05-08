<template>
  <v-card class="mobile-player-card d-flex flex-column flex-grow-1 mt-2">
    <v-toolbar
      absolute
      dark
      flat
      color="primary"
    >
      <v-btn
        icon
        dark
        @click="$router.push({ query: { ...$route.query, player: undefined, season: undefined } })"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title v-text="player.name"/>
      <template v-slot:extension>
        <tabs v-model="tab" :items="tabItems" alignWithTitle/>
      </template>
    </v-toolbar>
    <div class="mobile-player-card-content-wrapper flex-grow-1">
      <v-tabs-items v-model="tab" class="tab-items d-flex flex-column flex-grow-1">
        <v-tab-item key="details" class="grey--text text--darken-4">
          <v-card-text class="d-flex flex-column">
            <div class="text-h6 mt-2">
              HCiD: <a>{{ player.hcid }}</a>
            </div>
            <div class="text-h6 mt-4 mb-2">Contact info</div>
            <div class="mobile-player-card-content">
              <div v-for="(section, i) in contactDetailSections" :key="i" class="info-section d-flex">
                <div class="info-section-content">
                  <div v-for="(item, itemIndex) in section.items" :key="itemIndex" class="info-section-item mb-3">
                    <div class="font-weight-medium">{{ item.label }}</div>
                    <div class="text-break">{{ getPlayerField(item.field) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-tab-item>
        <v-tab-item key="history" class="history-tab flex-grow-1">
          <v-card-text v-if="selectedHistory.length > 0">
            <div class="text-h5 mb-4">{{ selectedHistory[0].season }} | {{ selectedHistory[0].team }}</div>
            <div class="text-h6 mb-2">Stats</div>
            <div class="stats">
              <div v-for="(item, index) in historyHeaders" :key="index" class="stats-item d-flex flex-column align-center">
                <div class="font-weight-bold">{{ item.text }}</div>
                <div>{{ selectedHistory[0][item.value] }}</div>
              </div>
            </div>
            <div class="text-h6 my-2">Evaluation</div>
            <div class="d-flex flex-grow-1 flex-column">
              <div class="mb-2">
                <span class="font-weight-bold">Total score:</span>
                {{ selectedHistory[0].evaluation.total }}
              </div>
              <div class="evaluation">
                <div class="d-flex">
                  <div class="font-weight-medium mr-2">Position</div>
                  <div>{{ selectedHistory[0].position }}</div>
                </div>
                <div class="d-flex">
                  <div class="font-weight-medium mr-2">Hand</div>
                  <div>{{ selectedHistory[0].hand }}</div>
                </div>
                <div v-for="(item, i) in evaluationDetailSection.items" :key="i" class="d-flex">
                  <div class="font-weight-medium mr-2">{{ item.label }}</div>
                  <div>{{ selectedHistory[0].evaluation[item.field] }}</div>
                </div>
              </div>
              <div class="text-subtitle-1 font-weight-medium mt-3 mb-1">Coach's comments</div>
              <div>{{ selectedHistory[0].evaluation.comments }}</div>
            </div>
          </v-card-text>
          <div v-else class="history-default-text d-flex flex-grow-1 align-center justify-center">
            No previous history
          </div>
        </v-tab-item>
        <v-tab-item key="suspensions">
          <v-card-text>
            <v-data-table
              :headers="suspensionHeaders"
              :items="player.stats[0].suspensions"
              :items-per-page=-1
              item-key="gameId"
              sort-by="gameId"
              fixed-header
              hide-default-footer
              dense
              class="mt-2"
            />
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-card>
</template>

<script lang="ts">
import CardTitle from '@/components/CardTitle.vue'
import Tabs, { AppBarItem } from '@/components/app-bar/Tabs.vue'
import { getEvaluationCategories } from '@/utils/evaluations'
import { Player } from '@/utils/players'
import { Stats } from '@/utils/stats'
import _ from 'lodash-es'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'

interface PlayerDetailSection {
  items: Array<{label: string, field: string}>
}

@Component({ components: { CardTitle, Tabs } })
export default class RosterPlayerCard extends Vue {
  name = 'RosterPlayerCard'

  @Prop(Object) player?: Player

  tab = 0

  contactDetailSections: PlayerDetailSection[] = [
    {
      items: [
        { label: 'Date of birth', field: 'dob' },
        { label: 'Phone', field: 'phone' },
        { label: 'Email', field: 'email' },
        { label: 'Address', field: 'address' }
      ]
    },
    {
      items: [
        { label: 'Parent name', field: 'parents[0].name' },
        { label: 'Relationship', field: 'parents[0].relationship' },
        { label: 'Phone', field: 'parents[0].phone' },
        { label: 'Email', field: 'parents[0].email' }
      ]
    },
    {
      items: [
        { label: 'Parent name', field: 'parents[1].name' },
        { label: 'Relationship', field: 'parents[1].relationship' },
        { label: 'Phone', field: 'parents[1].phone' },
        { label: 'Email', field: 'parents[1].email' }
      ]
    }
  ]

  historyHeaders: DataTableHeader[] = [
    { text: 'Rank', value: 'rank', align: 'end' },
    { text: 'Rating', value: 'rating', align: 'end' },
    { text: 'GP', value: 'gamesPlayed', align: 'end' },
    { text: 'G', value: 'goals', align: 'end' },
    { text: 'A', value: 'assists', align: 'end' },
    { text: 'P', value: 'points', align: 'end' },
    { text: 'PM', value: 'penaltyMinutes', align: 'end' }
  ]

  suspensionHeaders: DataTableHeader[] = [
    { text: 'Game ID', value: 'gameId' },
    { text: 'Date time', value: 'time' },
    { text: 'Team', value: 'team' },
    { text: 'Infraction', value: 'infraction' },
    { text: 'Length', value: 'length' },
    { text: 'Served', value: 'served' }
  ]

  evaluationDetailSection = {
    items: getEvaluationCategories()
  }

  get tabItems (): AppBarItem[] {
    const prevHistory = this.player?.stats.slice(1).map(value => {
      return {
        title: value.season,
        route: { query: { ...this.$route.query, season: value.season } },
        queryOnly: true
      }
    }) ?? []

    return [
      {
        title: 'Details'
      },
      {
        title: 'History',
        items: prevHistory.length > 0 ? prevHistory : undefined
      },
      {
        title: 'Suspensions'
      }
    ]
  }

  get selectedHistory (): Stats[] {
    const season = this.$route.query.season
    const selectedHistory = this.player?.stats.filter((history) => history.season === season) ?? []

    if (selectedHistory.length > 0) {
      return selectedHistory
    }

    const latestHistory = this.player?.stats.sort(({ season: seasonA }, { season: seasonB }) => {
      if (seasonA === seasonB) {
        return 0
      }

      return seasonB > seasonA ? 1 : -1
    }).slice(1, 2) ?? []
    return latestHistory
  }

  beforeDestroy () {
    const { season, ...query } = this.$route.query

    if (_.isNil(season)) {
      return
    }

    this.$router.replace({ query })
  }

  getPlayerField (field: string): string | number {
    return _.get(this.player, field)
  }
}
</script>

<style lang="scss">
.mobile-player-card {
  max-height: 100%;
  overflow: hidden;

  .v-toolbar {
    width: 100%;
  }

  &-content {
    .info-section {
      &-item {
        display: grid;
        grid-template-columns: 86px auto;
        column-gap: 8px;
        width: 100%;
      }

      &-content {
        width: 100%;
      }
    }
  }

  &-content-wrapper {
    padding-top: 104px;
    max-height: 100%;
    overflow-y: auto;

    .tab-items {
      height: 100%;
      overflow-y: auto;

      .history-tab {
        height: 100%;
      }
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, 40px);
      gap: 8px;
      justify-content: center;
    }

    .history-default-text {
      height: 100%;
    }
  }

  .evaluation {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
  }
}
</style>
