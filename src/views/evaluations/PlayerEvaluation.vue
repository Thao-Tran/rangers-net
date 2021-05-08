<template>
  <div class="player-evaluation flex-grow-1 pa-2" :class="{ mobile: $vuetify.breakpoint.mobile, 'd-flex': !$vuetify.breakpoint.mobile }">
    <div v-if="teamName !== undefined" class="player-evaluation-content d-flex flex-column align-center flex-grow-1">
      <v-card outlined class="team-card d-flex flex-column flex-grow-1">
        <card-title :title="teamName">
          <v-spacer/>
          <div class="subtitle-1 grey--text text--darken-4">
            <span class="font-weight-medium">Team average:</span> {{ teamAverage }}
          </div>
        </card-title>
        <v-card-text>
          <v-data-table
            v-if="!$vuetify.breakpoint.mobile"
            :headers="headers"
            :items="players"
            :items-per-page=-1
            :value="selectedPlayers"
            item-key="hcid"
            sort-by="name"
            fixed-header
            hide-default-footer
            dense
            class="roster-table d-flex flex-column flex-grow-1"
          >
            <template v-slot:[`item.name`]="{ item }">
              <div class="d-flex align-center">
                <router-link :to="{ query: { ...$route.query, player: item.id } }" v-text="item.name" class="text-uppercase text-decoration-none font-weight-medium"/>
                <v-spacer/>
                <goalie-indicator v-if="item.stats[0].position === 'Goalie'"/>
              </div>
            </template>
            <template v-slot:[`item.stats[1].evaluation.total`]="{ value }">
              <div v-if="value !== undefined">{{ value }}</div>
              <div v-else class="empty-value-cell d-flex justify-end">
                <div class="empty-value grey darken-4"/>
              </div>
            </template>
            <template v-slot:[`item.stats[0].evaluation.total`]="{ value }">
              <div v-if="value !== undefined">{{ value }}</div>
              <div v-else class="empty-value-cell d-flex justify-end">
                <div class="empty-value grey darken-4"/>
              </div>
            </template>
            <template v-slot:[`item.stats[0].evaluation.completed`]="{ value }">
              <v-icon v-if="value" class="green--text">mdi-check</v-icon>
              <div v-else class="red--text font-weight-bold">X</div>
            </template>
          </v-data-table>
          <v-list v-else class="d-flex flex-column flex-grow-1">
            <v-list-item-group :value="selectedPlayers">
              <v-list-item
                v-for="player in players"
                :key="player.id"
                @click="$router.push({ query: { ...$route.query, player: player.id, season: undefined } })"
              >
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center">
                    <span class="mr-2">{{ player.name }}</span>
                    <goalie-indicator v-if="player.stats[0].position === 'Goalie'"/>
                  </v-list-item-title>
                  <v-list-item-subtitle class="d-flex align-center">
                    <div>
                      <span class="font-weight-medium mr-1">Current:</span>
                      {{ getProperty(player, 'stats[0].evaluation.total', '0.0') }}
                    </div>
                    <div class="ml-4">
                      <span class="font-weight-medium mr-1">Previous:</span>
                      {{ getProperty(player, 'stats[1].evaluation.total', 'N/A') }}
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-icon v-if="getProperty(player, 'stats[0].evaluation.completed', false)" class="green--text">mdi-check</v-icon>
                <div v-else class="red--text font-weight-bold px-2">X</div>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
      <desktop-player-card
        v-if="player !== undefined && !$vuetify.breakpoint.mobile"
        :player="player"
        @change="onEvaluationUpdate"
      />
    </div>
    <div v-else class="default-text d-flex flex-grow-1 align-center justify-center">
      No team selected
    </div>
    <v-dialog v-if="$vuetify.breakpoint.mobile" :value="player" fullscreen>
      <mobile-player-card :player="player" @change="onEvaluationUpdate"/>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import CardTitle from '@/components/CardTitle.vue'
import GoalieIndicator from '@/components/GoalieIndicator.vue'
import DesktopPlayerCard from '@/components/player-evaluation/player-card/Desktop.vue'
import MobilePlayerCard from '@/components/player-evaluation/player-card/Mobile.vue'
import { Evaluation, getEvaluationCategories } from '@/utils/evaluations'
import { League } from '@/utils/leagues'
import { getPlayers, Player } from '@/utils/players'
import { Position } from '@/utils/stats'
import { Team } from '@/utils/teams'
import faker from 'faker'
import _ from 'lodash-es'
import Vue from 'vue'
import Component from 'vue-class-component'
import { DataTableHeader } from 'vuetify'

