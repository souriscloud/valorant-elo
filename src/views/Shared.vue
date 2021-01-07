<template>
  <div>
    <v-toolbar color="rgba(0, 0, 0, 0.5)" dark flat>
      <v-row justify="center" align="center">
        <v-col v-if="loaded" cols="1">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" @click="home">
                <v-icon>mdi-home-account</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('go_home') }}</span>
          </v-tooltip>
        </v-col>
        <v-col :cols="loaded ? 11 : 12">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-col>
        <!-- <template v-if="loaded">
          <v-col cols="2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs" @click="reload">
                  <v-icon>mdi-trash</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('reload') }}</span>
            </v-tooltip>
          </v-col>
        </template> -->
      </v-row>
    </v-toolbar>
    <v-card-text>
      <template v-if="!noRanked && loaded">
        <v-row>
          <v-col cols="10">
            <h3>{{ $t('elo.rank_actual') }}:</h3>
            <Rank :rankId="lastMatch.TierAfterUpdate" />
          </v-col>
          <v-col v-if="lastMatch.TierAfterUpdate < 24 && lastMatch.TierAfterUpdate >= 3" cols="2">
            <h3>{{ $t('elo.rank_next') }}:</h3>
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
      <template v-else-if="noRanked && loaded">
        <p>{{ $t('elo.no_ranked') }}</p>
      </template>
      <template v-else>
        <v-progress-linear indeterminate dark />
      </template>
    </v-card-text>
  </div>
</template>

<script>
import axios from 'axios'
import { endpoint } from '@/apilink.json'
import Rank from '@/components/Rank.vue'
import MatchCard from '@/components/MatchCard.vue'

export default {
  components: {
    Rank,
    MatchCard
  },

  computed: {
    title () {
      if (!this.updatedAt) {
        return this.userInfo.displayName
      }

      const dt = new Date(this.updatedAt)
      const intldt = new Intl.DateTimeFormat('cs', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(dt)
      return `${this.userInfo.displayName} - ${intldt}`
    }
  },

  data () {
    return {
      userId: '',
      userInfo: {
        displayName: 'Loading...'
      },
      matches: [],
      noRanked: null,
      lastMatch: null,
      loaded: false,
      updatedAt: null
    }
  },

  methods: {
    home () {
      this.$store.dispatch('clear')
      this.$router.push('/')
    }
  },

  async mounted () {
    await this.$store.dispatch('clearData')
    const response = await axios.get(`${endpoint}-compet-cards/${this.$route.params.id}`)
    if (response.data) {
      this.userId = response.data.userId
      this.userInfo = response.data.userInfo
      this.matches = response.data.matches
      this.noRanked = response.data.noRanked
      this.lastMatch = response.data.lastMatch
      this.updatedAt = response.data.updatedAt
    }
    this.loaded = true
  }
}
</script>
