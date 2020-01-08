<template>
    <div class="app-page">
        <el-alert v-show="lockedIp && $i18n.locale === 'ru'" title="Повторная попытка создать новый сервер в выбранном регионе" :description="`IP созданного сервера ${lockedIp} заблокирован надзорными органами вашей страны`" type="warning" show-icon></el-alert>
        <el-alert v-show="lockedIp && $i18n.locale !== 'ru'" title="Trying to create a new server in the selected region again" :description="`The IP of the created server ${lockedIp} is blocked in your country`" type="warning" show-icon></el-alert>
        <Preloader />
        <h1 class="text-center">{{ $t(journalLastLog) }}</h1>
        <h4 class="text-center">{{ $t('It can take 3 to 5 minutes to set up the environment') }}</h4>
        <div class="text-center" v-show="allowCancel">
            <el-button type="info" plain v-on:click="handleCancel" icon="el-icon-close">{{ $t('Cancel') }}</el-button>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Preloader from './Preloader'

  export default {
    components: {Preloader},
    data () {
      return {
        lockedIp: null
      }
    },
    computed: mapState({
      journalLastLog: state => {
        let log = state.journal.log
        if (log.length === 0) {
          return ''
        }
        let splitLog = log.split('\n').filter(v => v.length > 0)
        return splitLog[splitLog.length - 1]
      },
      allowCancel: state => state.processing.allowCancel,
      configuredSuccess: state => state.provider.configuredSuccess,
      serverName: state => state.server.name,
      serverIp: state => state.server.ipv4,
      keypairPrivate: state => state.keypair.private,
      keypairPublic: state => state.keypair.public,
      keypairSshPublic: state => state.keypair.sshPublic,
      accountUsername: state => state.account.username,
      accountPassword: state => state.account.password,
      accountPskKey: state => state.account.pskKey,
      accountOvpn: state => state.account.ovpn
    }),
    mounted: function () {
      if (!this.configuredSuccess) {
        this.$router.push({ name: 'main' })
      } else {
        this.create()
      }
    },
    methods: {
      create: function () {
        this.log('Generate RSA public/private key pair')
        this.$store.dispatch('generateKeypair')
        this.$store.dispatch('generatePersonalAccess')
        this.$store.dispatch('processing', {
          client: this.$store.state.provider.client,
          sshKey: this.$store.state.keypair.sshPublic,
          privateKey: this.$store.state.keypair.private,
          region: this.$store.state.region.value,
          connectionType: this.$store.state.type.selected,
          accountUsername: this.$store.state.account.username,
          accountPassword: this.$store.state.account.password,
          accountPskKey: this.$store.state.account.pskKey
        })
        this.$store.subscribe((mutation, state) => {
          switch (mutation.type) {
            case 'PROCESSING_COMPLETE':
              this.$message({message: this.$root.$t('The server is successfully configured'), type: 'success'})
              this.$router.push({ name: 'access' })
              break
            case 'PROCESSING_CANCEL':
              this.$message({message: this.$root.$t('The process of building the VPN server is cancelled. If you have build problems, try changing the region.'), type: 'error', duration: 8000})
              this.$router.push({ name: 'main' })
              break
            case 'PROCESSING_ERROR':
              if (mutation.payload !== 'cancel') {
                this.$message({dangerouslyUseHTMLString: true, message: `${this.$root.$t('A server configuration error has occurred.')}<br/>${mutation.payload}`, type: 'error', duration: 15000})
                this.$router.push({ name: 'main' })
              }
              break
            case 'PROCESSING_FAILED_CONNECTION':
              this.lockedIp = this.serverIp
              break
          }
        })
      },
      log: function (text) {
        this.$store.dispatch('log', text)
      },
      handleCancel: function () {
        this.$store.dispatch('cancelProcessing')
      }
    }
  }
</script>
