<template>
  <v-navigation-drawer
    :permanent="!temporary"
    :temporary="temporary"
    :absolute="absolute"
    :value="value"
    @input="$emit('input', $event)"
  >
    <selection-box
      v-if="!hideSelectionBox"
      :fields="selectionBoxFields"
      v-on:change="$emit('change', $event)"
    />
    <v-divider v-if="!hideSelectionBox"/>
    <v-list v-if="sections !== undefined" class="nav-items">
      <div v-for="(section, index) in sections" :key="index">
        <v-divider v-if="index > 0"/>
        <div class="nav-title grey--text text--darken-4">{{ section.title }}</div>
        <navigation-item v-for="(item, index) in section.items" :key="index" :item="item"/>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import NavigationItem, { NavItem } from '@/components/NavigationItem.vue'
import SelectionBox, { SelectionField } from '@/components/SelectionBox.vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export interface NavigationSection {
  title: string
  items: NavItem[]
}

@Component({ components: { SelectionBox, NavigationItem }, model: { prop: 'value', event: 'input' } })
export default class NavigationDrawer extends Vue {
  name = 'NavigationDrawer'

  @Prop({ type: Boolean, default: true }) value!: boolean
  @Prop({ type: Boolean, default: false }) hideSelectionBox!: boolean
  @Prop({ type: Boolean, default: false }) absolute!: boolean
  @Prop({ type: Boolean, default: false }) temporary!: boolean
  @Prop({ type: Array, required: false }) selectionBoxFields?: SelectionField[]
  @Prop({ type: String, required: false }) title?: string
  @Prop(Array) sections?: NavigationSection[]
}
</script>

<style lang="scss">
.v-navigation-drawer {
  min-width: 290px;

  &__content {
    display: flex;
    flex-direction: column;
    height: calc(100% - 64px);
    overflow: hidden;
  }

  .nav-items {
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    overflow-y: auto;

    .nav-title {
      margin: 16px;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
    }
  }
}
</style>
