<template>
  <v-select v-model="$i18n.locale" :items="items" :label="$t('language')" dense outlined></v-select>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { text: 'Česky', value: 'cs' },
        { text: 'English', value: 'en' }
      ]
    }
  }
}
</script>
