<template>
    <div>
        <el-dialog
                :title="$t('Network Test')"
                :visible.sync="running"
                width="80%"
                :before-close="handleClose">
                    <div class="wrapper">
                        <table>
                            <tr class="heading">
                                <th class="info region_name">{{ $t('Region Name') }}</th>
                                <th class="stats region_mean">{{ $t('Mean') }}</th>
                                <th class="stats region_lowest">{{ $t('Min') }}</th>
                                <th class="stats region_highest">{{ $t('Max') }}</th>
                                <th class="stats" v-for="(_, index) in result">
                                    {{ $t('Test')}} {{ index }}
                                </th>
                            </tr>
                            <tr v-for="(region, index) in regions">
                                <td class="info region_name">{{ region.name }}</td>
                                <td class="stats region_mean">
                            <span class="color" v-if="calcMean(index)" v-bind:style="{'color': regionHighlight(calcMean(index)) }">
                                {{ calcMean(index) }} {{ $t('ms') }}
                            </span>
                                    <i v-else class="el-icon-loading"></i>
                                </td>
                                <td class="stats region_lowest">
                                    <span class="color" v-if="calcLowest(index)" v-bind:style="{'color': regionHighlight(calcLowest(index)) }">{{ calcLowest(index) }} {{ $t('ms') }}</span>
                                    <i v-else class="el-icon-loading"></i>
                                </td>
                                <td class="stats region_highest">
                                    <span class="color" v-if="calcHighest(index)" v-bind:style="{'color': regionHighlight(calcHighest(index)) }">{{ calcHighest(index) }} {{ $t('ms') }}</span>
                                    <i v-else class="el-icon-loading"></i>
                                </td>
                                <template v-for="step in result">
                                    <td class="test">
                                        <template v-for="(val, regionIndex) in step">
                                    <span v-if="regionIndex === index">
                                        <span class="color" v-if="val" v-bind:style="{'color': regionHighlight(val) }">
                                            <span v-if="val >= 1000">N/A</span>
                                            <span v-else>{{ val }} {{ $t('ms') }}</span>
                                        </span>
                                        <i v-else class="el-icon-loading"></i>
                                    </span>
                                        </template>
                                    </td>
                                </template>

                            </tr>
                        </table>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="running = false" size="mini">{{ $t('Close') }}</el-button>
                    </span>
        </el-dialog>
        <p></p>
        <a href="#" v-on:click.prevent="() => startPing()">{{ $t('Network Test') }}</a>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { ping } from '../../lib/stats'
  export default {
    props: ['regions'],
    data () {
      return {
        result: {},
        running: false
      }
    },
    computed: mapState({
      selectedProvider: state => state.provider.name,
    }),
    methods: {
      handleClose: function () {
        this.running = false
      },
      regionHighlight: function (value) {
        if (value <= 200) {
          return '#19ec00'
        } else if (value <= 250) {
          return '#b3d400'
        } else if (value <= 300) {
          return '#d4c400'
        } else if (value <= 400) {
          return '#f97e00'
        } else {
          return '#e80000'
        }
      },
      regionValues: function (regionIndex) {
        let values = []
        for (let row in this.result) {
          let val = this.result[row].filter((v, i) => v && i === regionIndex).pop()
          if (val) {
            values.push(val)
          }
        }
        return values
      },
      calcMean: function (regionIndex) {
        let res = ping.mean(this.regionValues(regionIndex))
        if (res > 0) {
          return Math.round(res)
        }
      },
      calcLowest: function (regionIndex) {
        let res = ping.lowest(this.regionValues(regionIndex))
        if (res > 0 && res !== Infinity) {
          return Math.round(res)
        }
      },
      calcHighest: function (regionIndex) {
        let res = ping.highest(this.regionValues(regionIndex))
        if (res > 0) {
          return Math.round(res)
        }
      },
      startPing: function () {
        if (this.running === true) {
          return
        }
        this.running = true
        let row = 0
        const countRegions = this.regions.length
        const pingRegion = async (index, result) => {
          let region = this.regions[index]
          let nextIndex = index + 1
          if (index === 0) {
            row += 1
          }
          if (row > 20) { // stop limit
            return
          }
          const startTime = Date.now()
          let image = new Image()
          let timeout = setTimeout(() => {
            image.src = ''
          }, 1500)
          let complete = () => {
            if (typeof result[row] === 'undefined') {
              result[row] = new Array(countRegions)
            }
            result[row][index] = Date.now() - startTime
            this.result = {}
            this.result = result
            clearTimeout(timeout)
            if (this.running === true) {
              pingRegion(nextIndex > countRegions - 1 ? 0 : nextIndex, result)
            } else {
              this.result = {}
              console.log('Ping stopped')
            }
          }
          image.onerror = complete
          image.src = region.speedtest+'?r='+Date.now()
        }
        this.running = true
        pingRegion(0, {})
      }
    },
    beforeDestroy: function () {
      this.running = false
    }
  }
</script>

<style lang="scss" scoped>
  @import '~mixins';
  .wrapper {
      overflow-x: scroll;
  }
  table {
      display: table;
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      color: #c1c1c1;
  }
  th {
      text-align: center;
  }
  tr {
      cursor: default;
      border-bottom: 1px solid rgba(0,0,0,0.12);
  }
  td {
      padding: 5px 5px;
      display: table-cell;
      vertical-align: middle;
      border-radius: 2px;
      min-width: 80px;
      text-align: center;
  }
  td.info {
      min-width: 130px !important;
  }
  tr:hover {
      background-color: #3e3e3e;
  }
</style>