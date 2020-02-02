<template>
    <div>
        <el-select v-model="region" placeholder="New York" :disabled="listRegions.length === 0">
            <el-option v-for="r in listRegions" :key="r.slug" :label="r.name" :value="r.slug"></el-option>
        </el-select>
        <div v-if="listRegions.length > 0 && speedtestAvailable">
            <ModalSpeedTest :regions="listRegions" />
        </div>
    </div>
</template>

<script>
  import ModalSpeedTest from './ModalSpeedTest'
  export default {
    components: {ModalSpeedTest},
    computed: {
      listRegions: {
        get () {
          return this.$store.state.provider.regions
        }
      },
      region: {
        get () {
          return this.$store.state.region.value
        },
        set (value) {
          this.$store.dispatch('updateRegion', value)
        }
      },
      speedtestAvailable: {
        get () {
          return this.$store.state.provider.regions.every(region => {
            return region.speedtest
          })
        }
      }
    }
  }
</script>
