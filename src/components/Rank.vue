<template>
  <div style="margin: 10px 10px;">
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-img width="60" height="60" :src="iconPath" v-on="on" v-bind="attrs" />
      </template>
      <span>{{ rankName }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { Ranks } from '../assets/ranks.json'

export default {
  props: ['rankId'],

  computed: {
    iconPath () {
      return '/rankicons/' + this.rankId + '.png'
    },

    rankName () {
      return Ranks[this.rankId]
    }
  }
}
</script>
