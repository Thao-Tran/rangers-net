<template>
  <v-container class="roster" :class="{ mobile: $vuetify.breakpoint.mobile, 'd-flex': !$vuetify.breakpoint.mobile }">
    <div v-if="this.teamName !== undefined" class="roster-content d-flex flex-column align-center">
      <v-card v-if="this.teamName !== undefined" outlined class="roster-card d-flex flex-column flex-grow-1">
        <card-title :title="teamName">
          <mobile-roster-download-dialog v-if="$vuetify.breakpoint.mobile"/>
          <desktop-roster-download-dialog v-else/>
          <v-spacer/>
          <div class="grey--text text--darken-4 subtitle-1">
            <span class="font-weight-bold">Roster status:</span>
            {{this.rosterStatus}}
          </div>
        </card-title>
        <v-card-text class="d-flex flex-column">
          <v-data-table
            v-if="$vuetify.breakpoint.mdAndUp"
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
          <v-list v-else class="roster-list d-flex flex-column flex-grow-1">
            <v-list-item-group :value="selectedPlayers">
              <v-list-item
                v-for="player in roster"
                :key="player.id"
                @click="$router.push({ query: { ...$route.query, player: player.id, season: undefined } })"
              >
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center">
                    <span class="mr-2">{{ player.name }}</span>
                    <goalie-indicator v-if="player.stats[0].position === 'Goalie'"/>
                  </v-list-item-title>
                  <v-list-item-subtitle class="player-stats">
                    <div v-for="(item, itemIndex) in rosterHeaders.slice(1)" :key="itemIndex" class="d-flex mr-4">
                      <div class="font-weight-bold">{{ item.text }}</div>
                      <div class="ml-2">{{ player[item.value] }}</div>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-icon color="primary">mdi-chevron-right</v-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
      <desktop-roster-player-card v-if="!$vuetify.breakpoint.mobile && player" :player="player"/>
    </div>
    <div v-else class="default-text d-flex align-center justify-center">
      <v-dialog v-if="$vuetify.breakpoint.mobile">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" color="primary" text>Select a team</v-btn>
        </template>
        <v-card>
          <selection-box/>
        </v-card>
      </v-dialog>
      <div v-else>No team selected</div>
    </div>
    <v-dialog v-if="$vuetify.breakpoint.mobile" :value="player" fullscreen>
      <mobile-roster-player-card :player="player"/>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import CardTitle from '@/components/CardTitle.vue'
import GoalieIndicator from '@/components/GoalieIndicator.vue'
import DesktopRosterDownloadDialog from '@/components/roster-download-dialog/Desktop.vue'
import MobileRosterDownloadDialog from '@/components/roster-download-dialog/Mobile.vue'
import DesktopRosterPlayerCard from '@/components/roster-player-card/DesktopRosterPlayerCard.vue'
import MobileRosterPlayerCard from '@/components/roster-player-card/MobileRosterPlayerCard.vue'
import SelectionBox from '@/components/SelectionBox.vue'
import { getPlayers, Player } from '@/utils/players'
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

const components = {
  CardTitle,
  GoalieIndicator,
  DesktopRosterDownloadDialog,
  MobileRosterDownloadDialog,
  DesktopRosterPlayerCard,
  MobileRosterPlayerCard,
  SelectionBox
}

@Component({ components })
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

  players: Player[] = []

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

  get player (): Player | undefined {
    return this.selectedPlayers.length > 0 ? this.selectedPlayers[0] : undefined
  }

  created () {
    this.$store.commit('getLeagues')
  }

  mounted () {
    this.players = this.getPlayers()
  }

  beforeDestroy () {
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

    return players.sort(({ name: a }, { name: b }) => {
      if (a === b) {
        return 0
      }

      return a > b ? 1 : -1
    })
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

  &.mobile {
    overflow: visible;
    height: auto;
    padding: 0;

    .v-card__text {
      overflow: visible;
      height: auto;
    }

    .roster-card {
      margin: 8px;
    }

    .roster-list {
      .player-stats {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      }
    }
  }

  &:not(.mobile) {
    padding: 8px;

    .v-card {
      max-width: 1080px;
      width: 100%;
    }

    .roster-card {
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

    .default-text {
      width: 100%;
    }
  }
}
</style>
