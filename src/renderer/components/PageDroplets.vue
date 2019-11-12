<template>
    <div class="app-page">
        <h1>{{ $t('Your Servers') }}</h1>
        <hr />
        <el-button type="success" v-on:click="handleMainPage" icon="el-icon-arrow-left" round>{{ $t('Go Back') }}</el-button>
        <el-button type="primary" :disabled="dropletLoading" round @click="handleUpdateDroplets">
            <i v-if="dropletLoading" class="el-icon-loading"></i>
            <i v-else class="el-icon-refresh-right"></i> {{ $t('Update the list') }}
        </el-button>
        <div>
            <el-alert class="m-top" v-if="dropletEmpty === true" :title="$t('The list of servers is empty')" type="info" />
            <el-row v-loading.lock="deleteLoading" v-else>
                <el-col :span="11" v-for="(droplet, index) in dropletList" :key="index" :offset="index % 2 ? 1 : 0">
                    <el-card class="box-card m-top" v-bind:style="{ opacity: deletedDroplets.indexOf(droplet.id) === -1 ? 1 : 0.3 }">
                        <div slot="header" class="clearfix">
                            <strong>{{ droplet.name }}, {{ droplet.image.distribution }} {{ droplet.image.name }}</strong>
                            <el-button v-if="droplet.locked === false && deletedDroplets.indexOf(droplet.id) === -1" @click="() => handleDelete(droplet)" style="float: right; padding: 3px 0;color: red;" type="text">{{ $t('Delete') }}</el-button>
                        </div>
                        <div class="text item">
                            <h4>{{ $t('IP')}}: <strong v-if="droplet.networks.v4.length > 0">{{ droplet.networks.v4[0].ip_address }}</strong><strong v-else>N/A</strong></h4>
                            <h4>{{ $t('Status')}}: <strong>{{ droplet.status }}</strong></h4>
                            <h4>{{ $t('Region')}}: <strong>{{ droplet.region.name }}</strong></h4>
                            <h4>{{ $t('Created')}}: <strong>{{ formattedDaysAgo(droplet.created_at) }}</strong></h4>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'

  export default {
    computed: mapState({
      configuredSuccess: state => state.provider.configuredSuccess,
      dropletLoading: state => state.droplet.loading,
      dropletList: state => state.droplet.list,
      dropletEmpty: state => state.droplet.isEmpty,
      client: state => state.provider.client
    }),
    data () {
      return {
        deleteLoading: null,
        deletedDroplets: []
      }
    },
    mounted: function () {
      if (!this.configuredSuccess) {
        this.$router.push({ name: 'main' })
      } else {
        this.handleUpdateDroplets()
      }
    },
    methods: {
      formattedDaysAgo: function (time) {
        return moment(time).lang(this.$i18n.locale).fromNow()
      },
      handleDelete: function (droplet) {
        let res = this.client.deleteServer(droplet.id)
        this.deleteLoading = true
        res.then(res => {
          this.deletedDroplets.push(droplet.id)
          this.$message({message: this.$root.$t('Server successfully removed'), type: 'success'})
          this.handleUpdateDroplets()
        }, res => {
          this.$message({message: this.$root.$t('Deletion error. Please update the list and try again.'), type: 'error'})
        }).finally(_ => this.deleteLoading = false)
      },
      handleUpdateDroplets: function () {
        this.$store.dispatch('loadDroplets', {client: this.client})
      },
      handleMainPage: function () {
        this.$router.push({ name: 'main' })
      }
    }
  }
</script>
