<template>
  <div class="page">
    <div class="box">
      <div class="form">
        <el-form :model="search_data" inline>
          <el-form-item prop="grade_id">
            <el-select v-model="search_data.team_id" placeholder="选择班级" clearable>
              <el-option v-for="(item,index) in condition_data.team" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="subject_id">
            <el-select v-model="search_data.subject_id" placeholder="选择科目" clearable>
              <el-option v-for="(item,index) in condition_data.subject" :key="index" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="student_id">
            <el-select v-model="search_data.student_id" placeholder="选择学生" clearable>
              <el-option v-for="(item,index) in condition_data.student" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="date_range">
            <el-date-picker
                v-model="search_data.date_range"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="box">
      <div class="chart">
        <div class="pie_charts" ref="pie_charts"></div>
      </div>
      <div class="knowledege">
        <h4>知识点分析<span>共收录{{count}}道错题</span></h4>
        <el-scrollbar style="height:100%">
          <ul>
            <li v-for="(item,index) in knowledge" :key="index">
              <div class="left">
                <h5>{{item.name}}</h5>
                <el-progress :percentage="item.rate * 100" :color="item.color"></el-progress>
              </div>
              <div class="right">{{ item.count }}道题</div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="box">
      <div class="question" v-if="count > 0">
        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="ord">{{index + 1}}.</div>
            <div class="content">
              <div v-html="item.content_all"></div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="limit"
              layout="prev, pager, next,jumper"
              :total="count">
          </el-pagination>
        </div>
      </div>
      <el-empty description="未找到数据" v-else></el-empty>
    </div>
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {getCondition,getList,getQuestionList} from '@/network/report'
import {Timestamp,randomHexColor} from '@/utils'

export default {
  components: {

  },
  props: {},
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      search_data: {
        team_id: '',
        subject_id: '',
        student_id: '',
        date_range: ''
      },
      condition_data: {
        team: [],
        subject: [],
        student: [],
      },

      pie_charts: ref(),
      pie_charts_now: null,
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
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'},
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

      knowledge:[],

      page: 1,
      count: 0,
      limit: 20,

      list: [],
    })

    onMounted(() => {
      initSearch()
      loadQuestion()
      doSearch()
    })

    const initSearch = async () => {
      let {code,data} = await getCondition()
      if(!code)
      {
        state.condition_data.team = data.team
        state.condition_data.subject = data.subject
        state.condition_data.student = data.student
      }
    }

    const doSearch = async () => {
      let params = {
        team_id:state.search_data.team_id,
        subject_id: state.search_data.subject_id,
        student_id: state.search_data.student_id,
      }
      if(_.isArray(state.search_data.date_range))
      {
        params.start_time = Timestamp(state.search_data.date_range[0])
        params.end_time = Timestamp(state.search_data.date_range[1])
      }
      let {code,data} = await getList(params)
      if(!code)
      {
        state.knowledge = data.knowledge.map((item) => {
          return {color:randomHexColor(),...item}
        })

        state.count = data.count

        state.pie_charts_now = window.echarts.init(state.pie_charts)
        state.options.title.text = data.title
        state.options.legend.data = data.xAxis
        state.options.series[0].data = data.yAxis
        state.pie_charts_now.setOption(state.options,true)
      }

      await loadQuestion()
    }

    const loadQuestion = async () => {
      let params = {
        page:state.page,
        limit:state.limit,
        team_id:state.search_data.team_id,
        subject_id: state.search_data.subject_id,
        student_id: state.search_data.student_id,
      }
      if(_.isArray(state.search_data.date_range))
      {
        params.start_time = Timestamp(state.search_data.date_range[0])
        params.end_time = Timestamp(state.search_data.date_range[1])
      }

      let {code,data} = await getQuestionList(params)
      if(!code)
      {
        state.list = data.list
        state.count = data.count
      }
    }

    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      loadQuestion()
    },300)

    return {
      ...toRefs(state),
      doSearch,
      handleCurrentChange
    }
  },
}
</script>

<style scoped lang="scss">
.page {
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  position: relative;
  padding: 0 !important;

  .box {
    background: #FFFFFF;
    margin-bottom: 0.9375rem;
    padding: 1.875rem;
  }

  .box:nth-child(1) {
    .form {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-form {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }

  .box:nth-child(2) {
    display: flex;
    flex-direction: row;
    height: 30.3125rem;
    background: none;
    padding: 0;

    .chart {
      background: #FFFFFF;
      padding: 1.875rem;
      flex-basis: 60%;
      margin-right: 0.9375rem;

      .pie_charts {
        width: 100%;
        height: 25rem;
      }
    }

    .knowledege {
      flex: 1;
      padding: 1.875rem;
      background: #FFFFFF;
      overflow: hidden;

      h4 {
        font-size: 1.25rem;
        span {
          float: right;
          font-size: 1rem;
          color: #999999;
        }
      }

      ul {
        margin-top: 1.875rem;

        li {
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          .left {
            flex-basis: 80%;
            h5{
              font-weight: normal;
              font-size: 1rem;
            }
          }
          .right {
            margin-left: 10px;
          }
        }

        li:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .box:nth-child(3){
    .question{
      .list{
        .item {
          display: flex;
          flex-direction: row;
          margin-bottom: 1.875rem;

          .ord {
            flex-basis: 2rem;
          }
          .content {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &::v-deep(p) {
              margin: 0;
              padding: 0;
              line-height: 1.4rem;
            }
            .tool{

            }
          }
        }
        .question_item:hover{
          background: #F2F6FC;
        }
      }
      .pagination{
        text-align: center;
      }
    }
  }
}
</style>
