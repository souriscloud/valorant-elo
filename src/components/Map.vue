<template>
  <v-tooltip top  >
    <template v-slot:activator="{ on, attrs }">
      <v-img width="150" height="70" :src="mapPath" v-on="on" v-bind="attrs" />
    </template>
    <span>{{ mapName }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ['matchMap'],

  computed: {
    mapPath () {
      return '/maps/' + this.matchMap.toLowerCase() + '.png'
    },

    mapName () {
      return this.matchMap
    }
  }
}
</script>
