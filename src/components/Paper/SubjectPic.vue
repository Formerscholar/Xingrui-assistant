<template>
  <div class="com">
    <div class="img_box">
      <img :src="src">
    </div>
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs, watch} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'

export default {
  props: {
    subject_id:{
      type:Number,
      default:0
    }
  },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      src:require('@/assets/img/subject/1.png'),
    })

    watch(
        () => props.subject_id,
        (data, prevdata) => {
          renderImg()
        }
    )

    onMounted(() => {
      renderImg()
    })

    const renderImg = () => {
      switch (props.subject_id){
        case 18:
          state.src = require('@/assets/img/subject/1.png').default
          break
        case 19:
          state.src = require('@/assets/img/subject/2.png').default
          break
        case 20:
          state.src = require('@/assets/img/subject/3.png').default
          break
        case 21:
          state.src = require('@/assets/img/subject/4.png').default
          break
        case 22:
          state.src = require('@/assets/img/subject/5.png').default
          break
        default:
          alert(1)
          break
      }
    }

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style scoped lang="scss">
.com {
  .img_box{
    margin-right: 1.895rem;
    img{
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
