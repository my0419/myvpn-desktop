<template>
    <div>
        <el-dialog
                :title="$t('Advanced Settings')"
                :visible.sync="modalOpen"
                :show-close="false"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                width="500px">
            <el-form v-if="protocol === 'shadowsocks'" ref="form" label-width="120px">
                <h3>Shadowsocks</h3>
                <el-checkbox v-model="shadowsocksV2RayPlugin">{{$t('Enable V2Ray plugin')}}</el-checkbox>
            </el-form>
            <h3>DNS</h3>
            <el-form ref="form" label-width="120px">
                <el-form-item label="dns-list">
                    <span slot="label"></span>
                    <el-select v-model="selectedDNS" :placeholder="$t('OpenDNS')" @change="handleChooseDNS">
                        <el-option
                                v-for="(dns, index) in dnsList"
                                :key="index"
                                :label="dns.title"
                                :value="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="dns-first">
                    <span slot="label">Primary DNS</span>
                    <el-input v-model="dnsFirst" @change="changeDNS"></el-input>
                </el-form-item>
                <el-form-item label="dns-second">
                    <span slot="label">Secondary DNS</span>
                    <el-input v-model="dnsSecond" @change="changeDNS"></el-input>
                </el-form-item>

                <el-alert
                        v-show="invalidDNS"
                        class="notify"
                        :title="$t('Invalid IP address specified')"
                        :closable="false"
                        type="error">
                </el-alert>

                <div class="link">
                    <el-link v-on:click.prevent="handleLinkTo('https://myvpn.run/faq/setup/dns')"><i class="el-icon-link el-icon--right"></i> {{ $t('We recommend that you additionally set the DNS in your system.')}}</el-link>
                </div>

                <el-form-item>
                    <el-button type="primary" @click="handleApply">{{ $t('Apply') }}</el-button>
                    <el-button @click="handleCancel">{{ $t('Cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <a href="#" class="link-padding" @click="modalOpen = true"><i class="el-icon-setting"></i> {{ $t('Advanced Settings') }} (DNS<span v-if="protocol === 'shadowsocks'">, V2Ray Plugin</span>)</a>
    </div>
</template>

<style scoped>
    .link {
        text-align: center;
        margin-bottom: 20px;
    }
    .notify  {
        margin-bottom: 20px;
    }
    .link-padding {
        display: block;
        padding: 8px 0 4px 0;
    }
</style>

<script>
  const isBrowser = process.browser
  import { redirectTo } from '../../lib/utils'
  export default {
    data () {
      return {
        modalOpen: false,
        invalidDNS: false,
        selectedDNS: 0, // default
      }
    },
    computed: {
      protocol: {
        get () {
          return this.$store.state.type.selected
        }
      },
      dnsList: {
        get () {
          return this.$store.state.setting.dns.list
        }
      },
      dnsFirst: {
        get () {
          return this.$store.state.setting.dns.first
        },
        set (value) {
          this.$store.dispatch('setDNSFirst', value)
        }
      },
      dnsSecond: {
        get () {
          return this.$store.state.setting.dns.second
        },
        set (value) {
          this.$store.dispatch('setDNSSecond', value)
        }
      },
      shadowsocksV2RayPlugin: {
        get () {
          return this.$store.state.setting.shadowsocks.v2rayPlugin
        },
        set (value) {
          this.$store.state.setting.shadowsocks.v2rayPlugin = value
        }
      },
    },
    methods: {
      changeDNS (val) {
        this.selectedDNS = this.dnsList.length - 1
      },
      handleChooseDNS (val) {
        this.dnsFirst = this.dnsList[val].first
        this.dnsSecond = this.dnsList[val].second
      },
      handleApply () {
        if (!require('net').isIP(this.dnsFirst) || !require('net').isIP(this.dnsSecond)) {
          this.invalidDNS = true
        } else {
          this.modalOpen = false
          this.invalidDNS = false
        }
      },
      handleCancel () {
        this.modalOpen = false
        this.invalidDNS = false
        this.selectedDNS = 0
        this.shadowsocksV2RayPlugin = false
        this.$store.dispatch('resetDNS')
      },
      handleLinkTo (url) {
        isBrowser ? redirectTo(url) : require('electron').shell.openExternal(url)
      },
    }
  }
</script>