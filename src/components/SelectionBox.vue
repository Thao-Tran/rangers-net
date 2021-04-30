<template>
  <div class="selection-box">
    <v-list>
      <v-list-item v-for="(field, index) in fields" :key="index">
        <v-select v-bind:label="field.label" outlined dense hideDetails/>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export interface SelectionItem {
  label: string
  endpoint: string
}

export const defaultSelectionFields = [
  {
    label: 'League',
    endpoint: '/leagues'
  },
  {
    label: 'Division',
    endpoint: '/divisions'
  },
  {
    label: 'Subdivision',
    endpoint: '/subdivisions'
  },
  {
    label: 'Team',
    endpoint: '/teams'
  }
]

@Component
export default class SelectionBox extends Vue {
  name = 'SelectionBox'

  @Prop({ type: Array, default: () => defaultSelectionFields }) readonly fields!: SelectionItem[]
}
</script>

<style lang="scss">
.selection-box {
  padding: 24px 0;

  .selection-title {
    margin: 16px;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
  }
}
</style>
