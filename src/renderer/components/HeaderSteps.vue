<template>
    <el-steps :space="200" :active="active||0" simple>
        <el-step :title="$t('Parameters')" icon="el-icon-set-up"></el-step>
        <el-step :title="$t('Server configuration')" icon="el-icon-cloudy"></el-step>
        <el-step :title="$t('Your VPN')" icon="el-icon-tickets"></el-step>
    </el-steps>
</template>

<script>
  export default {
    props: ['active']
  }
</script>
