<template>
    <el-input class="action-journal" type="textarea" :value="journal" placeholder="данные отсутствуют" wrap="off" readonly />
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState({
      journal: state => state.journal.log
    })
  }
</script>
