<template>
  <div>
    <EloCard />
    <v-card-actions>
      <v-spacer></v-spacer>
      <LangSwitch />
      <v-spacer></v-spacer>
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
  }
}
</script>
