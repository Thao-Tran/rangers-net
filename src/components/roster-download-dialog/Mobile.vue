<template>
  <v-dialog v-model="isVisible" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon color="primary" class="ml-2 pa-1" title="Download roster" v-bind="attrs" v-on="on">
        <v-icon>mdi-cloud-download</v-icon>
      </v-btn>
    </template>
    <v-card class="d-flex">
      <v-toolbar
        absolute
        dark
        flat
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="isVisible = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Roster download</v-toolbar-title>
        <v-spacer/>
        <template v-slot:extension>
          <tabs v-model="tab" :items="tabItems" alignWithTitle/>
        </template>
      </v-toolbar>
      <div class="roster-download-content">
        <v-card-text class="text-subtitle-1 grey--text text--darken-4 mb-4">
          <v-tabs-items v-model="tab">
            <v-tab-item key="request">
              <div class="mt-4 font-weight-medium">Type</div>
              <v-radio-group v-model="downloadOption" mandatory>
                <v-radio key="official">
                  <template v-slot:label>
                    <span class="grey--text text--darken-4">
                      Hockey Canada Official Roster
                    </span>
                  </template>
                </v-radio>
                <v-radio key="excel">
                  <template v-slot:label>
                    <span class="grey--text text--darken-4">
                      Excel
                    </span>
                  </template>
                </v-radio>
              </v-radio-group>
              <div class="mb-3 font-weight-medium">Recipients</div>
              <v-list-item-group v-model="selectedRecipients" multiple>
                <v-list-item v-for="(recipient, index) in recipients" :key="index">
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active" color="primary"/>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ recipient.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ recipient.role }} | {{ recipient.email }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-tab-item>
            <v-tab-item key="history">
              <v-data-table
                :headers="requestHistoryHeaders"
                :items="rosterRequests"
                :items-per-page=-1
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
        <v-fab-transition>
          <v-btn
            v-show="tab === 0"
            :disabled="selectedRecipients.length < 1"
            absolute
            fab
            right
            dark
            color="primary"
            class="send-btn"
            @click="isVisible = false"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Tabs, { AppBarItem } from '@/components/app-bar/Tabs.vue'
import faker from 'faker'
import Vue from 'vue'
import Component from 'vue-class-component'
import { DataTableHeader } from 'vuetify'

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

@Component({ components: { Tabs } })
export default class MobileRosterDownloadDialog extends Vue {
  name = 'MobileRosterDownloadDialog'

  tab = 0
  tabItems: AppBarItem[] = [{ title: 'Request' }, { title: 'History' }]

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

  downloadDialogTab: number | null = null
  downloadOption: number | null = null
  isVisible = false

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
}
</script>

<style lang="scss" scoped>
.v-card {
  max-height: 100%;
  overflow: hidden;
}

.v-toolbar {
  width: 100%;
}

.roster-download-content {
  padding-top: 104px;
  max-height: 100%;
  overflow-y: auto;
}

.send-btn {
  bottom: 8px;
}
</style>
