<template>
  <v-card class="elevation-12" color="rgba(0, 0, 0, 0.8)">
    <v-row v-if="match.ranked" align="center">
      <v-col cols="2">
        <Rank :rankId="match.tier" />
      </v-col>
      <v-col cols="2">
        <span :class="getTitleClass(match)">{{ match.tierProgress }}</span><v-spacer></v-spacer><span class="final">{{ match.after + '/100' }}</span>
      </v-col>
      <v-col cols="3">
        <Map :matchMap="match.map" />
      </v-col>
      <v-col cols="3">
        <v-row>
          <v-col>
            {{ localizedTime }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            MMR:
          </v-col>
          <v-col>
            <i>{{ match.before }}</i>
          </v-col>
          <v-col>
            <v-icon :class="getTitleClass(match)">mdi-arrow-right-bold-hexagon-outline</v-icon>
          </v-col>
          <v-col>
            <strong class="final">{{ match.after }}</strong>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" style="text-align: center;">
        <v-chip v-if="match.rankChanged" outlined :color="match.promoted ? 'green darken-3' : 'red darken-4'">
          <v-icon>{{ match.promoted ? 'mdi-arrow-up-drop-circle-outline' : 'mdi-arrow-down-drop-circle-outline' }}</v-icon>
          {{ match.promoted ? ' Rank Up' : ' Rank Down' }}
        </v-chip>
        <template v-else>
          <v-chip outlined :color="match.isUp ? 'green darken-3' : 'red darken-4'">
            <v-icon v-for="(arrow, index) in getArrowArray(match.move)" :key="`arrow-${index}`">{{ arrow }}</v-icon>
          </v-chip>
        </template>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="3">
        <Rank :rankId="0" />
      </v-col>
      <v-col cols="9">
        <v-card-text>Unrated / Spike Rush / Custom / Deathmatch</v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Rank from './Rank.vue'
import Map from './Map.vue'

export default {
  props: ['match'],

  components: {
    Rank,
    Map
  },

  computed: {
    localizedTime () {
      return this.translateTime(this.match.startTime, this.$i18n.locale)
    }
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

    translateTime (startTime, lang = 'cs') {
      const startdate = new Date(startTime)
      return new Intl.DateTimeFormat(lang, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(startdate)
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
  color: #2E7D32;
  font-size: 2.5em;
}

.minus {
  color: #B71C1C;
  font-size: 2.5em;
}

.final {
  color: darkslategray;
  font-style: italic;
  font-size: 1.25em;
}
</style>
