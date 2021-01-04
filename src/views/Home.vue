<template>
  <div>
    <v-card-text>
    <p>Your account informations stays secure! Application has been updated to dont reveal your access token in link, so its now safe to make a screenshot or whatever.</p>
    <p>Service used to fetch informations about your account from Riot API is just used as proxy service and doesn't store your account information at all!</p>
    <p>This application has nothing to do with Riot itself, it just using public shared code to replicate Riot RSO to get your MMR updates.</p>
    <p>Sources (proof of security): <ul>
      <li><a href="https://github.com/souriscloud/valorant-elo">this page (github source)</a></li>
      <li><a href="https://github.com/souriscloud/valoments-backend/blob/master/src/services/valoleak/valoleak.class.js">/valoleak endpoint of api.valoments.souris.cloud (service source code)</a></li>
      </ul></p>
      <RiotLogin v-model="credentials" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-grey darken-4" dark @click="login">Last 5 Matches</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import RiotLogin from '@/components/RiotLogin.vue'

export default {
  name: 'Home',
  components: {
    RiotLogin
  },
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      await this.$store.dispatch('fetchData', this.credentials)
      this.$router.push('/elo')
    }
  }
}
</script>
