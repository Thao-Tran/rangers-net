<template>
  <div class="selection-box">
    <v-list>
      <v-list-item v-for="(field, index) in fields" :key="index">
        <v-select
          :items="items[field.id]"
          :label="field.label"
          :value="selectedValues[field.id]"
          :disabled="items[field.id] === undefined"
          v-on:change="updateSelectedValues(field.id, $event)"
          outlined
          dense
          hideDetails
        />
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import faker from 'faker'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export interface SelectionItem {
  id: string
  label: string
  endpoint: string
}

export const defaultSelectionFields = [
  {
    id: 'league',
    label: 'League',
    endpoint: '/leagues'
  },
  {
    id: 'division',
    label: 'Division',
    endpoint: '/divisions'
  },
  {
    id: 'subdivision',
    label: 'Subdivision',
    endpoint: '/subdivisions'
  },
  {
    id: 'team',
    label: 'Team',
    endpoint: '/teams'
  }
]

export const defaultItems: Record<string, string[]> = {
  league: ['House', 'Rep'],
  division: ['U5', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U18', 'U21'],
  subdivision: ['Red', 'White'],
  team: Array(faker.datatype.number({ min: 5, max: 10 })).fill('').map(() => faker.name.lastName().toUpperCase())
}

@Component({ model: { prop: 'selectedValues', event: 'change' } })
export default class SelectionBox extends Vue {
  name = 'SelectionBox'

  @Prop({ type: Array, default: () => defaultSelectionFields }) readonly fields!: SelectionItem[]
  @Prop({ type: Object, default: () => ({}) }) selectedValues!: Record<string, string>

  get items (): Record<string, string[]> {
    return {
      league: defaultItems.league,
      ...this.fields.slice(1).reduce((items, { id }, i) => {
        const dependentValue = this.selectedValues?.[this.fields[i]?.id]
        if (dependentValue === undefined) {
          return items
        }

        return {
          ...items,
          [id]: defaultItems[id]
        }
      }, {})
    }
  }

  updateSelectedValues (fieldId: string, value: string): void {
    // Clear selected values that are dependent on the updated value
    const selectedValues = this.fields.slice(0, this.fields.findIndex((field) => field.id === fieldId)).reduce((selectedValues, { id }) => {
      return {
        ...selectedValues,
        [id]: this.selectedValues[id]
      }
    }, {})

    this.$emit('change', { ...selectedValues, [fieldId]: value })
  }
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
