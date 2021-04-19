<template>
    <div class="app-page page-droplets">
        <h1>{{ $t('Your Servers') }}</h1>
        <hr />
        <div class="page-droplets-nav">
          <el-button class="droplets-btn droplets-btn--left" type="success" v-on:click="handleMainPage" icon="el-icon-arrow-left" round>{{ $t('Go Back') }}</el-button>
          <el-button class="droplets-btn droplets-btn--right" type="primary" :disabled="dropletLoading" round @click="handleUpdateDroplets">
              <i v-if="dropletLoading" class="el-icon-loading"></i>
              <i v-else class="el-icon-refresh-right"></i> {{ $t('Update the list') }}
          </el-button>
        </div>
        <div>
            <el-alert class="m-top" v-if="dropletEmpty === true" :title="$t('The list of servers is empty')" type="info" />
            <el-row v-loading.lock="deleteLoading" v-else>
                <el-col class="box-card-col" :span="11" v-for="(droplet, index) in dropletList" :key="index" :offset="index % 2 ? 1 : 0">
                    <el-card class="box-card m-top" v-bind:style="{ opacity: deletedDroplets.indexOf(droplet.id) === -1 ? 1 : 0.3 }">
                        <div slot="header" class="clearfix">
                            <strong>{{ droplet.name }}, {{ droplet.image.distribution }} {{ droplet.image.name }}</strong>
                        </div>
                        <div class="text item">
                            <h4>{{ $t('IP')}}: <strong v-if="droplet.networks.v4.length > 0">{{ droplet.networks.v4[0].ip_address }}</strong><strong v-else>N/A</strong></h4>
                            <h4>{{ $t('Type')}}: <strong>{{ droplet.type || 'N/A' }}</strong></h4>
                            <h4>{{ $t('Status')}}: <strong>{{ droplet.status }}</strong></h4>
                            <h4>{{ $t('Region')}}: <strong>{{ droplet.region.name }}</strong></h4>
                            <h4>{{ $t('Created')}}: <strong>{{ formattedDaysAgo(droplet.created_at) }}</strong></h4>
                            <el-button class="delete-button" v-if="droplet.locked === false && deletedDroplets.indexOf(droplet.id) === -1" @click="() => handleDelete(droplet)" type="text">{{ $t('Delete') }}</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<style lang='scss' scoped>
  @import '~mixins';
  h4 {
      margin: 4px 0;
  }
  .page-droplets {
    @include mqMAX($XXS) {
      display: flex;
      flex-direction: column;
    }
    .page-droplets-nav {
      @include mqMAX($XXS) {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-top: -25px;
      }
    }
    .box-card-col {
      @include mqMAX($XS) {
        margin-left: 0;
        width: 100%;
      }
    }
    .droplets-btn {
      @include mqMAX($XXS) {
        border-radius: 4px;
        &--left {
          width: 100px;
        }
        &--right {
          margin-left: auto;
          width: calc(100% - 110px);
        }
      }
    }
    .delete-button {
      margin-top: 10px;
      color: #d4682c;
      padding: 7px;
      font-size: 0.7rem;
      @include mqMAX($XXS) {
        margin-top: 12px;
        width: 100%;
        height: 30px;
      }
    }
  }
</style>

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
        return moment(time).locale(this.$i18n.locale).fromNow()
      },
      handleDelete: function (droplet) {
        let res = this.client.deleteServer(droplet.id)
        this.deleteLoading = true
        res.then(res => {
          this.deletedDroplets.push(droplet.id)
          this.$message({message: this.$root.$t('Server successfully removed'), type: 'success', showClose: true})
          this.handleUpdateDroplets()
        }, res => {
          this.$message({message: this.$root.$t('Deletion error. Please update the list and try again.'), type: 'error', showClose: true})
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
