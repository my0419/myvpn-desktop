<template>
  <div>
    <el-dialog
      :title="$t('Advanced Settings')"
      :visible.sync="modalOpen"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form v-if="protocol === 'wireguard'" ref="form">
        <h3>{{ protocol }}</h3>
        <el-form-item :label="this.$root.$t('Accounts')">
          <el-input-number v-model="numberOfAccounts" :min="1" :max="5"></el-input-number>
        </el-form-item>
      </el-form>

      <el-form v-if="protocol === 'ikev2'" ref="form">
        <h3>IKEv2/IPSec</h3>
        <el-form-item :label="this.$root.$t('Accounts')">
          <el-input-number v-model="numberOfAccounts" :min="1" :max="5"></el-input-number>
        </el-form-item>
      </el-form>

      <el-form v-if="protocol === 'openconnect'" ref="form">
        <h3>{{ protocol }}</h3>
        <el-form-item :label="this.$root.$t('Accounts')">
          <el-input-number v-model="numberOfAccounts" :min="1" :max="5"></el-input-number>
        </el-form-item>
      </el-form>

      <el-form v-if="protocol === 'socks5'" ref="form">
        <h3>{{ protocol }}</h3>
        <el-form-item :label="this.$root.$t('Port')">
          <el-input-number v-model="customPort" :min="1" :max="65535"></el-input-number>
        </el-form-item>
      </el-form>

      <el-form v-if="protocol === 'shadowsocks'" ref="form">
        <h3>{{ protocol }}</h3>
        <el-form-item :label="this.$root.$t('Accounts')">
          <el-input-number v-model="numberOfAccounts" :min="1" :max="5"></el-input-number>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="shadowsocksV2RayPlugin">{{
            $t('Enable V2Ray plugin')
          }}</el-checkbox>
        </el-form-item>
      </el-form>

      <el-form v-if="protocol === 'torbridge'" ref="form">
        <h3>{{ protocol }}</h3>
        <el-form-item :label="this.$root.$t('OR Port')">
          <el-input-number
            v-model="torbridgeOrPort"
            :min="1"
            :max="65535"
          ></el-input-number>
        </el-form-item>
        <el-form-item :label="this.$root.$t('PT Port')">
          <el-input-number
            v-model="torbridgePtPort"
            :min="1"
            :max="65535"
          ></el-input-number>
        </el-form-item>
        <el-form-item :label="this.$root.$t('Nickname')">
          <el-input v-model="torbridgeNickname"></el-input>
        </el-form-item>
        <el-form-item :label="this.$root.$t('Email')">
          <el-input v-model="torbridgeEmail"></el-input>
        </el-form-item>
      </el-form>

      <el-form v-if="protocol === 'nextcloud'" ref="form">
        <h3>{{ protocol }}</h3>

        <el-form-item :label="this.$root.$t('Domain')">
          <el-input
            v-model="nextcloudDomain"
            :placeholder="this.$root.$t('*.nip.io')"
          ></el-input>
        </el-form-item>

        <el-form-item :label="this.$root.$t('Let\'s Encrypt Email')">
          <el-input v-model="nextcloudEmail"></el-input>
        </el-form-item>

        <el-form-item :label="this.$root.$t('Database')">
          <el-radio-group v-model="nextcloudDb">
            <el-radio label="mysql">MySQL</el-radio>
            <el-radio label="pgsql">PostgreSQL</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <h3>DNS</h3>
      <el-form ref="form">
        <el-form-item label="dns-list">
          <span slot="label"></span>
          <el-select
            v-model="selectedDNS"
            :placeholder="$t('OpenDNS')"
            @change="handleChooseDNS"
          >
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
          type="error"
        >
        </el-alert>

        <div class="link">
          <el-link v-on:click.prevent="handleLinkTo('https://myvpn.run/faq/setup/dns')"
            ><i class="el-icon-link el-icon--right"></i>
            {{ $t('We recommend you additionally set the DNS in your system.') }}</el-link
          >
        </div>

        <el-alert
          v-show="invalidTorbridgePort"
          class="notify"
          :title="$t('Ports should be unique')"
          :closable="false"
          type="error"
        >
        </el-alert>

        <el-form-item class="btn-group">
          <el-button
            class="btn-group-item btn-group-item--fill"
            type="primary"
            @click="handleApply"
            >{{ $t('Apply') }}</el-button
          >
          <el-button class="btn-group-item btn-group-item--fill" @click="handleCancel">{{
            $t('Cancel')
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <a href="#" class="link-padding" @click="modalOpen = true"
      ><i class="el-icon-setting"></i> {{ $t('Advanced Settings') }} ({{
        settingsAvailable
      }})</a
    >
  </div>
</template>

<style lang="scss" scoped>
@import 'sass-mixins';
.el-dialog__body {
  .el-form {
    .el-form-item {
      @include mq-max($XS) {
        display: flex;
        flex-direction: column;
      }
    }
    .el-form-item__content {
      margin-left: 145px;
      @include mq-max($XS) {
        margin-left: 0;
      }
    }
    .btn-group-item {
      @include mq-max($XXS) {
        height: 36px;
        margin-left: 0;
        marker-end: 0;
        &:not(:first-child) {
          margin-top: 10px;
        }
      }
    }
    .el-input-number {
      @include mq-max($XXS) {
        width: 100%;
      }
    }
  }
}
.link {
  text-align: center;
  margin-bottom: 20px;
}
.notify {
  margin-bottom: 20px;
}
.link-padding {
  display: block;
  padding: 8px 0 4px 0;
}
</style>

<script>
import { redirectTo } from '@/lib/utils'
import { validateIPaddress } from '@/lib/string'

const isElectron = process.env.IS_ELECTRON

export default {
  data() {
    return {
      modalOpen: false,
      invalidDNS: false,
      invalidTorbridgePort: false,
      selectedDNS: 0, // default
    }
  },
  computed: {
    settingsAvailable() {
      let info = ['DNS']
      if (this.protocol === 'shadowsocks') {
        info.push('V2Ray Plugin')
      }

      if (this.protocol === 'socks5') {
        info.push(this.$root.$t('Port'))
      }

      if (this.protocol === 'torbridge') {
        info.push(this.$root.$t('Port'))
        info.push(this.$root.$t('Nickname'))
        info.push(this.$root.$t('Email'))
      }

      if (['shadowsocks', 'wireguard', 'ikev2', 'openconnect'].includes(this.protocol)) {
        info.push(`${this.$root.$t('Accounts')}: ${this.numberOfAccounts}`)
      }

      if (this.protocol === 'nextcloud') {
        info.push(this.$root.$t('Domain'))
        info.push(this.$root.$t('Database'))
      }

      return info.join(', ')
    },
    protocol: {
      get() {
        return this.$store.state.type.selected
      },
    },
    dnsList: {
      get() {
        return this.$store.state.setting.dns.list
      },
    },
    dnsFirst: {
      get() {
        return this.$store.state.setting.dns.first
      },
      set(value) {
        this.$store.dispatch('setDNSFirst', value)
      },
    },
    customPort: {
      get() {
        return this.$store.state.setting.customPort
      },
      set(value) {
        this.$store.dispatch('setCustomPort', value)
      },
    },
    dnsSecond: {
      get() {
        return this.$store.state.setting.dns.second
      },
      set(value) {
        this.$store.dispatch('setDNSSecond', value)
      },
    },
    shadowsocksV2RayPlugin: {
      get() {
        return this.$store.state.setting.shadowsocks.v2rayPlugin
      },
      set(value) {
        this.$store.state.setting.shadowsocks.v2rayPlugin = value
      },
    },
    numberOfAccounts: {
      get() {
        return this.$store.state.setting.numberOfAccounts
      },
      set(value) {
        this.$store.state.setting.numberOfAccounts = value
      },
    },
    torbridgeOrPort: {
      get() {
        return this.$store.state.setting.torbridge.orPort
      },
      set(value) {
        this.$store.state.setting.torbridge.orPort = value
      },
    },
    torbridgePtPort: {
      get() {
        return this.$store.state.setting.torbridge.ptPort
      },
      set(value) {
        this.$store.state.setting.torbridge.ptPort = value
      },
    },
    torbridgeNickname: {
      get() {
        return this.$store.state.setting.torbridge.nickname
      },
      set(value) {
        this.$store.state.setting.torbridge.nickname = value
      },
    },
    torbridgeEmail: {
      get() {
        return this.$store.state.setting.torbridge.email
      },
      set(value) {
        this.$store.state.setting.torbridge.email = value
      },
    },
    nextcloudEmail: {
      get() {
        return this.$store.state.setting.nextcloud.email
      },
      set(value) {
        this.$store.state.setting.nextcloud.email = value
      },
    },
    nextcloudDomain: {
      get() {
        return this.$store.state.setting.nextcloud.domain
      },
      set(value) {
        value = value.replace('http://', '').replace('https://', '').replace('/', '')
        this.$store.state.setting.nextcloud.domain = value
      },
    },
    nextcloudDb: {
      get() {
        return this.$store.state.setting.nextcloud.db
      },
      set(value) {
        this.$store.state.setting.nextcloud.db = value
      },
    },
  },
  methods: {
    changeDNS(val) {
      this.selectedDNS = this.dnsList.length - 1
    },
    handleChooseDNS(val) {
      this.dnsFirst = this.dnsList[val].first
      this.dnsSecond = this.dnsList[val].second
    },
    handleApply() {
      if (this.torbridgePtPort === this.torbridgeOrPort) {
        this.invalidTorbridgePort = true
      } else if (
        !validateIPaddress(this.dnsFirst) ||
        !validateIPaddress(this.dnsSecond)
      ) {
        this.invalidDNS = true
      } else {
        this.modalOpen = false
        this.invalidDNS = false
        this.invalidTorbridgePort = false
      }
    },
    handleCancel() {
      this.modalOpen = false
      this.invalidDNS = false
      this.invalidTorbridgePort = false
      this.selectedDNS = 0
      this.shadowsocksV2RayPlugin = false
      this.$store.dispatch('resetDNS')
    },
    handleLinkTo(url) {
      isElectron ? require('electron').shell.openExternal(url) : redirectTo(url)
    },
  },
}
</script>
