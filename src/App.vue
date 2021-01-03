<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="blue-grey darken-4" dark flat>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
              </v-toolbar>
              <router-view />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  computed: {
    title () {
      return this.$store.state.userInfo === null ? 'Valorant ELO (EU Region only)' : this.$store.state.userInfo.displayName
    }
  },

  data () {
    return {}
  }
}
</script>
