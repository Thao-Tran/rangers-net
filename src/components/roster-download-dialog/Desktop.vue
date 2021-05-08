<template>
  <v-dialog v-model="isVisible" max-width="850px">
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
        <v-btn text @click="isVisible = false" color="secondary">Close</v-btn>
        <v-btn v-if="downloadDialogTab === 0" text @click="isVisible = false" color="primary">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
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

@Component
export default class DesktopRosterDownloadDialog extends Vue {
  name = 'DesktopRosterDownloadDialog'

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
