<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid ref="valorantEloContainer">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="blue-grey darken-4" dark flat>
                <v-row justify="center" align="center">
                  <v-col cols="10">
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                  </v-col>
                  <v-col v-if="loaded" cols="2">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-on="on" v-bind="attrs" @click="screenshot">
                          <v-icon>mdi-file-image</v-icon>
                        </v-btn>
                      </template>
                      <span>Screenshot</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
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
import { mapState } from 'vuex'

export default {
  name: 'App',

  computed: {
    title () {
      return this.$store.state.userInfo === null ? 'Valorant ELO (EU Region only)' : this.$store.state.userInfo.displayName
    },
    ...mapState(['loaded'])
  },

  data () {
    return {}
  },

  methods: {
    async screenshot () {
      const canvas = await this.$html2canvas(this.$refs.valorantEloContainer)
      const downloadLink = document.createElement('a')
      downloadLink.setAttribute('download', 'valorant-elo.png')
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        downloadLink.setAttribute('href', url)
        downloadLink.click()
        downloadLink.remove()
      })
    }
  }
}
</script>
