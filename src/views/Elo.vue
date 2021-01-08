<template>
  <div>
    <EloCard />
    <v-card-actions>
      <v-spacer></v-spacer>
      <LangSwitch />
      <v-spacer></v-spacer>
      <v-dialog v-model="shareDialog" width="700">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark v-bind="attrs" v-on="on" x-large>{{ $t('elo.share.trigger') }}</v-btn>
        </template>

        <v-card>
          <v-card-title>{{ $t('elo.share.title') }}</v-card-title>
          <template v-if="!isSharing">
            <v-card-text>{{ $t('elo.share.p1') }}</v-card-text>
            <v-card-text>{{ $t('elo.share.p2') }}</v-card-text>
            <v-card-actions>
              <v-btn
                dark
                @click="shareDialog = false"
              >
                {{ $t('elo.share.no') }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                dark
                @click="share"
              >
                {{ $t('elo.share.yes') }}
              </v-btn>
            </v-card-actions>
          </template>
          <template v-else>
            <v-progress-circular indeterminate width="100" />
          </template>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </div>
</template>

<script>
import EloCard from '@/components/EloCard.vue'
import LangSwitch from '@/components/LangSwitch.vue'

export default {
  components: {
    EloCard,
    LangSwitch
  },

  data () {
    return {
      shareDialog: false,
      isSharing: false
    }
  },

  methods: {
    async share () {
      this.isSharing = true
      const shareResult = await this.$store.dispatch('postCompetCard')
      this.isSharing = false
      this.shareDialog = false
      if (shareResult) {
        this.$router.push(`/shared/${shareResult.id}`)
      }
    }
  }
}
</script>
