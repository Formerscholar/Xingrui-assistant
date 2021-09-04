<template>
  <div id="StudyAdd">
    <div class="main_box">
      <div class="left">
        <div class="box form_box">
          <h4 style="margin-bottom: 1rem">编辑上课记录</h4>
          <el-form :model="study_data" :rules="rules" ref="form_ref" label-width="80px">
            <el-form-item label="课程" prop="course_id">
              <el-select v-model="study_data.course_id" disabled>
                <el-option
                    v-for="(item,index) in search_condition.course"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="学生" prop="student_id">
                  <el-select v-model="study_data.student_id" disabled>
                    <el-option
                        v-for="(item,index) in search_condition.student"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="上课时间" prop="study_time">
                  <el-date-picker type="datetime" placeholder="选择日期" v-model="study_data.study_time"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="上课内容" prop="content">
              <el-input type="textarea" v-model="study_data.content" rows="6"></el-input>
            </el-form-item>
            <el-form-item label="点评" prop="comment">
              <el-input type="textarea" v-model="study_data.comment" rows="6"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="box question_box">
          <h4>选择收录错题<el-link href="javascript:void(0);" @click="allCheck">全选/反选</el-link></h4>
          <div class="question_list">
            <div class="question_item" v-for="(item,index) in search_condition.question" :key="item.id">
              <div><el-checkbox v-model="item.is_check">{{index+1}}.</el-checkbox></div>
              <div class="question_detail">
                <div class="question_title" v-html="item.question_data.content"></div>
              </div>
            </div>
          </div>
          <el-button class="add_btn" type="primary" @click="doSubmit">提交</el-button>
        </div>
      </div>
      <div class="right">
        <div class="box paper_box">
          <h4>最近考试</h4>
          <div class="paper_list">
            <div :class="['paper_item',{active:item.id === study_data.paper_id}]" v-for="item in search_condition.paper" :key="item.id" @click="onChangePaper(item.id)">
              <div class="paper_title">{{ item.title }}</div>
              <div class="paper_info">
                <div>出卷人：{{ item.user_data?item.user_data.name:"" }}</div>
                <div>组卷时间：{{
                    setTimerType(item.add_time * 1000, true)
                  }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs,ref } from 'vue'
