<template>
    <div class="app-page processing-page">
        <el-alert v-show="lockedIp && $i18n.locale === 'ru'" title="Повторная попытка создать новый сервер в выбранном регионе" :description="`IP созданного сервера ${lockedIp} заблокирован надзорными органами вашей страны`" type="warning" show-icon></el-alert>
        <el-alert v-show="lockedIp && $i18n.locale !== 'ru'" title="Trying to create a new server in the selected region again" :description="`The IP of the created server ${lockedIp} is blocked in your country`" type="warning" show-icon></el-alert>
        <Preloader />
        <div class="wrapper">
            <h1 class="glitch proccesing-heading" :text="$t(journalLastLog)">{{ $t(journalLastLog) }}</h1>
        </div>
        <h4 class="text-center proccesing-description">{{ $t('It can take 3 to 5 minutes to set up the environment') }}</h4>
        <!--<div class="text-center" v-show="allowCancel">
            <el-button type="primary" v-on:click="handleCancel" icon="el-icon-close">{{ $t('Cancel') }}</el-button>
        </div>-->
    </div>
</template>

<style lang="scss" scoped>
  @import '~mixins';
  .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      @include mqMAX($XS) {
        height: auto;
      }
  }
  .wrapper h1 {
      font-family: 'Roboto Mono';
      font-weight: 500;
      font-size: 1.8rem;
      color: #fff;
      @include mqMAX($XS) {
        font-size: .9rem;
      }
      @include mqMAX($XXS) {
        font-size: .7rem;
      }
  }
  .processing-page {
    @include mqMAX($XS) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      padding: 0;
    }
  }
  .proccesing-heading {
    @include mqMAX($XS) {
      padding: 15px;
      &::before,
      &::after {
        padding: 15px;
      }
    }
  }
  .proccesing-description {
    @include mqMAX($XS) {
      margin-top: 0;
      font-size: .8rem;
    }
  }
</style>

<script>
  import { mapState } from 'vuex'
  import Preloader from './Preloader'
  import { CRYPTOSERVERS_KEY } from '../../lib/providers'

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
      selectedProvider: state => state.provider.name || CRYPTOSERVERS_KEY,
      allowCancel: state => state.processing.allowCancel,
      configuredSuccess: state => state.provider.configuredSuccess,
      serverName: state => state.server.name,
      serverIp: state => state.server.ipv4,
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

        const configuration = {
            protocol: this.$store.state.type.selected,
            account: this.$store.state.account,
            setting: this.$store.state.setting
        }

        this.$store.dispatch('generatePersonalAccess', configuration.setting.numberOfAccounts)

        switch (this.selectedProvider) {
          case 'custom': {
            this.$store.dispatch('processingSSH', {
              sshIp: this.$store.state.server.ipv4,
              sshPrivateKey: this.$store.state.server.sshPrivateKey,
              sshPassword: this.$store.state.server.sshPassword,
              sshPort: this.$store.state.server.sshPort,
              sshUser: this.$store.state.server.sshUser,
              protocol: this.$store.state.type.selected,
              configuration
            })

            break
          }
          default: {
            this.log('Generate RSA public/private key pair')
            setTimeout(_ => {
              this.$store.dispatch('generateKeypair')
              this.$store.dispatch('processing', {
                client: this.$store.state.provider.client,
                sshKey: this.$store.state.keypair.sshPublic,
                privateKey: this.$store.state.keypair.private,
                region: this.$store.state.region.value,
                protocol: this.$store.state.type.selected,
                configuration
              })
            }, 250) // freeze problem
          }
        }

        let unsubscribe = this.$store.subscribe((mutation, state) => {
          switch (mutation.type) {
            case 'PROCESSING_COMPLETE':
              this.$message({message: this.$root.$t('The server is successfully configured. Save the accesses.'), type: 'success'})
              unsubscribe()
              this.$router.push({ name: 'access' })
              break
            case 'PROCESSING_CANCEL':
              this.$message({message: this.$root.$t('The process of building the VPN server is cancelled. If you have build problems, try changing the region.'), type: 'error', duration: 8000})
              unsubscribe()
              this.$router.push({ name: 'main' })
              break
            case 'PROCESSING_ERROR':
              if (mutation.payload !== 'cancel') {
                this.$message({dangerouslyUseHTMLString: true, message: `${this.$root.$t('A server configuration error has occurred.')}<br/>${mutation.payload}`, type: 'error', duration: 15000})
                unsubscribe()
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
