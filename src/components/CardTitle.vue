<template>
  <v-card-title>
    <slot name="prepend"/>
    <div class="primary--text">
      {{ title }}
      <div class="secondary card-title-underline"></div>
    </div>
    <slot/>
  </v-card-title>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class CardTitle extends Vue {
  @Prop(String) title?: string
}
</script>

<style lang="scss">
.card-title-underline {
  width: 100%;
  height: 2px;
}
</style>
