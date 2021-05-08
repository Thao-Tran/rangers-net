<template>
  <div class="player-evaluation d-flex flex-grow-1 pa-2">
    <div v-if="teamName !== undefined" class="player-evaluation-content d-flex flex-column flex-grow-1">
      <v-card outlined class="team-card d-flex flex-column flex-grow-1">
        <card-title :title="teamName"/>
        <v-card-subtitle class="mt-0 subtitle-1 grey--text text--darken-4">
          <span class="font-weight-medium">Team average:</span> {{ teamAverage }}
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
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
              <router-link :to="{ query: { ...$route.query, player: item.id } }" v-text="item.name" class="text-uppercase text-decoration-none font-weight-medium"/>
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
        </v-card-text>
      </v-card>
      <v-card v-if="player !== undefined" outlined class="player-card d-flex flex-column flex-grow-1 mt-2">
        <card-title :title="player.name">
          <v-btn icon color="primary" class="ml-2" @click="unsavedChanges = false" title="Save">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-tooltip v-if="unsavedChanges" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs" color="yellow darken-2">mdi-alert</v-icon>
            </template>
            <div class="unsaved-changes-tooltip">
              Click Save button to store changes. Any fields left blank will be rated as a zero and comments are mandatory.
            </div>
          </v-tooltip>
        </card-title>
        <v-card-text class="d-flex grey--text text--darken-4 flex-grow-1">
          <div class="current-stats d-flex flex-column flex-grow-1">
            <div class="text-h6 mb-4 d-flex">
              Current
              <v-spacer/>
              <div class="subtitle-1 align-center">
                <span class="font-weight-medium mr-1">Total score:</span>
                {{ playerCurrentTotal }}
              </div>
            </div>
            <div class="stats d-flex justify-space-around">
              <div v-for="{ text, value } in stats" :key="value" class="d-flex flex-column align-center mr-8">
                <div class="font-weight-bold">{{ text }}</div>
                {{ getProperty(player, value) }}
              </div>
            </div>
            <div class="evaluation mt-4">
              <v-autocomplete
                v-model="player.stats[0].position"
                :items="positionValues"
                label="Position"
                :title="player.stats[0].position || 'Position'"
                dense
                outlined
                hideDetails
                clearable
                class="text-no-wrap"
              />
              <v-autocomplete
                v-model="player.stats[0].hand"
                :items="handValues"
                label="Hand"
                :title="player.stats[0].position || 'Hand'"
                dense
                outlined
                hideDetails
                clearable
                class="text-no-wrap"
              />
              <v-autocomplete
                v-for="{ label, field, help } in evaluationCategories"
                :value="playerCurrentEvaluation[field]"
                :items="evaluationValues"
                :key="field"
                :label="label"
                :title="playerCurrentEvaluation[field] || label"
                @change="onEvaluationUpdate($event, field)"
                dense
                outlined
                hideDetails
                clearable
                class="text-no-wrap"
              >
                <template v-slot:append>
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-on="on" v-bind="attrs">mdi-help-circle-outline</v-icon>
                    </template>
                    {{ help }}
                  </v-tooltip>
                </template>
              </v-autocomplete>
            </div>
            <v-textarea
              v-model="playerCurrentEvaluation.comments"
              label="Coach's comments"
              class="comments d-flex flex-column flex-grow-1 mt-4"
              @change="onEvaluationUpdate($event, 'comments')"
              no-resize
              hideDetails
              clearable
            />
          </div>
          <v-divider vertical class="mx-4"/>
          <div class="prev-stats d-flex flex-column flex-grow-1">
            <div class="text-h6 mb-4 d-flex align-center">
              Last year
              <v-spacer/>
              <div class="subtitle-1 align-center">
                <span class="font-weight-medium mr-1">Total score:</span>
                {{ playerPrevTotal }}
              </div>
            </div>
            <div v-if="playerPrevEvaluation" class="prev-stats d-flex flex-column">
              <div class="stats d-flex justify-space-around">
                <div v-for="{ text, value } in stats" :key="value" class="d-flex flex-column align-center mr-8">
                  <div class="font-weight-bold">{{ text }}</div>
                  {{ getProperty(player, value) }}
                </div>
              </div>
              <div class="evaluation mt-4">
                <v-autocomplete
                  v-model="player.stats[1].position"
                  :items="positionValues"
                  label="Position"
                  :title="player.stats[1].position || 'Position'"
                  dense
                  outlined
                  hideDetails
                  readonly
                  class="text-no-wrap"
                />
                <v-autocomplete
                  v-model="player.stats[1].hand"
                  :items="handValues"
                  label="Hand"
                  :title="player.stats[1].position || 'Hand'"
                  dense
                  outlined
                  hideDetails
                  readonly
                  class="text-no-wrap"
                />
                <v-autocomplete
                  v-for="{ label, field } in evaluationCategories"
                  :value="playerPrevEvaluation[field]"
                  :items="evaluationValues"
                  :key="field"
                  :label="label"
                  :title="playerPrevEvaluation[field] || label"
                  readonly
                  dense
                  outlined
                  hideDetails
                  class="text-no-wrap"
                />
              </div>
              <v-textarea
                v-model="playerPrevEvaluation.comments"
                label="Coach's comments"
                class="comments d-flex flex-column flex-grow-1 mt-4"
                no-resize
                hideDetails
                readonly
              />
            </div>
            <div v-else class="d-flex flex-grow-1 align-center justify-center">
              No previous evaluation
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div v-else class="default-text d-flex flex-grow-1 align-center justify-center">
      No team selected
    </div>
  </div>
