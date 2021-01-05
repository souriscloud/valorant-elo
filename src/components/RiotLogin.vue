<template>
  <div>
    <template v-if="isLoading === null">
      <v-form>
        <v-text-field v-model="username" @input="usernameInput" :label="$t('login.username')" name="username" prepend-icon="mdi-account" type="text" />
        <v-text-field v-model="password" @input="passwordInput" :label="$t('login.password')" name="password" prepend-icon="mdi-lock" type="password" />
      </v-form>
    </template>
    <template v-if="isLoading !== null && !loaded">
      <v-progress-circular indeterminate color="primary" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['value'],
  data () {
    return {
      username: this.value.username || '',
      password: this.value.password || ''
    }
  },
  computed: {
    ...mapState(['isLoading', 'loaded'])
  },
  methods: {
    usernameInput ($event) {
      this.$emit('input', {
        username: this.username,
        password: this.password
      })
    },

    passwordInput ($event) {
      this.$emit('input', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
