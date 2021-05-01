<template>
  <div class="roster d-flex">
    <div v-if="this.teamName !== undefined" class="roster-content" :class="{ 'roster-content-grid': isPlayerSelected, 'd-flex flex-column': !isPlayerSelected }">
      <v-card v-if="this.teamName !== undefined" outlined class="roster-card d-flex flex-column">
        <card-title :title="teamName">
          <v-btn text color="primary" class="export-btn pa-1">
            <v-icon>mdi-file-download</v-icon>
            <div class="mt-1">Export</div>
          </v-btn>
        </card-title>
        <v-card-text class="d-flex flex-column">
          <div>
            <span class="font-weight-bold">Roster status:</span>
            {{this.rosterStatus}}
          </div>

          <v-data-table
            :headers="headers"
            :items="players"
            :items-per-page=20
            :value="selectedPlayers"
            fixed-header
            hide-default-footer
            dense
            single-select
            class="mt-2"
          >
            <template v-slot:[`item.name`]="{ item }">
              <router-link :to="{ query: { ...$route.query, player: item.id } }" v-text="item.name" class="text-uppercase text-decoration-none font-weight-medium"/>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-card v-if="isPlayerSelected" outlined class="player-card d-flex flex-column mt-2">
        <card-title title="Player details"/>
      </v-card>
    </div>
    <div v-else class="default-text d-flex align-center justify-center">
      No team selected
    </div>
  </div>
</template>

<script lang="ts">
import CardTitle from '@/components/CardTitle.vue'
import { defaultItems } from '@/components/SelectionBox.vue'
import faker from 'faker'
import Vue from 'vue'
import Component from 'vue-class-component'
import { DataTableHeader } from 'vuetify'

interface Player {
  id: string
  name: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  penaltyMinutes: number
}

@Component({ components: { CardTitle } })
export default class RosterView extends Vue {
  name = 'Roster'
  rosterStatus = 'Approved'
  headers: DataTableHeader[] = [
    {
      text: 'Name',
      value: 'name'
    },
    {
      text: 'GP',
      value: 'gamesPlayed',
      align: 'end'
    },
    {
      text: 'G',
      value: 'goals',
      align: 'end'
    },
    {
      text: 'A',
      value: 'assists',
      align: 'end'
    },
    {
      text: 'A',
      value: 'assists',
      align: 'end'
    },
    {
      text: 'P',
      value: 'points',
      align: 'end'
    },
    {
      text: 'PM',
      value: 'penaltyMinutes',
      align: 'end'
    }
  ]

  players: Player[] = Array(20).fill(0).map((_, i) => ({
    id: `${i}`,
    name: `${faker.name.lastName()}, ${faker.name.firstName()}`,
    gamesPlayed: faker.datatype.number(20),
    goals: faker.datatype.number(20),
    assists: faker.datatype.number(20),
    points: faker.datatype.number(20),
    penaltyMinutes: faker.datatype.number(5)
  }))

  get hasRosterData (): boolean {
    return this.players.length > 0
  }

  get isPlayerSelected (): boolean {
    return this.selectedPlayers.length > 0
  }

  get teamName (): string | undefined {
    return defaultItems.team.find(({ value }) => value === this.$route.query.team)?.text
  }

  get selectedPlayers (): Player[] {
    const playerId = this.$route.query.player
    const player = this.players.find(({ id }) => id === playerId)
    return player ? [player] : []
  }
}
</script>

<style lang="scss">
.roster {
  display: flex;
  padding: 8px;
  width: 100%;

  &-content {
    width: 100%;

    &.roster-content-grid {
      display: grid;
      grid-template-rows: 1fr 1fr;

      .v-data-table {
        overflow: hidden;

        &__wrapper {
          max-height: 100%;
          overflow-y: auto;
        }
      }
    }
  }

  &-card {
    overflow: hidden;
    height: 100%;

    .v-card__text {
      overflow: hidden;
    }

    .export-btn {
      &.v-btn {
        height: auto;
        min-width: auto;

        .v-btn__content {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }

  .default-text {
    width: 100%;
  }
}
</style>
