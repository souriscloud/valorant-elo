<template>
  <img :src="iconPath" />
</template>

<script>
export default {
  props: ['rankId'],

  computed: {
    iconPath () {
      return '/rankicons/' + this.rankId + '.png'
    }
  }
}
</script>
