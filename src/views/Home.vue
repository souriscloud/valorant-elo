<template>
  <div>
    <v-card-text>
    <p>Your account informations stays secure! Do not show ongoing page link to anyone to stay secure! (Ongoing page link: You can save it, and dont input your credentials again everytime, it contains your RiotAPI access token, it could be abused, but only if it will leak, so it's up to you how you use this site in secure). If your saved link doesn't work anymore, just input your credentials again and save new link.</p>
    <p>Service used to fetch informations about your account from Riot API is just used as proxy service and doesn't store your account information at all!</p>
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
import axios from 'axios'

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
      const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
        type: 'riotauth',
        username: this.credentials.username,
        password: this.credentials.password
      })

      if (response.data && response.data.accessToken) {
        this.$router.push(`/elo/${response.data.accessToken}`)
      }
    }
  }
}
</script>
