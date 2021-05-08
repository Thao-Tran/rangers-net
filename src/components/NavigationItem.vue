<template>
  <v-list-group v-if="item.items && item.items.length > 0">
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title v-text="item.label"/>
      </v-list-item-content>
    </template>
    <navigation-item v-for="(subItem, subItemIndex) in item.items" :key="subItemIndex" :item="subItem"/>
  </v-list-group>
  <v-list v-else>
    <v-list-item :to="item.route ? { path: item.route, query: $route.query } : undefined">
      <v-list-item-title class="nav-item" :title="item.label" v-text="item.label"/>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export interface NavItem {
  label: string
  route?: string
  items?: NavItem[]
}

@Component
export default class NavigationItem extends Vue {
  name = 'NavigationItem'

  @Prop(Object) item!: NavItem
}
</script>

<style lang="scss" scoped>
.nav-item {
  padding: 0 24px;
}

.v-list-group {
  .v-list-group__header {
    .v-list-group__header__append-icon {
      min-width: 0;
    }
  }
}

.v-list-item__title {
  font-size: 14px;
}
</style>