</template>

<script lang="ts">
import CardTitle from '@/components/CardTitle.vue'
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

@Component({ components: { CardTitle } })
export default class PlayerEvaluation extends Vue {
  name = 'PlayerEvaluation'
  players: Player[] = this.getPlayers()

  headers: DataTableHeader[] = [
    { text: 'Name', value: 'name' },
    { text: 'Last year', value: 'stats[1].evaluation.total', align: 'end' },
    { text: 'Current', value: 'stats[0].evaluation.total', align: 'end' },
    { text: 'Completed', value: 'stats[0].evaluation.completed', align: 'center' }
  ]

  stats: DataTableHeader[] = [
    { text: 'GP', value: 'stats[0].gamesPlayed' },
    { text: 'G', value: 'stats[0].goals' },
    { text: 'A', value: 'stats[0].assists' },
    { text: 'P', value: 'stats[0].points' },
    { text: 'PM', value: 'stats[0].penaltyMinutes' }
  ]

  evaluationCategories = getEvaluationCategories()
  evaluationValues = _.range(1, 10.5, 0.5).map(val => val.toFixed(1))

  positionValues = Object.values(Position)

  handValues = ['L', 'R']

  unsavedChanges = false

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

  beforeDestroy () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { player, ...query } = this.$route.query
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

  onEvaluationUpdate (value: string, field: string): void {
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

    this.unsavedChanges = true
  }
}
</script>

<style lang="scss">
.player-evaluation {
  overflow: hidden;

  .v-card {
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

  .player-card {
    height: 100%;
    max-height: 100%;

    .evaluation {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .comments {
      overflow: hidden;
      max-height: calc(100% - 28px);

      .v-input {
        &__control {
          max-height: 100%;
          height: 100%;
        }

        &__slot {
          max-height: 100%;
          height: 100%;

          .v-text-field__slot {
            max-height: 100%;
            height: 100%;

            textarea {
              height: 100%;
            }
          }
        }
      }
    }

    .current-stats {
      width: 100%;
      overflow: hidden;
    }

    .prev-stats {
      width: 100%;
      overflow: hidden;

      .evaluation-value {
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 8px;
      }
    }
  }
}

.unsaved-changes-tooltip {
  max-width: 150px;
}
</style>
