<template>
    <div>
        <h3 class="title">{{ $t('Setup SSH Connection') }}</h3>
        <el-form :inline="true">
            <el-form-item :label="$t('User')">
                <el-input v-model="user" class="input-user" placeholder="root"></el-input>
            </el-form-item>
            <el-form-item label="IP">
                <el-input v-model="ip" class="input-ip" @change="handleChangeIp" />
            </el-form-item>
            <el-form-item :label="$t('Port')">
                <el-input-number v-model="port" class="input-port" controls-position="right" :min="1" :max="65535" />
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item>
                <el-checkbox v-model="isPrivateKey">{{ $t('Private Key Authorization') }}</el-checkbox>
            </el-form-item>
            <el-form-item v-if="!isPrivateKey">
                <el-input v-model="password" class="input-ip" :placeholder="$t('Password')" />
            </el-form-item>
            <el-form-item v-else>
                <el-input v-model="privateKey" type="textarea" :rows="2" :placeholder="$t('Paste in the server private key')">
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
    .title {
        color: #6ea0e3;
    }
    .input-user {
        width: 100px;
    }
    .input-port {
        width: 100px;
    }
</style>

<style>
    .el-form-item {
        margin-bottom: 0px;
    }
</style>

<script>
  export default {
    mounted () {
      this.handleChangeIp()
    },
    computed: {
      isPrivateKey: {
        get () {
          return this.$store.state.server.sshPrivateKey !== null
        },
        set (value) {
          this.$store.state.server.sshPrivateKey = value ? '' : null
        }
      },
      privateKey: {
        get () {
          return this.$store.state.server.sshPrivateKey
        },
        set (value) {
          this.$store.state.server.sshPrivateKey = value
        }
      },
      user: {
        get () {
          return this.$store.state.server.sshUser
        },
        set (value) {
          this.$store.state.server.sshUser = value
        }
      },
      ip: {
        get () {
          return this.$store.state.server.ipv4
        },
        set (value) {
          this.$store.state.server.ipv4 = value
        }
      },
      port: {
        get () {
          return this.$store.state.server.sshPort
        },
        set (value) {
          this.$store.state.server.sshPort = value
        }
      },
      password: {
        get () {
          return this.$store.state.server.sshPassword
        },
        set (value) {
          this.$store.state.server.sshPassword = value
        }
      }
    },
    methods: {
      handleChangeIp () {
        if (this.ip.length === 0 || !require('net').isIP(this.ip)) {
          this.$message({message: this.$root.$t('IP field is not filled in correctly'), type: 'error'})
          this.ip = ''
          this.$store.state.provider.configuredSuccess = false
        } else {
          this.$store.state.provider.configuredSuccess = true
        }
      }
    }
  }
</script>
