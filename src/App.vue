<template>
  <v-app class="valoapp">
    <v-main>
      <v-container class="fill-height" fluid ref="valorantEloContainer">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12" color="rgba(0, 0, 0, 0.5)">
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
                  <v-col :cols="loaded ? 9 : 12">
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                  </v-col>
                  <template v-if="loaded">
                    <v-col cols="1">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-on="on" v-bind="attrs" @click="screenshot">
                            <v-icon>mdi-file-image</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('screenshot') }}</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="1">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-on="on" v-bind="attrs" @click="reload">
                            <v-icon>mdi-refresh-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('reload') }}</span>
                      </v-tooltip>
                    </v-col>
                  </template>
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
      return this.$store.state.userInfo === null ? this.$t('title') : this.$store.state.userInfo.displayName
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
    },

    async reload () {
      await this.$store.dispatch('fetchData')
      if (this.$store.state.isError) {
        this.$router.push('/')
      }
    },

    home () {
      this.$store.dispatch('clear')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.valoapp {
  background-image: url('/valorant-elo-bg.png') !important;
  background-position: center !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
}
</style>
