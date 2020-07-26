<template>
    <el-radio-group v-model="type">
        <el-radio class="type-radio" v-for="item of listTypes"  :label="item.key" border>{{ item.title }}</el-radio>
    </el-radio-group>
</template>

<style>
    .type-radio {
        margin: 10px 10px 10px 0 !important;
    }
    .type-radio:last-child {
        margin-right: 0 !important;
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
