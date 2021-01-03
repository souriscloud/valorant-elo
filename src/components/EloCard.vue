<template>
  <v-card-text>
    <template v-if="isWorking">
      <v-progress-circular indeterminate color="primary" />
    </template>
    <template v-else>
      <template v-if="!this.noRanked">
        <v-row>
          <v-col cols="10">
            <h3>Aktuální rank:</h3>
            <Rank :rankId="lastRankId" />
          </v-col>
          <v-col v-if="lastRankId < 24 && lastRankId >= 3" cols="2">
            <h3>Další rank:</h3>
            <Rank :rankId="lastRankId + 1" />
          </v-col>
        </v-row>
        <v-row v-if="lastRankId < 24 && lastRankId >= 3">
          <v-col cols="12">
            <h3>{{ lastProgress }} / 100</h3>
            <v-progress-linear :value="lastProgress" />
          </v-col>
        </v-row>
        <div v-for="match in matches" :key="match.id" style="margin-top: 20px;">
          <MatchCard :match="match" />
        </div>
      </template>
      <template v-else>
        <p>No competitive games in last 5 matches! Play competitive game to reveal your MMR.</p>
      </template>
    </template>
  </v-card-text>
</template>

<script>
import axios from 'axios'
import Rank from './Rank.vue'
import MatchCard from './MatchCard.vue'

export default {
  data () {
    return {
      matches: [],
      lastProgress: 0,
      lastRankId: 0,
      noRanked: false,
      isWorking: true
    }
  },

  components: {
    Rank,
    MatchCard
  },

  async mounted () {
    this.isWorking = true
    const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
      type: 'compet',
      accessToken: this.$route.params.accessToken,
      count: 5
    })
    this.$store.dispatch('updateUserInfo', response.data.userInfo)
    this.isWorking = false

    this.lastProgress = response.data.lastMatch.TierProgressAfterUpdate
    this.lastRankId = response.data.lastMatch.TierAfterUpdate
    this.noRanked = response.data.noRanked
    this.matches = response.data.matches
  }
}
</script>
