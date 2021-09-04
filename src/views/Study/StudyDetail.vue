<template>
  <div id="StudyDetail">
    <div class="box info_box">
      <h4>{{ study_data.student_name }}的上课记录</h4>
      <el-form>
        <el-form-item label="上课时间">
          {{ setTimerType(study_data.study_time*1000) }}
        </el-form-item>
        <el-form-item label="课程">
          {{ study_data.course_name }}
        </el-form-item>
        <el-form-item label="上课内容">
          {{ study_data.content }}
        </el-form-item>
      </el-form>
    </div>
    <div class="box question_box">
      <h4>已收录错题 {{ study_data.mistake_count }} 题</h4>
      <div class="question_list">
        <div class="question_item" v-for="(item,index) in questions" :key="index">
          <div class="ord">{{index + 1}}.</div>
          <div class="detail"><div class="title" v-html="item.content"></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute,useRouter } from 'vue-router'
import { Message } from 'element-plus'
import { studyDetail } from '@/network/Study'
import { setTimerType, Timestamp } from '@/utils'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      study_id:'',
      study_data : {
        student_name:'',
        study_time:'',
        course_name:'',
        content:'',
        mistake_count:0,
      },
      questions:[]
    })

    onMounted(() => {
      state.study_id = route.params.id
      loadStudyData()
    })

    const loadStudyData = async () => {
      const { code, data, msg } = await studyDetail({
        id:state.study_id
      })
      if(!code)
      {
        state.study_data.student_name = data.study_data.student_name
        state.study_data.study_time = data.study_data.study_time
        state.study_data.course_name = data.study_data.course_data.name
        state.study_data.content = data.study_data.content
        state.study_data.mistake_count = data.study_data.mistake_count
        state.questions = data.questions
      }
    }

    return {
      ...toRefs(state),
      store,
      setTimerType,
    }
  },
}
</script>

<style scoped lang="scss">
#StudyDetail {
  width: 100%;
  height: 100%;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  position: relative;
  padding: 0 !important;

  .box{
    margin-bottom: 0.9375rem;
    background: #FFFFFF;
    padding: 1.875rem;
    h4,h5{
      margin: 0;
      padding: 0;
      height: 3rem;
      line-height: 3rem;
    }
    h4{
      font-size: 1rem;
    }
    h5{
      font-size: 0.8rem;
      font-weight: normal;
    }
  }
  .info_box{

  }
  .question_box{
    .question_list{
      display: flex;
      flex-direction: column;
      .question_item{
        flex: 1;
        display: flex;
        flex-direction: row;
        margin-bottom: .5rem;
        .ord{

        }
        .detail{
          margin-left: .3rem;
          .title{
             &::v-deep(p) {
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        }
      }
    }
  }
}
</style>
