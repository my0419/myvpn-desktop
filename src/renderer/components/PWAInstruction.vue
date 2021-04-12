<template>
  <div v-if="isMobile" class="pwa-instruction">
    <div class="pwa-instruction-content">
      <h2 class="pwa-instruction-header">{{ $t('Install the MyVPN app directly from your browser') }}</h2>
      <p v-if="manual.steps.length > 1" class="pwa-instruction-text">{{ `${$t('Step')} ${carouselIndex + 1}` }}</p>
      <el-carousel
        ref="carousel"
        trigger="click"
        arrow="never"
        height="50vh"
        indicator-position="none"
        :autoplay="false"
        :loop="false"
        @change="carouselChange"
      >
        <el-carousel-item v-for="step in manual.steps" :key="step">
          <img class="pwa-instruction-image" :src="step">
        </el-carousel-item>
      </el-carousel>
      <div v-if="manual.steps.length > 1" class="pwa-instruction-step-controls btn-group">
        <el-button class="btn-group-item" :disabled="!carouselIndex" size="mini" v-on:click="onPrevStep" type="info">{{ $t('Prev Step') }}</el-button>
        <el-button class="btn-group-item" :disabled="manual.steps.length - 1 === carouselIndex" size="mini" v-on:click="onNextStep" type="info">{{ $t('Next Step') }}</el-button>
      </div>
      <div class="pwa-instruction-buttons btn-group">
        <el-button id="pwa_instruction_ok" class="btn-group-item" v-on:click="close" type="primary">Ok</el-button>
      </div>
      <div class="pwa-instruction-checkbox">
        <el-checkbox
          v-model="checked"
          @change="checkboxChange"
        >
          {{ $t('Do not show again') }}
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '~mixins';
  .pwa-instruction {
    position: fixed;
    display: none;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    &--visible {
      display: flex;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, .7);
        z-index: 1;
      }
    }
    &-content {
      display: flex;
      position: absolute;
      flex-direction: column;
      top: 50%;
      left: 15px;
      right: 15px;
      min-height: 70vh;
      max-height: 90vh;
      padding: 1.4rem 1.4rem 1.6rem;
      background: linear-gradient(5.41deg,#191919,#313131);
      transform: translateY(-50%);
      border-radius: 2px;
      overflow-x: hidden;
      overflow-y: auto;
      z-index: 2;
    }
    &-header {
      margin-bottom: 20px;
      font-size: .9rem;
      text-align: center;
    }
    &-image {
      display: flex;
      flex: 0 0 auto;
      margin: 0 auto;
      max-width: 97%;
      height: 100%;
      object-fit: contain;
    }
    &-step-controls {
      margin-top: 10px;
      .el-button--info.is-disabled, .el-button--info.is-disabled:active, .el-button--info.is-disabled:focus, .el-button--info.is-disabled:hover {
        background: linear-gradient(77.02deg,#131313 -85.04%,#383838 162.69%);
        color: #c1c1c1;
        border-color: #444;
        opacity: .5;
      }
    }
    &-buttons {
      margin-top: 20px;
      .btn-group-item {
        width: 100%;
      }
    }
    &-checkbox {
      display: flex;
      justify-content: center;
      margin-top: 18px;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
      }
      .el-checkbox__label {
        font-size: .7rem;
      }
    }
    &-text {
      margin: .8rem 0 .8rem;
      text-align: center;
      color: #c1c1c1;
    }
  }
</style>

<script>
  import { isMobile, localStorageService } from '../../lib/utils'

  export default {
    name: 'pwa-instruction',
    props: ['manual'],
    data () {
      return {
        isMobile: isMobile.any(),
        carouselIndex: 0,
        checked: false,
        neverShowAgain: JSON.parse(localStorageService.get('my_vpn_never_show_instructions')) || false
      }
    },
    methods: {
      close () {
        localStorageService.set('my_vpn_never_show_instructions', this.neverShowAgain)
        document.querySelector('.pwa-instruction--visible')
          .classList.remove('pwa-instruction--visible')
      },
      checkboxChange (state) {
        this.neverShowAgain = state
      },
      carouselChange (index) {
  		  this.carouselIndex = index
  	  },
      onNextStep () {
        this.$refs.carousel.next()
      },
      onPrevStep () {
        this.$refs.carousel.prev()
      }
    }
  }
</script>