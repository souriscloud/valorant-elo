<template>
  <v-card-text>
    <template v-if="isWorking">
      <v-progress-circular indeterminate color="primary" />
    </template>
    <template v-else>
      <h3>Aktuální rank:</h3>
      <Rank :rankId="lastRankId" />
      <h3>Aktuální progress: {{ lastProgress }} / 100</h3>
      <v-progress-linear :value="lastProgress" />
      <v-card v-for="match in matches" :key="match.id" style="margin-top: 15px;">
        <v-card-title :class="getTitleClass(match)">{{ match.tierProgress }}</v-card-title>
        <v-card-text>
          <p>{{ match.startTime }}</p>
          <p>Mapa: {{ match.map }}</p>
          <Rank :rankId="match.tier" />
          <p>Pohyb (šipky): {{ match.move }}</p>
          <p>Postup nahoru: {{ match.isUp ? 'ano' : 'ne' }}</p>
          <p>Změna ranku: {{ match.tierChanged ? 'ano' : 'ne' }}</p>
          <p>Progress před: {{ match.before }}</p>
          <p>Progress po: {{ match.after }}</p>
        </v-card-text>
        <v-card-actions>
          <v-chip v-if="match.rankChanged" outlined :color="match.promoted ? 'green' : 'red'">{{ match.promoted ? 'Rank Up' : 'Rank Down' }}</v-chip>
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
      lastRankId: 0,
      isWorking: true
    }
  },

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
    }
  },

  async mounted () {
    this.isWorking = true
    const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
      type: 'compet',
      accessToken: this.$route.params.accessToken
    })
    this.isWorking = false
    this.lastProgress = response.data.Matches[0].TierProgressAfterUpdate
    this.lastRankId = response.data.Matches[0].TierAfterUpdate
    this.matches = response.data.Matches.map(match => {
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
        after: match.TierProgressAfterUpdate
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
    console.log(this.matches)
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
</style>
