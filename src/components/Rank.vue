<template>
  <img width="100" height="100" :src="iconPath" />
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
