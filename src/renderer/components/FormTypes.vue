<template>
    <el-radio-group class="type-radio-list" v-model="type">
        <el-radio class="type-radio" v-for="item of listTypes"  :label="item.key" border>{{ item.title }}</el-radio>
    </el-radio-group>
</template>

<style lang="scss" scoped>
    @import '~mixins';
    .type-radio-list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      @include mqMAX($XXS) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
        margin-bottom: 10px;
      }
    }
    .type-radio {
      background: rgba(0,0,0,0.2);
      margin: 10px 10px 10px 0 !important;
      @include mqMAX($XXS) {
        margin: 0 !important;
      }
    }
</style>

<script>
  export default {
    computed: {
      listTypes: {
        get () {
          return this.$store.state.type.list
        }
      },
      type: {
        get () {
          return this.$store.state.type.selected
        },
        set (value) {
          this.$store.dispatch('updateType', value)
        }
      }
    }
  }
</script>
