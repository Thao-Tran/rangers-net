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
import _ from 'lodash-es'
import Vue from 'vue'
import Component from 'vue-class-component'

export interface SelectionField {
  id: string
  label: string
  endpoint: string
}

export interface SelectionItem {
  value: string
  text: string
}

@Component
export default class SelectionBox extends Vue {
  name = 'SelectionBox'

  fields = [
    { id: 'league', label: 'League' },
    { id: 'division', label: 'Division' },
    { id: 'subDivision', label: 'Sub-division' },
    { id: 'team', label: 'Team' }
  ]

  get items (): Record<string, SelectionItem[]> {
    return {
      league: this.convertToSelectionItems(this.$store.state.leagues),
      ...this.fields.slice(1).reduce(({ items, key }, { id }, i) => {
        const dependentValue = this.$route.query[this.fields[i]?.id]
        if (dependentValue === undefined) {
          return { items, key }
        }

        const dependentIndex = _.get<any[]>(this.$store.state, key, []).findIndex(({ id }) => id === dependentValue)

        const newKey = `${key}[${dependentIndex}].${id}s`

        return {
          items: {
            ...items,
            [id]: this.convertToSelectionItems(_.get(this.$store.state, newKey, []))
          },
          key: newKey
        }
      }, { items: {}, key: 'leagues' }).items
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

  convertToSelectionItems (items: Array<{ id: string, name: string }>): SelectionItem[] {
    return items.map(({ id: value, name: text }) => {
      return { value, text }
    })
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
