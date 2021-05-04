<template>
  <div class="roster d-flex">
    <div v-if="this.teamName !== undefined" class="roster-content" :class="{ 'roster-content-grid': isPlayerSelected, 'd-flex flex-column': !isPlayerSelected }">
      <v-card v-if="this.teamName !== undefined" outlined class="roster-card d-flex flex-column">
        <card-title :title="teamName">
          <v-btn icon color="primary" class="ml-2 pa-1" title="Export roster">
            <v-icon>mdi-cloud-download</v-icon>
          </v-btn>
        </card-title>
        <v-card-text class="d-flex flex-column">
          <div>
            <span class="font-weight-bold">Roster status:</span>
            {{this.rosterStatus}}
          </div>

          <v-data-table
            :headers="rosterHeaders"
            :items="players"
            :items-per-page=-1
            :value="selectedPlayers"
            sort-by="name"
            fixed-header
            hide-default-footer
            dense
            single-select
            class="mt-2"
          >
            <template v-slot:[`item.name`]="{ item }">
              <router-link :to="{ query: { ...$route.query, player: item.id, season: undefined } }" v-text="item.name" class="text-uppercase text-decoration-none font-weight-medium"/>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-card v-if="player !== undefined" outlined class="player-card d-flex flex-column mt-2">
        <card-title :title="player.name">
          <div class="text-h6 font-weight-regular ml-2" title="HCiD">(<a>{{ player.hcid }}</a>)</div>
        </card-title>
        <v-card-text class="grey--text text--darken-4 d-flex flex-column">
          <div class="text-h6 mb-2">Contact info</div>
          <div class="player-card-content">
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
          <div class="text-h6 mb-2">History</div>
          <v-data-table
            :headers="historyHeaders"
            :items="player.history"
            :items-per-page=-1
            :value="selectedHistory"
            :height="selectedHistory.length > 0 ? '150px' : undefined"
            item-key="season"
            sort-by="season"
            :sort-desc="true"
            fixed-header
            hide-default-footer
            dense
            single-select
            class="mt-2"
          >
            <template v-slot:[`item.season`]="{ item }">
              <router-link :to="{ query: { ...$route.query, season: item.season } }" v-text="item.season" class="text-decoration-none font-weight-medium"/>
            </template>
          </v-data-table>
          <v-divider class="mt-6 mb-4"/>
          <div class="text-h6 mb-2">
            <span v-if="selectedHistory.length > 0">{{ selectedHistory[0].season }} </span>
            Evaluation
          </div>
          <div v-if="selectedHistory.length > 0">
            <div class="mb-2">
              <span class="font-weight-bold">Total score:</span>
              {{ selectedHistory[0].evaluation.total }}
            </div>
            <div class="evaluation">
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
import _ from 'lodash'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'

interface HistoricalData {
  season: string
  team: string
  position: string
  hand: string
  rank: number
  rating: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  penaltyMinutes: number
  evaluation: Record<string, string>
}

interface Player {
  id: string
  hcid: string
  name: string
  dob: string
  phone: string
  email: string
  address: string
  position: string
  hand: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  penaltyMinutes: number
  history: HistoricalData[]
}

interface PlayerDetailSection {
  items: Array<{label: string, field: string}>
}