import { useStore } from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
import { editStudy,saveStudy } from '@/network/Study'
import { setTimerType, Timestamp } from '@/utils'
import { getStudentList,getCourseList,getPaperList,getPaperQuestionList,getSchoolList } from '@/network/block'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      study_id:'',
      study_data:{
        school_id:'',
        course_id:'',
        student_id:'',
        study_time:'',
        comment:'',
        content:'',
        paper_id:'',
        questions:[],
      },
      search_condition:{
        school:[],
        student:[{}],
        course:[{}],
        paper:[],
        question:[],
      },
      loading:false,

      form_ref:ref(),
      rules: {
        school_id:[
          {required: true, message: '请选择校区', trigger: 'blur'},
        ],
        student_id: [
          {required: true, message: '请选择学生', trigger: 'blur'},
        ],
        study_time: [
          {required: true, message: '请选择上课时间', trigger: 'blur'},
        ],
        course_id: [
          {required: true, message: '请选择课程', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '请输入上课内容', trigger: 'blur'},
          {max: 1000, message: '最大长度限制1000个字符', trigger: 'blur'}
        ]
      },
    })

    onMounted(() => {
      state.study_data.school_id = store.state.userInfo.school_id
      state.study_id = route.params.id
      init()
    })

    const init = async () => {
      await loadStudyEdit()
      await loadSearchCondition()
    }

    const loadStudyEdit = async  () => {
      let {code,data} = await editStudy({
        id:state.study_id
      })
      if(!code)
      {
        state.study_data.school_id = data.study_data.school_id
        state.study_data.paper_id = data.study_data.paper_id
        state.study_data.student_id = data.study_data.student_id
        state.study_data.course_id = data.study_data.course_id
        state.study_data.comment = data.study_data.comment
        state.study_data.content = data.study_data.content
        state.study_data.study_time = new Date(data.study_data.study_time * 1000)
        state.study_data.questions = data.result

        onSchoolChange()

        await loadQuestion(state.study_data.paper_id)
      }
    }

    const loadSearchCondition = async () => {
      var {data} = await getSchoolList()
      state.search_condition.school = data

      var {data} = await getPaperList()
      state.search_condition.paper = data
    }

    const loadQuestion = async (paper_id) => {
      let {data} = await getPaperQuestionList({
        paper_id:paper_id,
        page:1,
        limit:100
      })

      state.search_condition.question = data.map((item) => {
        if(state.study_data.questions.includes(item.question_id))
          item.is_check = true
        else
          item.is_check = false

        return item
      })
    }

    const doSubmit = async () => {
      state.form_ref.validate( async (valid) => {
        if(valid)
        {
          let params = JSON.parse(JSON.stringify(state.study_data))
          params.study_time = Timestamp(params.study_time)

          let checked_quesitons = []
          state.search_condition.question.forEach((item) => {
            if(item.is_check)
              checked_quesitons.push({
                question_id : item.question_id,
                subject_id : item.question_data.subject_id,
                question_type:item.question_data.type
              })
          })
          params.questions = checked_quesitons

          params.id = state.study_id
          let {code,data,msg} = await saveStudy(params)

          if(!code)
            router.replace({
              path:'/study'
            })
        }
      })
    }

    const allCheck = () => {
      state.search_condition.question = state.search_condition.question.map(item => {
        item.is_check = !item.is_check
        return item
      })
    }

    const onChangePaper = async (paper_id) => {
      state.study_data.paper_id = paper_id
      state.study_data.questions = []

      await loadQuestion(paper_id)
    }

    const onSchoolChange = async () => {
      var {data} = await getStudentList({
        school_id:state.study_data.school_id
      })
      state.search_condition.student = data

      var {data} = await getCourseList({
        school_id:state.study_data.school_id
      })
      state.search_condition.course = data
    }

    return {
      ...toRefs(state),
      store,
      setTimerType,
      onChangePaper,
      doSubmit,
      allCheck,
    }
  },
}
</script>

<style scoped lang="scss">
#StudyAdd {
  display: flex;
  flex-direction: column;
  padding: 0!important;
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
  .main_box{
    display: flex;
    flex-direction: row;

    .left{
      flex-basis: 70%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .form_box{

      }
      .question_box{
        position: relative;
        h4{
          position: relative;
          .el-link{
            position: absolute;
            right: 1rem;
          }
        }
        .question_list{
          margin-bottom: 2rem;
          .question_item{
            display: flex;
            flex-direction: row;
            margin-bottom: .5rem;
            .question_check{
              flex-basis: 2rem;
            }
            .question_detail{
              flex: 1;
              display: flex;
              flex-direction: column;
              .question_title{
                 &::v-deep(p) {
                  margin: 0 !important;
                  padding: 0 !important;
                }
              }
            }
          }
        }
        .add_btn{
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
        }
      }
    }
    .right{
      flex-basis: 30%;
      display: flex;
      flex-direction: column;
      margin-left: 0.9375rem;

      .paper_box{
        .paper_list{
          & > .active{
            background: #e3e3e3;
          }
          .paper_item{
            display: flex;
            flex-direction: column;
            position: relative;
            padding: .5rem 0;
            margin-bottom: 1rem;
            cursor: pointer;

            &::after{
              position: absolute;
              content: "";
              width: 100%;
              bottom: -.5rem;
              left: 0;
              border-bottom: 1px solid #909399;
            }
            .paper_title{
              font-size: 1rem;
              margin-bottom: .4rem;
            }
            .paper_info{
              font-size: .8rem;
              color: #909399;
              display: flex;
              flex-wrap: nowrap;
              & > div:nth-child(2){
                margin-left: 20px;
              }
            }
          }
          .paper_item:hover{
            background: #e3e3e3;
          }
        }
      }
    }
  }
}
</style>
