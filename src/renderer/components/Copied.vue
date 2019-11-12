<template>
    <span class="text-copy" v-clipboard="text" v-clipboard:success="clipboardSuccessHandler" v-clipboard:error="clipboardErrorHandler" >
        <i class="el-icon-document-copy"></i>&nbsp;<span v-if="hiddenText">{{ $t('Copy to clipboard') }}</span><span v-else>{{ text }}</span>
    </span>
</template>

<script>
  export default {
    props: ['text', 'hiddenText'],
    methods: {
      clipboardSuccessHandler ({ value, event }) {
        this.$message({message: this.$root.$t('Copied!'), type: 'success', duration: 800})
      },

      clipboardErrorHandler ({ value, event }) {
        console.log('error', value)
      }
    }
  }
</script>

<style scoped>
    .el-icon-document-copy {
        color: #5cb6ff;
    }
    .text-copy {
        cursor: pointer;
        text-decoration-style: dotted;
        border-bottom: 1px dotted;
    }
</style>
