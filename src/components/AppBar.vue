<template>
  <v-app-bar
    app
    color="primary"
    dark
    flat
  >
    <div class="d-flex align-center">
      <v-img
        :src="require('../assets/logo.svg')"
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        transition="scale-transition"
        width="36"
      />
      <v-app-bar-title>RangersNet</v-app-bar-title>
    </div>

    <v-tabs slider-color="secondary" slider-size="4" right>
      <v-tab>
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <span plain v-bind="attrs" v-on="on" class="management-menu">
              Management
              <v-icon>mdi-chevron-down</v-icon>
            </span>
          </template>
          <v-list-item-group class="management-menu-item-group">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  General
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Profile
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Profile
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-menu>
      </v-tab>
      <v-tab>Reporting</v-tab>
      <v-tab>Users</v-tab>
      <v-tab>Operations</v-tab>
      <v-tab>System</v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.management-menu {
  display: flex;
  height: 100%;
  align-items: center;

  &-item-group {
    background: white;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AppBar'
})
</script>
