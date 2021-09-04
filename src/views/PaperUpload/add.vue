<template>
  <div class="page">

  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs} from 'vue'
import storage from '@/utils/storage'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'

export default {
  props: {},
  setup(props, context) {
    const router = useRouter()
    const store = useStore()

    const state = reactive({})

    onMounted(() => {

    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style scoped lang="scss">
.page {
  background: #ffffff;
  position: relative;
}
</style>
