<template>
  <v-navigation-drawer permanent>
    <selection-box
      v-if="isSelectionBoxVisible"
      :fields="selectionBoxFields"
      :selectedValues="selectionBoxValues"
      v-on:change="$emit('change', $event)"
    />
    <v-divider v-if="isSelectionBoxVisible"/>
    <v-list v-if="sections !== undefined" class="nav-items">
      <div class="nav-title grey--text text--darken-4">{{ title }}</div>
      <div v-for="(section, index) in sections" :key="index">
        <v-list-group v-if="section.title !== undefined">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="section.title"/>
            </v-list-item-content>
          </template>
          <v-list-item v-bind:to="sectionItem.route" v-for="(sectionItem, itemIndex) in section.items" :key="itemIndex">
            <v-list-item-title class="section-item" v-bind:title="sectionItem.label" v-text="sectionItem.label"/>
          </v-list-item>
        </v-list-group>
        <v-list v-else>
          <v-list-item v-bind:to="sectionItem.route" v-for="(sectionItem, itemIndex) in section.items" :key="itemIndex">
            <v-list-item-title class="section-item" v-bind:title="sectionItem.label" v-text="sectionItem.label"/>
          </v-list-item>
        </v-list>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import SelectionBox, { SelectionItem } from '@/components/SelectionBox.vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export interface NavigationSectionItem {
  label: string
  route: string
}

export interface NavigationSection {
  title?: string
  items: NavigationSectionItem[]
}

@Component({ components: { SelectionBox }, model: { prop: 'selectionBoxValues', event: 'change' } })
export default class NavigationDrawer extends Vue {
  name = 'NavigationDrawer'

  @Prop({ type: Boolean, default: true }) isSelectionBoxVisible!: boolean
  @Prop(Array) selectionBoxFields?: SelectionItem[]
  @Prop(Object) selectionBoxValues?: Record<string, string>
  @Prop(String) title?: string
  @Prop(Array) sections?: NavigationSection[]
}
</script>

<style lang="scss">
.v-navigation-drawer {
  &__content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
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

    .section-item {
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
  }
}
</style>
