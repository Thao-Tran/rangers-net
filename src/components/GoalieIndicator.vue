<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <div
        v-on="on"
        v-bind="attrs"
        class="goalie-indicator secondary--text font-weight-black px-1 rounded-circle"
      >
        G
      </div>
    </template>
    Goalie
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class GoalieIndicator extends Vue {
  name = 'GoalieIndicator'
}
</script>

<style lang="scss">
.goalie-indicator {
  cursor: default;
}
</style>