@Component({ components: { CardTitle, GoalieIndicator, DesktopPlayerCard, MobilePlayerCard } })
export default class PlayerEvaluation extends Vue {
  name = 'PlayerEvaluation'

  players: Player[] = this.getPlayers()
  evaluationCategories = getEvaluationCategories()

  headers: DataTableHeader[] = [
    { text: 'Name', value: 'name' },
    { text: 'Last year', value: 'stats[1].evaluation.total', align: 'end' },
    { text: 'Current', value: 'stats[0].evaluation.total', align: 'end' },
    { text: 'Completed', value: 'stats[0].evaluation.completed', align: 'center' }
  ]

  get team (): Team | undefined {
    const league = (this.$store.state.leagues as League[]).find(({ id }) => id === this.$route.query.league)
    const division = league?.divisions.find(({ id }) => id === this.$route.query.division)
    const subDivision = division?.subDivisions.find(({ id }) => id === this.$route.query.subDivision)
    return subDivision?.teams.find(({ id }) => id === this.$route.query.team)
  }

  get isPlayerSelected (): boolean {
    return this.selectedPlayers.length > 0
  }

  get teamName (): string | undefined {
    return this.team?.name
  }

  get selectedPlayers (): Player[] {
    const playerId = this.$route.query.player
    const player = this.players.find(({ id }) => id === playerId)
    return player ? [player] : []
  }

  get player (): Player | undefined {
    return this.selectedPlayers[0]
  }

  get teamAverage (): string {
    const total = this.players.reduce((total, { stats }) => {
      const currentPlayerTotal = stats[0]?.evaluation.total
      return total + (_.isNil(currentPlayerTotal) ? 0 : parseFloat(currentPlayerTotal))
    }, 0)
    return (total / this.players.length).toFixed(2)
  }

  get playerCurrentEvaluation (): Evaluation | Partial<Evaluation> {
    return this.player?.stats?.[0].evaluation ?? {}
  }

  get playerCurrentTotal (): string {
    return this.playerCurrentEvaluation?.total ?? '0.0'
  }

  get playerPrevEvaluation (): Evaluation | undefined {
    return this.player?.stats?.[1]?.evaluation
  }

  get playerPrevTotal (): string {
    return this.playerPrevEvaluation?.total ?? 'N/A'
  }

  created () {
    this.$store.commit('getLeagues')
  }

  beforeDestroy () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { player, ...query } = this.$route.query

    if (_.isNil(player)) {
      return
    }

    this.$router.replace({ query })
  }

  getPlayers (): Player[] {
    const players = getPlayers(this.teamName ?? '')

    const goalieIndex = faker.datatype.number(19)
    players[goalieIndex].stats = players[goalieIndex].stats.map((stats) => ({ ...stats, position: Position.Goalie }))

    faker.random.arrayElements(players, faker.datatype.number({ min: 5, max: 15 })).forEach((player) => {
      player.stats[0].evaluation = {}
    })

    return players
  }

  getProperty (data: any, property: string, defaultValue?: any): any {
    return _.get(data, property, defaultValue)
  }

  onEvaluationUpdate ({ value, field }: { value: string, field: string }): void {
    if (this.playerCurrentEvaluation === undefined) {
      return
    }

    Vue.set(this.playerCurrentEvaluation, field, value)

    const { total, completed } = this.evaluationCategories.reduce(({ total, completed }, { field }) => {
      const value = parseInt(this.playerCurrentEvaluation![field])
      const valueNotFilled = _.isNaN(value) || value === 0
      return { total: total + (_.isNaN(value) ? 0 : value), completed: completed && !valueNotFilled }
    }, { total: 0, completed: true })

    Vue.set(this.playerCurrentEvaluation, 'total', total.toFixed(1))
    Vue.set(this.playerCurrentEvaluation, 'completed', completed && !_.isEmpty(this.playerCurrentEvaluation.comments))
  }
}
</script>

<style lang="scss">
.player-evaluation {
  overflow: hidden;

  .v-card {
    max-width: 1080px;
    width: 100%;
    overflow: hidden;

    .v-card__text {
      overflow: hidden;
    }
  }

  .roster-table {
    overflow: hidden;
    max-height: 100%;

    .empty-value-cell {
      width: 100%;

      .empty-value {
        height: 1px;
        width: 16px;
      }
    }
  }

  &.mobile {
    overflow: visible;
    height: auto;
    padding: 0;

    .v-card__text {
      overflow: visible;
      height: auto;
    }

    .team-card {
      margin: 8px;
    }
  }
}

.unsaved-changes-tooltip {
  max-width: 150px;
}
</style>
