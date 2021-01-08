<template>
  <div>
    <EloCard />
    <v-card-actions>
      <v-spacer></v-spacer>
      <LangSwitch />
      <v-spacer></v-spacer>
      <v-dialog v-model="shareDialog" width="700">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark v-bind="attrs" v-on="on" x-large>SHARE</v-btn>
        </template>

        <v-card>
          <v-card-title>Share (or update existing) competitive progress card.</v-card-title>
          <template v-if="!isSharing">
            <v-card-text>Since we don't store your passwords, you have to update them with SHARE button yourself anytime you want it update!</v-card-text>
            <v-card-text>When you share your competitive progress card, static link will be generated and will be totally public for all that have the link, there is no account sensitive data, just numbers about your progress, and if you want, you can request deletion, when you open your static link and click the button "REQUEST DELETION", you will authorize by your riot account and static link will be deleted forever!</v-card-text>
            <v-card-text>Czech translation will be available in one or two days!</v-card-text>
            <v-card-actions>
              <v-btn
                dark
                @click="shareDialog = false"
              >
                Don't share
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                dark
                @click="share"
              >
                Share
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
