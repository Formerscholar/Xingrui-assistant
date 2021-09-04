<template>
  <div class="page">
    <div class="header">
      <h4>顾客分析</h4>
      <div class="right">
        <el-select v-model="search_data.school_id" @change="onSchoolChange" placeholder="选择校区">
          <el-option
            v-for="(item,index) in search_condition.school"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="box analysis_box">
      <div class="pie_box" ref="pie_charts"></div>
      <div class="line_box" ref="line_charts"></div>
    </div>
    <div class="box info_box">
      <img src="@/assets/img/index_flower.png" />
      <div class="content">
        <div class="t1">上传试题或试卷</div>
        <el-link href="javascript:void(0);" class="btn" :underline="false">获取积分</el-link>
        <div class="t2">老师可通过上传试题或试卷获取相应积分。</div>
      </div>
      <img src="@/assets/img/index_1.png">
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getSchoolList } from "@/network/block";
import { Timestamp } from "@/utils";

export default {
  setup(props, context) {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      search_data:{
        school_id:'',
      },
      search_condition:{
        school:[]
      },

      pie_charts : ref(),
      pie_instance: null,
      pie_option : {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
            ]
          }
        ]
      },
      line_charts : ref(),
      line_instance:null,
      line_option : {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['蒸发量', '降水量', '平均温度']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '平均温度',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }
    })

    onMounted(() => {
        init()
    })

    const init = async () => {
      state.search_data.school_id = store.state.userInfo.school_id

      await loadPieData()
      await loadLineData()
      await loadSearchCondition()
    }

    const loadPieData = async () => {
      state.pie_instance = window.echarts.init(state.pie_charts)
      state.pie_instance.setOption(state.pie_option)
    }
    const loadLineData = async () => {
      state.line_instance = window.echarts.init(state.line_charts)
      state.line_instance.setOption(state.line_option)
    }

    const loadSearchCondition = async () => {
      var {code,data,msg} = await getSchoolList()
      if(!code)
        state.search_condition.school = data
    }

    return {
      store,
      ...toRefs(state),
    }
  },
}
</script>

<style scoped lang="scss">
  .page{
    background: none;
    padding: 0!important;
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      h4{
        font-size: 1rem;
        font-weight: bold;
        color: #222222;
        padding: 0;
        margin: 0;
      }
    }
    .box{
      background: #FFFFFF;
      margin-bottom: 1rem;
    }
    .analysis_box{
      display: flex;
      min-height: 28.3125rem;
      background: none;
      & > div{
        flex: 1;
        background: #FFFFFF;
        padding: .9rem;
      }
      .pie_box{

      }
      .line_box{
        margin-left: 1rem;
      }
    }
    .info_box{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      padding: .5rem;
      & > img:nth-child(1){
        width: 19.875rem;
        height: 19.25rem;
        align-self:flex-end;
      }
      .content{
        flex: 1;
        .t1{
          color: #073993;
          font-size: 3.25rem;
          font-weight: Bold;
          margin-bottom: 1rem;
        }
        .btn{
          border-radius: 1px;
          background: #FFCF2A;
          color: #222222;
          font-size: 1.6875rem;
          padding: 0.625rem 2rem;
          margin-bottom: 1rem;
        }
        .t2{
          font-size: 1rem;
          color: #999999;
        }
      }
      & > img:nth-child(2){
        width: 34.3125rem;
        height: 24.8125rem;
      }
    }
  }
</style>
