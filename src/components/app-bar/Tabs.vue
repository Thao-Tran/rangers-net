<template>
  <v-tabs
    slider-color="secondary"
    slider-size="4"
    :value="value"
    @change="$emit('change', $event)"
    :right="right"
    :align-with-title="alignWithTitle"
  >
    <v-tab v-for="(item, index) in items" :key="index" v-bind:class="item.class" v-bind:to="item.route">
      <v-menu v-if="item.items !== undefined" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <span plain v-bind="attrs" v-on="on" class="menu d-flex align-center px-2">
            {{ item.title }}
            <v-icon>mdi-chevron-down</v-icon>
          </span>
        </template>
        <v-list class="menu-item-group">
          <v-list-item
            :input-value="activeMenuItem[`${index}`] === menuIndex"
            v-for="(menuItem, menuIndex) in item.items"
            :key="menuIndex"
            @click="onMenuItemClick(index, menuIndex, menuItem)"
            :to="menuItem.queryOnly ? undefined : menuItem.route"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ menuItem.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <span v-else>{{ item.title }}</span>
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'

export interface AppBarItem {
  title: string
  class?: string
  route?: RawLocation
  queryOnly?: boolean
  items?: AppBarItem[]
}

@Component({ model: { prop: 'value', event: 'change' } })
export default class Tabs extends Vue {
  name = 'AppBarTabs'

  @Prop({ type: Array, default: () => [] }) items!: AppBarItem[]
  @Prop({ type: Boolean, default: false }) right!: boolean
  @Prop({ type: Boolean, default: false }) alignWithTitle!: boolean
  @Prop({ type: Number, default: 0 }) value!: number

  selectedMenuItems: Record<string, number> = {}

  get activeMenuItem (): Record<string, number> {
    return {
      [`${this.value}`]: this.selectedMenuItems[`${this.value}`]
    }
  }

  onMenuItemClick (index: number, menuIndex: number, menuItem: AppBarItem) {
    Vue.set(this.selectedMenuItems, index.toString(), menuIndex)
    this.$emit('change', index)

    if (menuItem.route && menuItem.queryOnly) {
      this.$router.push(menuItem.route)
    }
  }
}
</script>

<style lang="scss">
.menu {
  display: flex;
  height: 100%;
  align-items: center;

  &-item-group {
    background: white;
  }
}
</style>
