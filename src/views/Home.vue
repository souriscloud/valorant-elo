<template>
  <div>
    <v-card-text>
      <RiotLogin v-model="credentials" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="login">Get ELO</v-btn>
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

      console.log(response.data)
    }
  }
}
</script>
