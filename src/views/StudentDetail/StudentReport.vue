<template>
  <div id="StudentReport">
    <div class="box">
      <h4>{{ student_data.name }}的学情报告</h4>
      <div class="search_box">
        <el-form inline>
          <el-form-item>
            <el-select
              placeholder="请选择学科"
              v-model="search_data.subject_id"
              clearable
            >
              <el-option
                v-for="(item, index) in search_condition.subject"
                :key="index"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="search_data.times"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="box chart_box">
        <div class="line_charts" ref="line_charts" style="display: none"></div>
        <div class="pie_charts" ref="pie_charts"></div>
      </div>
    </div>
    <div class="box">
      <div class="question_box">
        <div class="question_list" v-if="questions.length > 0">
          <div
            class="question_item"
            v-for="(item, index) in questions"
            :key="index"
          >
            <div class="ord">{{ index + 1 }}.</div>
            <div class="detail">
              <div v-html="item.question_data.content_all"></div>
              <div class="tool">
                <el-button type="danger" @click="doDelete(item)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="no_data" v-else>
          暂无错题数据
        </div>
        <el-pagination
          class="pagina"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :page-count="total_page"
          align="center"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 删除confirm -->
    <el-dialog title="温馨提示" v-model="confirmShow" width="40.625rem" center>
      <span>确定删除，继续此操作？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmShow = false">取 消</el-button>
          <el-button type="primary" @click="deleteQuestion">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { studentReport,removeMistake } from '@/network/student'
import { getSubjectList, getStudentQuestionList } from '@/network/block'
import { Timestamp } from '@/utils'
import {ElMessage} from "element-plus";

export default {
  setup(props, context) {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      id: 0,
      search_condition: {
        subject: [{}],
      },
      student_data:{
        name:'',
      },
      search_data: {
        subject_id: '',
        times: '',
      },
      questions: [],
      page: 1,
      limit: 10,
      total_page: 1,
      count: 0,
      line_charts: ref(),
      line_charts_now: null,
      pie_charts: ref(),
      pie_charts_now: null,
      option: {
        title: {
          text: '知识点掌握情况',
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
          },
        ],
      },
      options: {
        title: {
          text: '错题报告数据',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
        },
        series: [
          {
            name: '错题占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },

      confirmShow:false,
      confirm_data:{
        id:'',
      },
    })

    onMounted(() => {
      state.id = route.params.id - 0
      init()
    })

    const init = async () => {
      await loadSearchCondition()
      await loadQuestion()
      await loadStudentReport()
    }
    const loadStudentReport = async () => {
      let params = {
        id: state.id,
        subject_id: state.search_data.subject_id,
      }
      if (_.isArray(state.search_data.times)) {
        params.start_time = Timestamp(state.search_data.times[0])
        params.end_time = Timestamp(state.search_data.times[1])
      }

      let { code, data, msg } = await studentReport(params)
      if (!code) {
        // state.line_charts_now = window.echarts.init(state.line_charts)
        // state.line_charts_now.setOption(state.option)

        state.pie_charts_now = window.echarts.init(state.pie_charts)
        state.options.title.text = data.title
        state.options.legend.data = data.xAxis
        state.options.series[0].data = data.yAxis
        state.pie_charts_now.setOption(state.options,true)

        state.student_data.name = data.student_data.name
      }
    }

    const loadQuestion = async () => {
      let params = {
        id: state.id,
        subject_id: state.search_data.subject_id,
        page: state.page,
        limit: state.limit,
      }
      if (_.isArray(state.search_data.times)) {
        params.start_time = Timestamp(state.search_data.times[0])
        params.end_time = Timestamp(state.search_data.times[1])
      }

      let { code, data } = await getStudentQuestionList(params)
      if (!code) {
        state.questions = data.list
        state.page = data.page
        state.count = data.count
        state.total_page = data.total_page
      }
    }

    const loadSearchCondition = async () => {
      var { code, data, msg } = await getSubjectList()
      state.search_condition.subject = data
      state.search_data.subject_id = data[0].id
    }

    const doSearch = async () => {
      await loadStudentReport()
      await loadQuestion()
    }

    const handleSizeChange = () => {
      alert('修改每页显示数')
    }
    const handleCurrentChange = _.debounce((page) => {
      state.page = page
      loadQuestion()
    }, 300)

    const deleteQuestion = async () => {
      let {code,data} = await removeMistake({
        question_id:state.confirm_data.id,
        student_id:state.id
      })
      if(!code)
      {
        ElMessage.success("错题删除成功")
        state.confirmShow = false
        loadStudentReport()
        loadQuestion()
      }
    }

    const doDelete = (question) => {
      state.confirmShow = true
      state.confirm_data.id = question.question_id
    }

    return {
      store,
      ...toRefs(state),
      doSearch,
      handleSizeChange,
      handleCurrentChange,
      doDelete,
      deleteQuestion
    }
  },
}
</script>

<style scoped lang="scss">
#StudentReport {
  padding: 0 !important;

  .box {
    margin-bottom: 0.9375rem;
    background: #ffffff;
    padding: 0.9rem;
    h4,
    h5 {
      margin: 0;
      padding: 0;
      height: 3rem;
      line-height: 3rem;
    }
    h4 {
      font-size: 1rem;
    }
    h5 {
      font-size: 0.8rem;
      font-weight: normal;
    }
  }
  .search_box {
    .el-form--inline {
      .el-form-item {
        margin-bottom: 0 !important;
      }
    }
  }
  .chart_box {
    h5 {
      margin-bottom: 1rem;
    }
    .line_charts {
      width: 80%;
      height: 400px;
    }
    .pie_charts {
      width: 80%;
      height: 400px;
    }
  }
  .question_box {
    .question_list {
      .question_item {
        display: flex;
        flex-direction: row;
        padding: 1rem;

        .ord {
          flex-basis: 2rem;
        }
        .detail {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &::v-deep(p) {
            margin: 0;
            padding: 0;
            margin-bottom: 1rem;
          }
          .tool{

          }
        }
      }
      .question_item:hover{
        background: #F2F6FC;
      }
    }
    .no_data {
      text-align: center;
      height: 3rem;
      line-height: 3rem;
      color: #909399;
    }
  }
}
</style>
