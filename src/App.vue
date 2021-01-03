<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="!2" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
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

  data () {
    return {
      title: this.$store.userInfo === null ? 'Valorant ELO (EU Region only)' : `${this.$store.userInfo.GameName}#${this.$store.userInfo.TagLine}`
    }
  }
}
</script>
