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
    <v-card-actions>
      <v-spacer></v-spacer>
      <LangSwitch />
      <v-spacer></v-spacer>
      <v-dialog v-model="deletionDialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark v-bind="attrs" v-on="on" x-large>REQUEST DELETION</v-btn>
        </template>

        <v-card>
          <v-card-title>Competitive progress card deletion</v-card-title>
          <template v-if="!deletionProgress">
            <v-card-text>When you delete your competitive progress card, this static link will be destroyed forever. You can make then new share and generate new link!</v-card-text>
            <v-card-text>Credentials are again send to Riot to authorize hash of your profile ID, that you have stored/shared this competitive progress card, it has nothing to do with Valorant itself.</v-card-text>
            <v-card-text>
              <v-text-field v-model="deletionCreds.username" label="username" />
              <v-text-field v-model="deletionCreds.password" label="password" />
            </v-card-text>
            <v-card-actions>
              <v-btn
                dark
                @click="deletionDialog = false"
              >
                Don't delete
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                dark
                @click="deletion"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </template>
          <template v-else>
            <v-progress-linear dark indeterminate />
          </template>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </div>
</template>

<script>
import axios from 'axios'
import { endpoint } from '@/apilink.json'
import Rank from '@/components/Rank.vue'
import MatchCard from '@/components/MatchCard.vue'
import LangSwitch from '@/components/LangSwitch.vue'

export default {
  components: {
    Rank,
    MatchCard,
    LangSwitch
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
      updatedAt: null,
      deletionDialog: false,
      deletionProgress: false,
      deletionCreds: {
        username: '',
        password: ''
      }
    }
  },

  methods: {
    home () {
      this.$store.dispatch('clear')
      this.$router.push('/')
    },

    async deletion () {
      this.deletionProgress = true
      const { username, password } = this.deletionCreds
      this.deletionCreds.username = ''
      this.deletionCreds.password = ''
      if (username !== '' && password !== '' && this.userId !== '') {
        const response = await axios.post(endpoint, {
          type: 'card-del-req',
          username,
          password,
          userId: this.userId
        })
        this.deletionProgress = false
        this.deletionDialog = false

        if (response.data) {
          this.$router.push('/')
        }
      }
    }
  },

  async mounted () {
    await this.$store.dispatch('clear')
    if (!this.$route.params.id) {
      this.$router.push('/')
    } else {
      const response = await axios.get(`${endpoint}-compet-cards/${this.$route.params.id}`)
      if (response.data) {
        this.userId = response.data.userId
        this.userInfo = response.data.userInfo
        this.matches = response.data.matches
        this.noRanked = response.data.noRanked
        this.lastMatch = response.data.lastMatch
        this.updatedAt = response.data.updatedAt
      }
    }
    this.loaded = true
  }
}
</script>
