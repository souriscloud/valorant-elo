<template>
  <v-form>
    <v-text-field v-model="username" @input="usernameInput" label="Username" name="username" prepend-icon="mdi-account" type="text" />
    <v-text-field v-model="password" @input="passwordInput" label="Password" name="password" prepend-icon="mdi-lock" type="password" />
  </v-form>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      username: this.value.username || '',
      password: this.value.password || ''
    }
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
