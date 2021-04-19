<template>
    <span class="text-copy-wrap">
        <span class="text-copy" v-clipboard="text" v-clipboard:success="clipboardSuccessHandler" v-clipboard:error="clipboardErrorHandler" >
            <i class="el-icon-document-copy"></i>&nbsp;<span v-if="hiddenText">{{ $t('Copy to clipboard') }}</span><span v-else>{{ text }}</span>
        </span>
    </span>
</template>

<script>
  export default {
    props: ['text', 'hiddenText'],
    methods: {
      clipboardSuccessHandler ({ value, event }) {
        this.$message({message: this.$root.$t('Copied!'), type: 'success', duration: 800, showClose: true})
      },

      clipboardErrorHandler ({ value, event }) {
        console.log('error', value)
      }
    }
  }
</script>

<style scoped>
    .text-copy-wrap {
        margin-top: 5px;
    }
    .el-icon-document-copy {
        color: #d4682c;
    }
    .text-copy {
        cursor: pointer;
        color: #d4682c;
    }
</style>
