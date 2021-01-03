<template>
  <v-card class="elevation-12">
    <v-card-title><span :class="getTitleClass(match)">{{ match.tierProgress }}</span><v-spacer></v-spacer><span class="final">{{ match.after + '/100' }}</span></v-card-title>
    <v-card-text>
      <p>{{ match.startTime }}</p>
      <p>Mapa: {{ translateMap(match.map) }}</p>
      <Rank :rankId="match.tier" />
      <p>Progress před: {{ match.before }}</p>
      <p><strong>Progress po: {{ match.after }}</strong></p>
    </v-card-text>
    <v-card-actions>
      <v-chip v-if="match.rankChanged" outlined :color="match.promoted ? 'green' : 'red'">{{ match.promoted ? 'Rank Up' : 'Rank Down' }}</v-chip>
      <template v-else>
        <v-chip outlined :color="match.isUp ? 'green' : 'red'">
          <v-icon v-for="(arrow, index) in getArrowArray(match.move)" :key="`arrow-${index}`">{{ arrow }}</v-icon>
        </v-chip>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
import Rank from './Rank.vue'

const maps = {
  '/Game/Maps/Ascent/Ascent': 'Ascent',
  '/Game/Maps/Bonsai/Bonsai': 'Split',
  '/Game/Maps/Duality/Duality': 'Bind',
  '/Game/Maps/Port/Port': 'Icebox',
  '/Game/Maps/Triad/Triad': 'Haven'
}

export default {
  props: ['match'],

  components: {
    Rank
  },

  methods: {
    getTitleClass (m) {
      switch (m.tierProgress[0]) {
        case '+':
          return 'plus'
        case '-':
          return 'minus'
        default:
          break
      }

      return ''
    },

    translateMap (map) {
      if (maps[map]) {
        return maps[map]
      }

      return map
    },

    getArrowArray (move) {
      let arrowDir = ''
      const ret = []

      const increase = move.includes('INCREASE')
      const decrease = move.includes('DECREASE')

      if (increase) arrowDir = 'up'
      if (decrease) arrowDir = 'down'

      const minor = move.includes('MINOR')
      const major = move.includes('MAJOR')

      if (minor) {
        ret.push(...[`mdi-arrow-${arrowDir}-thick`])
      }

      if (major) {
        ret.push(...[`mdi-arrow-${arrowDir}-thick`, `mdi-arrow-${arrowDir}-thick`, `mdi-arrow-${arrowDir}-thick`])
      }

      if (!minor && !major) {
        ret.push(...[`mdi-arrow-${arrowDir}-thick`, `mdi-arrow-${arrowDir}-thick`])
      }

      return ret
    }
  }
}
</script>

<style lang="scss" scoped>
.plus {
  color: darkgreen;
}

.minus {
  color: darkred;
}

.final {
  color: darkslategray;
  font-style: italic;
}
</style>
