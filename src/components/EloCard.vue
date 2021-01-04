<template>
  <v-card-text>
    <template v-if="!this.noRanked && this.loaded">
      <v-row>
        <v-col cols="10">
          <h3>Aktuální rank:</h3>
          <Rank :rankId="lastMatch.TierAfterUpdate" />
        </v-col>
        <v-col v-if="lastMatch.TierAfterUpdate < 24 && lastMatch.TierAfterUpdate >= 3" cols="2">
          <h3>Další rank:</h3>
          <Rank :rankId="lastMatch.TierAfterUpdate + 1" />
        </v-col>
      </v-row>
      <v-row v-if="lastMatch.TierAfterUpdate < 24 && lastMatch.TierAfterUpdate >= 3">
        <v-col cols="12">
          <h3>{{ lastMatch.TierProgressAfterUpdate }} / 100</h3>
          <v-progress-linear :value="lastMatch.TierProgressAfterUpdate" />
        </v-col>
      </v-row>
      <div v-for="match in matches" :key="match.id" style="margin-top: 20px;">
        <MatchCard :match="match" />
      </div>
    </template>
    <template v-else>
      <p>No competitive games in last 5 matches! Play competitive game to reveal your MMR.</p>
    </template>
  </v-card-text>
</template>

<script>
import { mapState } from 'vuex'
import Rank from './Rank.vue'
import MatchCard from './MatchCard.vue'

export default {
  components: {
    Rank,
    MatchCard
  },

  computed: {
    ...mapState(['lastMatch', 'noRanked', 'matches', 'isLoading', 'isError', 'loaded'])
  },

  mounted () {
    if (this.isLoading === false && this.loaded === false) {
      this.$router.push('/')
    }
  }
}
</script>