@Component({ components: { CardTitle } })
export default class RosterView extends Vue {
  name = 'Roster'
  rosterStatus = 'Approved'
  rosterHeaders: DataTableHeader[] = [
    {
      text: 'Name',
      value: 'name'
    },
    {
      text: 'Position',
      value: 'position'
    },
    {
      text: 'Hand',
      value: 'hand'
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

  contactDetailSections: PlayerDetailSection[] = [
    {
      items: [
        {
          label: 'Date of birth',
          field: 'dob'
        },
        {
          label: 'Phone',
          field: 'phone'
        },
        {
          label: 'Email',
          field: 'email'
        },
        {
          label: 'Address',
          field: 'address'
        }
      ]
    },
    {
      items: [
        {
          label: 'Parent name',
          field: 'parent1.name'
        },
        {
          label: 'Relationship',
          field: 'parent1.relationship'
        },
        {
          label: 'Phone',
          field: 'parent1.phone'
        },
        {
          label: 'Email',
          field: 'parent1.email'
        }
      ]
    },
    {
      items: [
        {
          label: 'Parent name',
          field: 'parent2.name'
        },
        {
          label: 'Relationship',
          field: 'parent2.relationship'
        },
        {
          label: 'Phone',
          field: 'parent2.phone'
        },
        {
          label: 'Email',
          field: 'parent2.email'
        }
      ]
    }
  ]

  historyHeaders: DataTableHeader[] = [
    {
      text: 'Season',
      value: 'season'
    },
    {
      text: 'Team',
      value: 'team'
    },
    {
      text: 'Position',
      value: 'position'
    },
    {
      text: 'Hand',
      value: 'hand'
    },
    {
      text: 'Rank',
      value: 'rank',
      align: 'end'
    },
    {
      text: 'Rating',
      value: 'rating',
      align: 'end'
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

  evaluationDetailSection = {
    items: [
      { label: 'Agility', field: 'agility' },
      { label: 'Angles', field: 'angles' },
      { label: 'Team Play', field: 'teamPlay' },
      { label: 'Glove', field: 'glove' },
      { label: 'Challenge', field: 'challenge' },
      { label: 'Effectiveness', field: 'effectiveness' },
      { label: 'Stick', field: 'stick' },
      { label: 'Clear rebounds', field: 'clearRebounds' },
      { label: 'Blocker', field: 'blocker' },
      { label: 'Puck control', field: 'puckControl' }
    ]
  }

  players: Player[] = this.getPlayerData()

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

  get selectedHistory (): HistoricalData[] {
    const playerId = this.$route.query.player
    const player = this.players.find(({ id }) => id === playerId)
    const season = this.$route.query.season
    const selectedHistory = player?.history.filter((history) => history.season === season) ?? []

    if (selectedHistory.length > 0) {
      return selectedHistory
    }

    const latestHistory = player?.history.sort(({ season: seasonA }, { season: seasonB }) => {
      if (seasonA === seasonB) {
        return 0
      }

      return seasonB > seasonA ? 1 : -1
    }).filter((_, i) => i === 0) ?? []
    return latestHistory
  }

  get player (): Player | undefined {
    return this.selectedPlayers.length > 0 ? this.selectedPlayers[0] : undefined
  }

  @Watch('$route.query.team')
  onTeamChanged (): void {
    this.players = this.getPlayerData()
  }

  getPlayerData (): Player[] {
    const players = Array(20).fill(0).map((_, i) => {
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const parent1FirstName = faker.name.firstName()
      const parent1LastName = faker.name.lastName()
      const parent2FirstName = faker.name.firstName()
      const parent2LastName = faker.name.lastName()
      const hand = faker.random.arrayElement(['L', 'R'])

      return {
        id: `${i}`,
        name: `${lastName}, ${firstName}`,
        gamesPlayed: faker.datatype.number(20),
        goals: faker.datatype.number(20),
        assists: faker.datatype.number(20),
        points: faker.datatype.number(20),
        penaltyMinutes: faker.datatype.number(5),
        position: 'Player',
        hand,
        hcid: faker.unique(faker.datatype.number, [{ min: 1000000000, max: 1000700000 }]).toString(),
        prevTeam: faker.name.lastName(),
        rank: faker.unique(faker.datatype.number, [{ max: 200 }], { maxRetries: 100 }),
        rating: `${defaultItems.subdivision.find(({ value }) => value === this.$route.query.subdivision)?.text.charAt(0) ?? ''}${faker.datatype.number({ min: 20, max: 100 })}`,
        dob: faker.datatype.datetime({ min: new Date('2003-01-01').getTime(), max: new Date('2011-01-01').getTime() }).toLocaleDateString(),
        phone: faker.phone.phoneNumber(faker.phone.phoneNumberFormat(1)),
        email: faker.internet.email(firstName, lastName, 'gmail.com'),
        address: `${faker.address.streetAddress()}, Oakville, ON`,
        parent1: {
          name: `${parent1FirstName} ${parent1LastName}`,
          relationship: 'Father',
          phone: faker.phone.phoneNumber(faker.phone.phoneNumberFormat(1)),
          email: faker.internet.email(parent1FirstName, parent1LastName, 'gmail.com')
        },
        parent2: {
          name: `${parent2FirstName} ${parent2LastName}`,
          relationship: 'Mother',
          phone: faker.phone.phoneNumber(faker.phone.phoneNumberFormat(1)),
          email: faker.internet.email(parent2FirstName, parent2LastName, 'gmail.com')
        },
        history: Array(faker.datatype.number(4)).fill({}).map((_, i): HistoricalData => {
          const evaluation = {
            agility: this.getEvaluation(),
            angles: this.getEvaluation(),
            teamPlay: this.getEvaluation(),
            glove: this.getEvaluation(),
            challenge: this.getEvaluation(),
            effectiveness: this.getEvaluation(),
            stick: this.getEvaluation(),
            clearRebounds: this.getEvaluation(),
            blocker: this.getEvaluation(),
            puckControl: this.getEvaluation()
          }

          return {
            season: `${new Date().getFullYear() - i - 1}/${new Date().getFullYear() - i - 2}`,
            team: faker.name.lastName(),
            position: 'Player',
            hand,
            rank: faker.unique(faker.datatype.number, [{ max: 200 }], { maxRetries: 100 }),
            rating: `${defaultItems.subdivision.find(({ value }) => value === this.$route.query.subdivision)?.text.charAt(0) ?? ''}${faker.datatype.number({ min: 20, max: 100 })}`,
            gamesPlayed: faker.datatype.number(20),
            goals: faker.datatype.number(20),
            assists: faker.datatype.number(20),
            points: faker.datatype.number(20),
            penaltyMinutes: faker.datatype.number(5),
            evaluation: {
              ...evaluation,
              total: Object.values(evaluation).reduce((total, value) => total + parseFloat(value), 0).toFixed(1),
              comments: faker.lorem.paragraph(6)
            }
          }
        })
      }
    })

    const goalieIndex = faker.datatype.number(20)
    players[goalieIndex].position = 'Goalie'
    players[goalieIndex].history = players[goalieIndex].history.map((history) => ({ ...history, position: 'Goalie' }))

    return players
  }

  getPlayerField (field: string): string | number {
    return _.get(this.player, field)
  }

  getEvaluation (): string {
    return (faker.datatype.number(10) + faker.random.arrayElement([0, 0.5])).toFixed(1)
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
      grid-template-rows: 1fr 2fr;

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

  .player-card {
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
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      column-gap: 16px;
    }
  }

  .default-text {
    width: 100%;
  }
}
</style>
