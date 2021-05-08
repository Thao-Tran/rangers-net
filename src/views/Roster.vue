<template>
  <div class="roster d-flex">
    <div v-if="this.teamName !== undefined" class="roster-content d-flex flex-column">
      <v-card v-if="this.teamName !== undefined" outlined class="roster-card d-flex flex-column flex-grow-1">
        <card-title :title="teamName">
          <v-dialog v-model="isDownloadDialogVisible" max-width="850px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon color="primary" class="ml-2 pa-1" title="Download roster" v-bind="attrs" v-on="on">
                <v-icon>mdi-cloud-download</v-icon>
              </v-btn>
            </template>
            <v-card class="pa-2">
              <v-card-title>Roster download</v-card-title>
              <v-card-text class="text-subtitle-1 grey--text text--darken-4">
                <v-tabs v-model="downloadDialogTab">
                  <v-tab key="request">Request</v-tab>
                  <v-tab key="history">History</v-tab>
                </v-tabs>
                <v-tabs-items v-model="downloadDialogTab">
                  <v-tab-item key="request">
                    <div class="mt-4 font-weight-medium">Type</div>
                    <v-radio-group v-model="downloadOption" mandatory>
                      <v-radio key="official">
                        <template v-slot:label>
                          <span class="grey--text text--darken-4">
                            Hockey Canada Official Roster
                          </span>
                          <v-tooltip right max-width="150px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small v-bind="attrs" v-on="on" class="pa-1">mdi-information-outline</v-icon>
                            </template>
                            <span>This is the document you will require for tournaments, exhibition games, etc.</span>
                          </v-tooltip>
                        </template>
                      </v-radio>
                      <v-radio key="excel">
                        <template v-slot:label>
                          <span class="grey--text text--darken-4">
                            Excel
                          </span>
                          <v-tooltip right max-width="150px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small v-bind="attrs" v-on="on" class="pa-1">mdi-information-outline</v-icon>
                            </template>
                            <span>This document is an Excel file with the team's stats and contact information.</span>
                          </v-tooltip>
                        </template>
                      </v-radio>
                    </v-radio-group>
                    <div class="mb-3 font-weight-medium">Recipients</div>
                    <v-data-table
                      :headers="recipientHeaders"
                      :items="recipients"
                      :items-per-page=-1
                      :value="selectedRecipients"
                      height="160px"
                      sort-by="name"
                      fixed-header
                      hide-default-footer
                      dense
                      show-select
                      class="mt-2"
                    />
                  </v-tab-item>
                  <v-tab-item key="history">
                    <v-data-table
                      :headers="requestHistoryHeaders"
                      :items="rosterRequests"
                      :items-per-page=-1
                      height="320px"
                      sort-by="time"
                      fixed-header
                      hide-default-footer
                      dense
                      class="mt-2"
                    >
                      <template v-slot:[`item.completed`]="{ item }">
                        <v-icon v-if="item.completed">mdi-check</v-icon>
                      </template>
                      <template v-slot:[`item.downloadLink`]>
                        <a>Download</a>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn text @click="isDownloadDialogVisible = false" color="secondary">Close</v-btn>
                <v-btn v-if="downloadDialogTab === 0" text @click="isDownloadDialogVisible = false" color="primary">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer/>
          <div class="grey--text text--darken-4 subtitle-1">
            <span class="font-weight-bold">Roster status:</span>
            {{this.rosterStatus}}
          </div>
        </card-title>
        <v-card-text class="d-flex flex-column">
          <v-data-table
            :headers="rosterHeaders"
            :items="roster"
            :items-per-page=-1
            :value="selectedPlayers"
            sort-by="name"
            fixed-header
            hide-default-footer
            dense
            single-select
            class="roster-table mt-2 d-flex flex-column"
          >
            <template v-slot:[`item.name`]="{ item }">
              <div class="d-flex align-center">
                <router-link
                  :to="{ query: { ...$route.query, player: item.id, season: undefined } }"
                  v-text="item.name"
                  class="text-uppercase text-decoration-none font-weight-medium"
                />
                <v-spacer/>
                <goalie-indicator v-if="item.position === 'Goalie'"/>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-card v-if="player !== undefined" outlined class="player-card d-flex flex-column flex-grow-1 mt-2">
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
          <div class="text-h6 mb-2">
            <span v-if="selectedHistory.length > 0">{{ selectedHistory[0].season }} </span>
            Evaluation
          </div>
          <div v-if="selectedHistory.length > 0" class="d-flex flex-grow-1 flex-column">
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
import GoalieIndicator from '@/components/GoalieIndicator.vue'
import { getPlayers, Player } from '@/utils/players'
import { getEvaluationCategories } from '@/utils/evaluations'
import faker from 'faker'
import _ from 'lodash'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'
import { Team } from '@/utils/teams'
import { Position, Stats } from '@/utils/stats'
import { League } from '@/utils/leagues'

