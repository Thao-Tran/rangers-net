<template>
  <v-card outlined class="desktop-player-card d-flex flex-column flex-grow-1 mt-2">
    <card-title :title="player.name">
      <div class="text-h6 font-weight-regular ml-2" title="HCiD">(<a>{{ player.hcid }}</a>)</div>
    </card-title>
    <v-card-text class="grey--text text--darken-4 d-flex flex-column">
      <div class="text-h6 mb-2">Contact info</div>
      <div class="desktop-player-card-content">
        <div v-for="(section, i) in contactDetailSections" :key="i" class="info-section d-flex">
          <div class="info-section-content">
            <div v-for="(item, itemIndex) in section.items" :key="itemIndex" class="info-section-item mb-3">
              <div class="font-weight-medium">{{ item.label }}</div>
              <div class="text-break">{{ getPlayerField(item.field) }}</div>
            </div>
          </div>
        </div>
      </div>
      <v-divider class="my-4"/>
      <div>
        <v-tabs v-model="historyTab">
          <v-tab key="history">History</v-tab>
          <v-tab key="suspensions">
            <div class="d-flex align-center">
              Suspensions
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="ml-1" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                </template>
                <span>Allow 48 hours for record updates to be reflected</span>
              </v-tooltip>
            </div>
          </v-tab>
        </v-tabs>
      </div>
      <div class="history-tables d-flex flex-grow-1 flex-column">
        <v-tabs-items v-model="historyTab">
          <v-tab-item key="history">
            <v-data-table
              :headers="historyHeaders"
              :items="player.stats.slice(1)"
              :items-per-page=-1
              :value="selectedHistory"
              item-key="season"
              sort-by="season"
              :sort-desc="true"
              fixed-header
              hide-default-footer
              dense
              single-select
              class="mt-2 text-no-wrap text-truncate"
            >
              <template v-slot:[`item.season`]="{ item }">
                <router-link :to="{ query: { ...$route.query, season: item.season } }" v-text="item.season" class="text-decoration-none font-weight-medium"/>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item key="suspensions">
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
          </v-tab-item>
        </v-tabs-items>
      </div>
      <v-divider class="mt-6 mb-4"/>
      <div class="text-h6 mb-2 d-flex">
        <span v-if="selectedHistory.length > 0">{{ selectedHistory[0].season }} Evaluation</span>
        <v-spacer/>
        <div class="mb-2 text-subtitle-1">
          <span class="font-weight-medium">Total score:</span>
          {{ selectedHistory[0].evaluation.total }}
        </div>
      </div>
      <div v-if="selectedHistory.length > 0" class="d-flex flex-grow-1 flex-column">
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
      <div v-else class="evaluation-default-text d-flex flex-grow-1 align-center justify-center">
        No previous evaluations
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import CardTitle from '@/components/CardTitle.vue'
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

@Component({ components: { CardTitle } })
export default class RosterPlayerCard extends Vue {
  name = 'RosterPlayerCard'

  @Prop({ type: Object, required: false }) player?: Player

  historyTab: number | null = null

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
    { text: 'Season', value: 'season' },
    { text: 'Team', value: 'team' },
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
.desktop-player-card {
  .v-card__text {
    height: 100%;
  }

  &-content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 16px;

    .info-section {

      &-content {
        width: 100%;
      }

      &-item {
        display: grid;
        grid-template-columns: 86px auto;
        column-gap: 8px;
        width: 100%;
      }
    }
  }

  .evaluation {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    column-gap: 16px;
  }

  .history-tables {
    .v-data-table__wrapper {
      max-height: 194px;
    }
  }
}
</style>
