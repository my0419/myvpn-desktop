<template>
  <div v-if="isMobile" class="pwa-popup">
    <div class="pwa-popup-wrapper">
      <img :src="icon" class="pwa-popup-logo" alt="logo" />
      <p class="pwa-popup-text">{{ text }}</p>
    </div>
    <div class="pwa-popup-buttons btn-group">
      <el-button class="btn-group-item btn-group-item--left" v-on:click="close" type="info">{{ $t('Cancel') }}</el-button>
      <el-button id="pwa_ok" class="btn-group-item btn-group-item--left" v-on:click="close" type="primary">Ok</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '~mixins';
  .pwa-popup {
    position: fixed;
    display: none;
    flex-direction: column;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1.4rem 1.4rem 1.6rem;
    background-color: #4d4d4d;
    z-index: 99999;
    &--visible {
      display: flex;
    }
    &-wrapper {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-bottom: 1.4rem;
    }
    &-logo {
      display: flex;
      flex: 0 0 auto;
      margin: 0 .8rem 0 0;
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    &-text {
      margin-top: 0;
      color: #c1c1c1;
    }
    &-buttons {

    }
  }
</style>

<script>
  import { isMobile } from '../../lib/utils'
  export default {
    props: ['text', 'icon'],
    name: 'pwa-popup',
    data () {
      return {
        isMobile: isMobile.any()
      }
    },
    methods: {
      close () {
        document.querySelector('.pwa-popup--visible')
          .classList.remove('pwa-popup--visible')
      },
    }
  }
</script>