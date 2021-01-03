<template>
  <v-card class="elevation-12">
    <v-row v-if="match.ranked" align="center">
      <v-col cols="2">
        <Rank :rankId="match.tier" />
      </v-col>
      <v-col cols="3">
        <span :class="getTitleClass(match)">{{ match.tierProgress }}</span><v-spacer></v-spacer><span class="final">{{ match.after + '/100' }}</span>
      </v-col>
      <v-col cols="5">
        <p>{{ match.startTime }}</p>
        <p>Mapa: {{ translateMap(match.map) }}</p>
        <p>{{ match.before }} => <strong>{{ match.after }}</strong></p>
      </v-col>
      <v-col cols="2">
        <v-chip v-if="match.rankChanged" outlined :color="match.promoted ? 'green' : 'red'">{{ match.promoted ? 'Rank Up' : 'Rank Down' }}</v-chip>
        <template v-else>
          <v-chip outlined :color="match.isUp ? 'green' : 'red'">
            <v-icon v-for="(arrow, index) in getArrowArray(match.move)" :key="`arrow-${index}`">{{ arrow }}</v-icon>
          </v-chip>
        </template>
      </v-col>
    </v-row>
    <template v-else>
      <v-row>
        <v-col cols="2">
          <Rank :rankId="0" />
        </v-col>
        <v-col cols="10">
          <p>Unrated / Spike Rush / Custom / Deathmatch</p>
        </v-col>
      </v-row>
    </template>
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
  font-size: 2.5em;
}

.minus {
  color: darkred;
  font-size: 2.5em;
}

.final {
  color: darkslategray;
  font-style: italic;
  font-size: 1.25em;
}
</style>
