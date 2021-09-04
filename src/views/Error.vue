<template>
  <div class="page">
    <el-empty description="未找到相应的页面"></el-empty>
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'

export default {
  props: {},
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      search_data: {
        team_id: '',
        subject_id: '',
        keyword: '',
      },
      condition_data: {
        team: [],
        subject: [],
      },
      page: 1,
      count: 0,
      limit: 10,

      list: [],
    })

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

}
</style>
