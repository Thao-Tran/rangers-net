<template>
  <div class="roster">
    <v-card v-if="this.teamName !== undefined" outlined class="roster-card">
      <v-card-title>
        <div class="primary--text">
          {{ teamName }}
          <div class="secondary roster-card-title-underline"></div>
        </div>
        <v-spacer/>
        <v-btn outlined color="primary pa-2">
          <v-icon>mdi-file-download</v-icon>
          <div class="mx-1">Export</div>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <span class="font-weight-bold">Roster status:</span>
        {{this.rosterStatus}}

        <v-data-table
          :headers="headers"
          :items="players"
          :items-per-page=20
          :value="selectedPlayers"
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
    <div v-else class="default-text d-flex align-center justify-center">
      No team selected
    </div>
  </div>
</template>

<script lang="ts">
import { defaultItems } from '@/components/SelectionBox.vue'
import faker from 'faker'
import Vue from 'vue'
import Component from 'vue-class-component'

interface Player {
  id: string
  name: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  penaltyMinutes: number
}

@Component
export default class RosterView extends Vue {
  name = 'Roster'
  rosterStatus = 'Approved'
  headers = [
    {
      text: 'Name',
      value: 'name'
    },
    {
      text: 'GP',
      value: 'gamesPlayed'
    },
    {
      text: 'G',
      value: 'goals'
    },
    {
      text: 'A',
      value: 'assists'
    },
    {
      text: 'A',
      value: 'assists'
    },
    {
      text: 'P',
      value: 'points'
    },
    {
      text: 'PM',
      value: 'penaltyMinutes'
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
  height: 100%;

  &-card {
    display: flex;
    flex-direction: column;
    width: 100%;

    &-title-underline {
      width: 100%;
      height: 2px;
    }
  }

  .default-text {
    width: 100%;
  }

  .no-data {
    height: 100%;
  }
}
</style>
