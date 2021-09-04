<template>
  <div class="page">
    <el-tabs v-model="active_name" @tab-click="onTabsChange" :lazy="true">
      <el-tab-pane label="上课记录" name="first">
        <TabStudy :id="id" />
      </el-tab-pane>
      <el-tab-pane label="课程购买记录" name="second">
        <TabBuy :id="id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs,onBeforeMount} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import TabStudy from "./TabStudy";
import TabBuy from "./TabBuy"

export default {
  props: {
    student_id:{
      type:Number,
      default:0,
    }
  },
  components:{
    TabStudy,
    TabBuy
  },

  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      active_name:'first',
      id:"",
    })

    onBeforeMount(() => {
      state.id = props.student_id
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
