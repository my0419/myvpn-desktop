<template>
    <div class="app__head">
        <div class="app__window-icon">
            <img class="app__window-icon-logo" :src="staticPath + '/img/logo-small.png'"/>
        </div>
        <div class="app__window-right">
            <div class="app__window-lang">
                <a href="#" v-on:click.prevent="changeLang">
                    {{ $i18n.locale === 'ru' ? 'ENG' : 'RUS' }}
                </a>
            </div>
            <div v-if="!isBrowser" class="app__window-line"></div>
            <div v-if="!isBrowser" class="app__window-control">
                <div class="app__window-control-icon">
                    <a href="#" v-on:click.prevent="windowMinimize">
                        <img :src="staticPath + '/img/window/minimize.svg'"/>
                    </a>
                </div>
                <div class="app__window-control-icon">
                    <a href="#" v-on:click.prevent="windowMaximize">
                        <img :src="staticPath + '/img/window/maximize.svg'"/>
                    </a>
                </div>
                <div class="app__window-control-icon">
                    <a href="#" v-on:click.prevent="windowClose">
                        <img :src="staticPath + '/img/window/close.svg'"/>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const isBrowser = process.browser
    if (!isBrowser) {
      const { remote } = require('electron')
    }
    export default {
        data() {
            return {
                staticPath: process.browser || process.env.NODE_ENV === 'development' ? 'static' : __static,
                isBrowser
            }
        },
        methods: {
            windowMinimize: () => {
                remote.BrowserWindow.getFocusedWindow().minimize()
            },
            windowMaximize: () => {
                if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
                    remote.BrowserWindow.getFocusedWindow().unmaximize();
                } else {
                    remote.BrowserWindow.getFocusedWindow().maximize();
                }
            },
            windowClose: () => {
                remote.BrowserWindow.getFocusedWindow().close()
            },
            changeLang: function () {
                this.$i18n.locale = this.$i18n.locale === 'ru' ? 'en' : 'ru'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app {
        &__window-icon-logo {
            width: 24px;
            padding-left: 6px;
            float: left;
        }

        &__head {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            -webkit-app-region: drag;
            display: block;
            width: 100%;
            height: 24px;
            background: #4d4d4d;
        }

        &__window-lang {
            display: inline-block;
            height: 20px;
            a {
                font-weight: 400;
                color: #b0b0b0;
            }
        }

        &__window-line {
            display: inline-block;
            border-right: 1px solid #3b3b3b;
            height: 15px;
            margin-bottom: 5px;
            margin-right: 5px;
            margin-left: 10px;
        }
        &__window-right {
            float: right;
            -webkit-app-region: no-drag;
            display: flex;
            align-items: center;
            height: 27px;
            padding-right: 10px;
        }

        &__window-control {
            display: inline;
            img {
                &:hover {
                    opacity: 0.8;
                }
            }

            a {
                display: inline-block;
                cursor: pointer;
                height: 24px;
            }
        }

        &__window-control-icon {
            width: 20px;
            display: inline-block;
        }
    }
</style>
