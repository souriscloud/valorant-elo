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
import { leakToken } from '../riot/valoleak'

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
    login () {
      console.log(leakToken(this.credentials.username, this.credentials.password))
    }
  }
}
</script>
