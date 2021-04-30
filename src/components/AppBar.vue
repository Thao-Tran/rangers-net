<template>
  <v-app-bar
    app
    color="primary"
    dark
    flat
  >
    <div class="d-flex align-center">
      <v-img
        src="@/assets/logo.svg"
        alt="RangersNet Logo"
        class="shrink mr-2"
        contain
        transition="scale-transition"
        width="36"
      />
      <v-app-bar-title>
        <router-link to="/" class="app-bar-title-link">
          RangersNet
        </router-link>
      </v-app-bar-title>
    </div>

    <v-tabs slider-color="secondary" slider-size="4" right v-model="activeTab">
      <v-tab v-for="(item, index) in items" :key="index" v-bind:class="item.class" v-bind:to="item.route">
        <v-menu v-if="item.items !== undefined" offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <span plain v-bind="attrs" v-on="on" class="menu">
              {{ item.title }}
              <v-icon>mdi-chevron-down</v-icon>
            </span>
          </template>
          <v-list class="menu-item-group" v-model="activeMenuItem[index]">
            <v-list-item v-for="menuItem in item.items" :key="menuItem.title" v-on:click="activeTab = index" v-bind:to="menuItem.route">
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
  </v-app-bar>
</template>

<style lang="scss" scoped>
.menu {
  display: flex;
  height: 100%;
  align-items: center;

  &-item-group {
    background: white;
  }
}

.app-bar-title-link {
  color: white;
  text-decoration: none;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

export interface AppBarItem {
  title: string
  class?: string
  route?: string
  items?: AppBarItem[]
}

@Component
export default class AppBar extends Vue {
  name = 'AppBar'
  activeTab = 0
  selectedMenuItems: Record<string, number> = {}
  items: AppBarItem[] = [
    {
      title: 'Management',
      items: [
        {
          title: 'General',
          route: '/general-management'
        },
        {
          title: 'Profile'
        },
        {
          title: 'Roster'
        }
      ],
      class: 'management'
    },
    {
      title: 'Reporting'
    },
    {
      title: 'Users'
    },
    {
      title: 'Operations'
    },
    {
      title: 'System'
    }
  ]

  get activeMenuItem (): Record<string, number> {
    return {
      [`${this.activeTab}`]: this.selectedMenuItems[`${this.activeTab}`]
    }
  }
}
</script>
