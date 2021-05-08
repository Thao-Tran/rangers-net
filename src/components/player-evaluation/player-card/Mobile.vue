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
    <div class="player-card-content">
      <v-card-text class="d-flex grey--text text--darken-4 flex-grow-1">
        <v-tabs-items v-model="tab">
          <v-tab-item key=0>
            <div class="current-stats d-flex flex-column flex-grow-1">
              <div class="subtitle-1 mb-4 d-flex align-center">
                <span class="font-weight-medium mr-1">Total score:</span>
                {{ playerCurrentTotal }}
              </div>
              <div class="stats d-flex justify-space-around">
                <div v-for="{ text, value } in stats" :key="value" class="d-flex flex-column align-center">
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
                    <v-tooltip right open-on-click>
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
          </v-tab-item>
          <v-tab-item key=1>
            <div class="prev-stats d-flex flex-column flex-grow-1">
              <div class="subtitle-1 mb-4 d-flex align-center">
                  <span class="font-weight-medium mr-1">Total score:</span>
                  {{ playerPrevTotal }}
              </div>
              <div v-if="playerPrevEvaluation" class="prev-stats d-flex flex-column">
                <div class="stats d-flex justify-space-around">
                  <div v-for="{ text, value } in stats" :key="value" class="d-flex flex-column align-center">
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
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-btn
        :disabled="!unsavedChanges"
        absolute
        fab
        right
        dark
        color="primary"
        class="save-btn"
        @click="unsavedChanges = false"
      >
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import Tabs, { AppBarItem } from '@/components/app-bar/Tabs.vue'
import CardTitle from '@/components/CardTitle.vue'
import { Evaluation, getEvaluationCategories } from '@/utils/evaluations'
import { Player } from '@/utils/players'
import { Position } from '@/utils/stats'
import _ from 'lodash-es'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'

@Component({ components: { CardTitle, Tabs } })
export default class PlayerEvaluationPlayerCard extends Vue {
  name = 'MobilePlayerCard'

  @Prop({ type: Object, required: false }) player?: Player

  tab = 0

  tabItems: AppBarItem[] = [{ title: 'Current' }, { title: 'Last year' }]

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

  getProperty (data: any, property: string, defaultValue?: any): any {
    return _.get(data, property, defaultValue)
  }

  onEvaluationUpdate (value: string, field: string) {
    this.unsavedChanges = true
    this.$emit('change', { value, field })
  }
}
</script>

<style lang="scss">
.mobile-player-card {
  height: 100%;
  max-height: 100%;

  .player-card-content {
    padding-top: 104px;
    max-height: 100%;
    overflow-y: auto;
  }

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

  .save-btn {
    bottom: 8px;
  }
}
</style>
