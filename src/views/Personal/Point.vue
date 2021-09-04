<template>
  <div id="Personal">
    积分
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter,useRoute } from 'vue-router'

export default {
  setup() {
    const state = reactive({

    })

    return {
      state,
    }
  },
}
</script>

<style scoped lang="scss">
#Personal {
  padding: 0 !important;

}
</style>
