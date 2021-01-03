<template>
  <v-card-text>
    <template v-if="isWorking">
      <v-progress-circular indeterminate color="primary" />
    </template>
    <template v-else>
      <h3>Posledni progress: {{ lastProgress }}</h3>
      <v-card v-for="match in matches" :key="match.id" style="margin-top: 15px;">
        <v-card-title>{{ match.tierProgress }}</v-card-title>
        <v-card-text>
          <p>Mapa: {{ match.map }}</p>
          <p>Start: {{ match.startTime }}</p>
          <Rank :rankId="match.tier" />
          <p>Update: {{ match.move }}</p>
          <p>Postup nahoru: {{ match.isUp ? 'ano' : 'ne' }}</p>
          <p>Zmena ranku: {{ match.tierChanged ? 'ano' : 'ne' }}</p>
        </v-card-text>
        <v-card-actions>
          <!-- <v-btn>{{ match.isUp }}</v-btn> -->
        </v-card-actions>
      </v-card>
    </template>
  </v-card-text>
</template>

<script>
import axios from 'axios'
import Rank from './Rank.vue'

export default {
  data () {
    return {
      matches: [],
      lastProgress: 0,
      isWorking: true
    }
  },

  components: {
    Rank
  },

  async mounted () {
    this.isWorking = true
    const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
      type: 'compet',
      accessToken: this.$route.params.accessToken
    })
    this.isWorking = false
    this.lastProgress = response.data.Matches[0].TierProgressAfterUpdate
    this.matches = response.data.Matches.map(match => {
      const progressChangeUp = match.TierProgressAfterUpdate > match.TierProgressBeforeUpdate
      const progressChangeNum = progressChangeUp ? match.TierProgressAfterUpdate - match.TierProgressBeforeUpdate : match.TierProgressBeforeUpdate - match.TierProgressAfterUpdate
      const move = match.CompetitiveMovement
      return {
        id: match.MatchID,
        map: match.MapID,
        startTime: new Date(match.MatchStartTime),
        tierChanged: match.TierAfterUpdate !== match.TierBeforeUpdate,
        isUp: progressChangeUp,
        tierProgress: `${progressChangeUp ? '+' : '-'} ${progressChangeNum}`,
        tier: match.TierAfterUpdate,
        move
      }
    })
    console.log(this.matches)
  }
}
</script>
