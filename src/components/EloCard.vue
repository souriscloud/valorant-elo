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
          <v-col v-if="lastRankId < 24" cols="2">
            <h3>Další rank:</h3>
            <Rank :rankId="lastRankId + 1" />
          </v-col>
        </v-row>
        <v-row v-if="lastRankId < 24">
          <v-col cols="12">
            <h3>{{ lastProgress }} / 100</h3>
            <v-progress-linear :value="lastProgress" />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="match in matches" :key="match.id" style="margin-top: 15px;">
            <MatchCard :match="match" />
          </v-col>
        </v-row>
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
    let found = false
    for (const m of response.data.matches) {
      if (!m.CompetitiveMovement.includes('UNKNOWN')) {
        this.lastProgress = m.TierProgressAfterUpdate
        this.lastRankId = m.TierAfterUpdate
        found = true
        break
      }
    }
    if (!found) {
      this.noRanked = true
    }
    this.matches = response.data.matches.map(match => {
      const move = match.CompetitiveMovement
      const promoted = move === 'PROMOTED'
      const demoted = move === 'DEMOTED'
      const rankChanged = promoted || demoted
      const startdate = new Date(match.MatchStartTime)
      const intldate = new Intl.DateTimeFormat('cs', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(startdate)
      const m = {
        id: match.MatchID,
        map: match.MapID,
        startTime: intldate,
        move,
        promoted,
        demoted,
        rankChanged,
        tier: match.TierAfterUpdate,
        before: match.TierProgressBeforeUpdate,
        after: match.TierProgressAfterUpdate,
        ranked: !move.includes('UNKNOWN')
      }

      if (rankChanged) {
        if (promoted) {
          const gain = 100 - match.TierProgressBeforeUpdate + match.TierProgressAfterUpdate
          m.tierProgress = `+ ${gain}`
        }

        if (demoted) {
          const gain = 100 - match.TierProgressAfterUpdate + match.TierProgressBeforeUpdate
          m.tierProgress = `- ${gain}`
        }

        m.isUp = m.promoted
      } else {
        const progressChangeUp = match.TierProgressAfterUpdate > match.TierProgressBeforeUpdate
        const progressChangeNum = progressChangeUp ? match.TierProgressAfterUpdate - match.TierProgressBeforeUpdate : match.TierProgressBeforeUpdate - match.TierProgressAfterUpdate
        m.tierProgress = `${progressChangeUp ? '+' : '-'} ${progressChangeNum}`
        m.isUp = progressChangeUp
      }

      return m
    })
  }
}
</script>
