<template>
  <v-navigation-drawer permanent>
    <selection-box v-if="isSelectionBoxVisible" v-bind:fields="selectionBoxFields"/>
    <v-divider v-if="isSelectionBoxVisible"/>
    <v-list class="nav-items">
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
import SelectionBox from '@/components/SelectionBox.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

export interface NavigationSectionItem {
  label: string
  route: string
}

export interface NavigationSection {
  title?: string
  items: NavigationSectionItem[]
}

const NavigationDrawerProps = Vue.extend({
  props: {
    isSelectionBoxVisible: {
      type: Boolean,
      default (): boolean {
        return true
      }
    },
    selectionBoxFields: Array,
    title: String,
    sections: Array as () => NavigationSection[]
  },
  components: {
    SelectionBox
  }
})

@Component
export default class NavigationDrawer extends NavigationDrawerProps {
  name = 'NavigationDrawer'
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