interface PlayerRosterData extends Player, Stats {}

interface RosterRequest {
  type: string
  time: string
  requester: string
  completed: boolean
  status: string
  downloadLink: string
}
interface Admin {
  id: string
  name: string
  role: string
  email: string
}

interface PlayerDetailSection {
  items: Array<{label: string, field: string}>
}

@Component({ components: { CardTitle, GoalieIndicator } })
export default class RosterView extends Vue {
  name = 'Roster'
  rosterStatus = 'Approved'
  rosterHeaders: DataTableHeader[] = [
    { text: 'Name', value: 'name' },
    { text: 'GP', value: 'gamesPlayed', align: 'end' },
    { text: 'G', value: 'goals', align: 'end' },
    { text: 'A', value: 'assists', align: 'end' },
    { text: 'P', value: 'points', align: 'end' },
    { text: 'PM', value: 'penaltyMinutes', align: 'end' }
  ]

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

  recipientHeaders: DataTableHeader[] = [
    { text: 'Name', value: 'name' },
    { text: 'Role', value: 'role' },
    { text: 'Email', value: 'email' }
  ]

  requestHistoryHeaders: DataTableHeader[] = [
    { text: 'Type', value: 'type' },
    { text: 'Requested on', value: 'time' },
    { text: 'Requested by', value: 'requester' },
    { text: 'Completed', value: 'completed', align: 'center' },
    { text: 'Status', value: 'status' },
    { text: 'Download', value: 'downloadLink' }
  ]

  evaluationDetailSection = {
    items: getEvaluationCategories()
  }

  players: Player[] = this.getPlayers()
  historyTab: number | null = null

  downloadDialogTab: number | null = null
  downloadOption: number | null = null
  isDownloadDialogVisible = false

  selectedRecipients: Admin[] = []
  recipients: Admin[] = Array(faker.datatype.number(6)).fill({}).map((_value, i): Admin => {
    const lastName = faker.name.lastName()
    const firstName = faker.name.firstName()
    return {
      id: i.toString(),
      name: `${lastName}, ${firstName}`,
      role: faker.random.arrayElement(['Coach', 'Assistant Coach', 'Trainer', 'Admin Manager']),
      email: faker.internet.email(firstName, lastName, 'gmail.com')
    }
  })

  rosterRequests: RosterRequest[] = Array(faker.datatype.number(6)).fill({}).map((): RosterRequest => {
    return {
      type: faker.random.arrayElement(['Official', 'Excel']),
      // @ts-ignore: timeStyle does not exist in type 'DateTimeFormatOptions'
      time: faker.date.recent().toLocaleString(undefined, { timeStyle: 'short', dateStyle: 'short' }),
      requester: faker.internet.email(),
      completed: faker.datatype.boolean(),
      status: faker.random.arrayElement(['Pending', 'Sent']),
      downloadLink: ''
    }
  })

  get team (): Team | undefined {
    const league = (this.$store.state.leagues as League[]).find(({ id }) => id === this.$route.query.league)
    const division = league?.divisions.find(({ id }) => id === this.$route.query.division)
    const subDivision = division?.subDivisions.find(({ id }) => id === this.$route.query.subDivision)
    return subDivision?.teams.find(({ id }) => id === this.$route.query.team)
  }

  get roster (): PlayerRosterData[] {
    return this.players.map((player) => {
      return { ...player, ...player.stats[0] }
    })
  }

  get hasRosterData (): boolean {
    return this.players.length > 0
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

  get selectedHistory (): Stats[] {
    const player = this.selectedPlayers[0]
    const season = this.$route.query.season
    const selectedHistory = player?.stats.filter((history) => history.season === season) ?? []

    if (selectedHistory.length > 0) {
      return selectedHistory
    }

    const latestHistory = player?.stats.sort(({ season: seasonA }, { season: seasonB }) => {
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

  beforeDestroy () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { player, season, ...query } = this.$route.query
    this.$router.replace({ query })
  }

  getPlayers (): Player[] {
    const players = getPlayers(this.teamName ?? '')

    const goalieIndex = faker.datatype.number(19)
    players[goalieIndex].stats = players[goalieIndex].stats.map((stats) => ({ ...stats, position: Position.Goalie }))

    return players
  }

  getPlayerField (field: string): string | number {
    return _.get(this.player, field)
  }

  @Watch('teamName')
  updatePlayers (): void {
    this.players = this.getPlayers()
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

    .roster-table {
      max-height: calc(100% - 8px);
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

    .history-tables {
      .v-data-table__wrapper {
        max-height: 194px;
      }
    }
  }

  .default-text {
    width: 100%;
  }
}
</style>
