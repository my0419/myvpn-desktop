<template>
    <div>
        <div class="blobs">
            <div class="blob-center"></div>
            <div class="blob"></div>
            <div class="blob"></div>
            <div class="blob"></div>
            <div class="blob"></div>
            <div class="blob"></div>
            <div class="blob"></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: none">
            <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    <feBlend in="SourceGraphic" in2="goo" />
                </filter>
            </defs>
        </svg>
    </div>
</template>

<style lang="scss" scoped>
    @import '~mixins';
    $bolb-color: #ff6715;

    // Loader
    .blobs {
        filter: url(#goo);
        width: 300px;
        height: 200px;
        position: relative;
        overflow: hidden;
        border-radius: 70px;
        transform-style: preserve-3d;
        margin: 0 auto;
        @include mqMAX($XS) {
            width: 200px;
            height: 200px;
        }
        // Blob center item
        .blob-center {
            transform-style: preserve-3d;
            position: absolute;
            background: $bolb-color;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            transform-origin: left top;
            transform: scale(.9) translate(-50%, -50%);
            animation: blob-grow
            linear
            3.4s
            infinite;
            border-radius: 50%;
            box-shadow: 0 -10px 40px -5px $bolb-color;
        }
    }

    // Blob item
    .blob {
        position: absolute;
        background: $bolb-color;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        animation: blobs
        ease-out
        3.4s
        infinite;
        transform: scale(.9) translate(-50%, -50%);
        transform-origin: center top;
        opacity: 0;

        // Set animation delay for each of type
        @for $i from 1 to 6 {
            &:nth-child(#{$i}) {
                animation-delay: $i * 0.2 + s;
            }
        }
    }

    // Mozilla fix
    @-moz-document url-prefix() {
        .blobs {
            filter: none !important;
            width: 300px;
            height: 200px;
            position: relative;
            overflow: hidden;
            border-radius: 70px;
            transform-style: preserve-3d;
            margin: 0 auto;
        }
    }

    // Keyframes variables
    $left: calc(-330px - 50%);
    $right: calc(330px - 50%);

    // Keyframes
    @keyframes blobs {
        0% {
            opacity: 0;
            transform: scale(0) translate($left, -50%);
        }
        1% {
            opacity: 1;
        }
        35%,65% {
            opacity: 1;
            transform: scale(.9) translate(-50%, -50%);
        }
        99% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: scale(0) translate($right, -50%);
        }
    }

    @keyframes blob-grow {
        0%,  39% {
            transform: scale(0) translate(-50%, -50%);
        }
        40%, 42% {
            transform: scale(1, .9) translate(-50%, -50%);
        }
        43%, 44% {
            transform: scale(1.2, 1.1) translate(-50%, -50%);
        }
        45%, 46% {
            transform: scale(1.3, 1.2) translate(-50%, -50%);
        }
        47%, 48% {
            transform: scale(1.4, 1.3) translate(-50%, -50%);
        }
        52%{
            transform: scale(1.5, 1.4) translate(-50%, -50%);
        }
        54% {
            transform: scale(1.7, 1.6) translate(-50%, -50%);
        }
        58% {
            transform: scale(1.8, 1.7) translate(-50%, -50%);
        }
        68%, 70% {
            transform: scale(1.7, 1.5) translate(-50%, -50%);
        }
        78% {
            transform: scale(1.6, 1.4) translate(-50%, -50%);
        }
        80%, 81% {
            transform: scale(1.5, 1.4) translate(-50%, -50%);
        }
        82%, 83% {
            transform: scale(1.4, 1.3) translate(-50%, -50%);
        }
        84%, 85% {
            transform: scale(1.3, 1.2) translate(-50%, -50%);
        }
        86%, 87% {
            transform: scale(1.2, 1.1) translate(-50%, -50%);
        }
        90%, 91% {
            transform: scale(1, .9) translate(-50%, -50%);
        }
        92%, 100% {
            transform: scale(0) translate(-50%, -50%);
        }
    }
</style>
