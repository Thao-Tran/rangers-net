<template>
  <div class="selection-box">
    <v-list>
      <v-list-item v-for="(field, index) in fields" :key="index">
        <v-select
          :items="items[field.id]"
          :label="field.label"
          :value="$route.query[field.id]"
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

export interface SelectionField {
  id: string
  label: string
  endpoint: string
}

export interface SelectionItem {
  value: string
  text: string
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

export const defaultItems: Record<string, SelectionItem[]> = {
  league: [{ text: 'House', value: '1' }, { text: 'Rep', value: '2' }],
  division: [
    {
      text: 'U5',
      value: '1'
    },
    {
      text: 'U7',
      value: '2'
    },
    {
      text: 'U8',
      value: '3'
    },
    {
      text: 'U9',
      value: '4'
    },
    {
      text: 'U10',
      value: '5'
    },
    {
      text: 'U11',
      value: '6'
    },
    {
      text: 'U12',
      value: '7'
    },
    {
      text: 'U13',
      value: '8'
    },
    {
      text: 'U14',
      value: '9'
    },
    {
      text: 'U15',
      value: '10'
    },
    {
      text: 'U16',
      value: '11'
    },
    {
      text: 'U18',
      value: '12'
    },
    {
      text: 'U21',
      value: '13'
    }
  ],
  subdivision: [{ text: 'Red', value: '1' }, { text: 'White', value: '2' }],
  team: Array(faker.datatype.number({ min: 5, max: 10 })).fill('').map((_, i) => ({ value: `${i}`, text: faker.name.lastName().toUpperCase() }))
}

@Component
export default class SelectionBox extends Vue {
  name = 'SelectionBox'

  @Prop({ type: Array, default: () => defaultSelectionFields }) readonly fields!: SelectionField[]

  get items (): Record<string, SelectionItem[]> {
    return {
      league: defaultItems.league,
      ...this.fields.slice(1).reduce((items, { id }, i) => {
        const dependentValue = this.$route.query[this.fields[i]?.id]
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
    const prevSelectedValues = this.fields.slice(0, this.fields.findIndex((field) => field.id === fieldId)).reduce((selectedValues, { id }) => {
      return {
        ...selectedValues,
        [id]: this.$route.query[id]
      }
    }, {})
    const selectedValue = { ...prevSelectedValues, [fieldId]: value }

    this.$router.push({ query: selectedValue })
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
