<template>
  <div>
    <!-- <v-card-text>
      <p>Riot pomalu přechází na novou Auth Flow RSO, takže dokud mi nepošlou přístup (je to v jednání už několik měsíců, ale tenhle proces prostě trvá) k mému hlavnímu projektu, nebo pokud se na netu prozatím neobjeví obezlička jako doposud, tato aplikace už nepůjde. Nicméně můžete se těšit na trochu propracovanější projekt, a tato aplikace v něm bude stoprocentně interpretována.</p>
      <p>Je mi líto, že to vydrželo tak málo, ale přechod na novou RSO znamená urychlení požadavku o přístup, tak snad již brzy na tom novém projektu!</p>
    </v-card-text> -->
    <v-card-text>
      <p>{{ $t('home.p1') }}</p>
      <p>{{ $t('home.p2') }}</p>
      <p>{{ $t('home.p3') }}</p>
      <p>
        {{ $t('home.sources') }}:
        <ul>
          <li><a href="https://github.com/souriscloud/valorant-elo">{{ $t('home.source_this') }}</a></li>
          <li><a href="https://github.com/souriscloud/valoments-backend/blob/master/src/services/valoleak/valoleak.class.js">{{ $t('home.source_api') }}</a></li>
        </ul>
      </p>
      <RiotLogin v-model="credentials" />
    </v-card-text>
    <v-card-actions>
      <p>{{ $t('last_update') }}: {{ lastCommitTime }}</p>
      <v-spacer></v-spacer>
      <LangSwitch />
      <v-spacer></v-spacer>
      <v-btn color="blue-grey darken-4" dark @click="login">{{ $t('home.button') }}</v-btn>
    </v-card-actions>
  </div>
</template>

<script>

export default {
  name: 'Home',
  computed: {
    lastCommitTime () {
      const { lastCommit } = this.$store.state
      if (lastCommit) {
        const dt = new Date(lastCommit.author.date)

        return new Intl.DateTimeFormat(this.$i18n.locale, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(dt)
      } else {
        return '...'
      }
    }
  },
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      await this.$store.dispatch('fetchData', this.credentials)
      this.$router.push('/elo')
    }
  }
}
</script>
