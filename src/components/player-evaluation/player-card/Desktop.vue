<template>
  <v-card outlined class="desktop-player-card d-flex flex-column flex-grow-1 mt-2">
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
</template>

<script lang="ts">
import CardTitle from '@/components/CardTitle.vue'
import { Evaluation, getEvaluationCategories } from '@/utils/evaluations'
import { Player } from '@/utils/players'
import { Position } from '@/utils/stats'
import _ from 'lodash-es'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'

@Component({ components: { CardTitle } })
export default class PlayerEvaluationPlayerCard extends Vue {
  name = 'RosterPlayerCard'

  @Prop({ type: Object, required: false }) player?: Player

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
.desktop-player-card {
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
</style>
