<template>
  <div id="PaperDetail">
    <div class="left_warp">
      <div class="title">{{ DetailData.paper?.title }}</div>
      <div v-for="(item, idx) in DetailData.questions" :key="idx">
        <div class="subhead" v-if="item.question_id == 0">{{ item.title }}</div>
        <div v-else>
          <span>{{ idx + 1 }}.</span>
          <span style="color:#E50304;">({{ item.score }})</span>
          <span style="margin-left: 20px"><el-button
              plain
              class="normal_btn"
              @click="showMistakeDialog(item)"
          >收录错题
        </el-button></span>
          <span
              class="question_body"
              v-html="item.question_data.content_all"
          ></span>
        </div>
      </div>
    </div>
    <div class="right_warp">
      <div class="btns" @click="downClick">
        下载本试卷
      </div>
      <div class="analyze_box">
        <div class="title_warp">
          <div class="lt_box">
            <div class="name">试卷分析</div>
            <div class="score">(总分70分)</div>
          </div>
          <div class="rt_box"></div>
        </div>
        <div class="pie_charts" ref="pie_charts"></div>
      </div>
      <div class="level_analyze">
        <div class="title">知识点分析</div>
        <div
            class="items_box"
            v-for="(item, idx) in DetailData.knowAnalysis"
            :key="idx"
        >
          <div class="t_warp">
            <div class="lt_b">
              {{ item[1] }}
              <span>{{ item[2] }}%</span>
            </div>
            <div class="rt_b">{{ item[0] }}道题</div>
          </div>
          <div
              class="b_warp"
              :style="{ width: `${item[2]}%`, background: randomHexColor() }"
          ></div>
        </div>
      </div>
    </div>
    <DownDialog :isDown="isDown" :downId="downId" :downTitle="downTitle"/>
    <!--  收录错题弹出框  -->
    <AddMistake2
        :is_add_mistake="misatkeDialogVisible"
        :question_id="mistakeId"
        @close="onAddMistakeClose"
    />
  </div>
</template>

<script>
import {toRefs, reactive, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {getPaperDetail} from '@/network/paper'
import {randomHexColor} from '@/utils'
import DownDialog from '@/components/DownDialog/DownDialog'
import AddMistake2 from "@/components/Knowledge/AddMistake2";

export default {
  components: {
    DownDialog,
    AddMistake2
  },
  setup(props, ctx) {
    const route = useRoute()
    const state = reactive({
      pie_charts: ref(),
      DetailData: {},
      pie_charts_now: null,
      options: {
        title: {
          text: '试卷难度分析',
          left: '30%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          bottom: '0',
          data: [],
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [],
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
      downId: '',
      downTitle: '',
      isDown: false,

      misatkeDialogVisible: false,
      mistakeId: 0,
    })

    onMounted(() => {
      getPaperDetailData()
    })

    const getPaperDetailData = async () => {
      const {code, data} = await getPaperDetail({
        paper_id: route.params.id,
      })
      if (code == 0) {
        state.DetailData = data
        state.pie_charts_now = window.echarts.init(state.pie_charts)
        state.options.legend.data = data.levelAnalysi.map((item) => {
          return item[1]
        })
        state.options.series[0].data = data.levelAnalysi.map((item) => {
          return {
            value: item[0],
            name: item[1],
          }
        })
        state.pie_charts_now.setOption(state.options)
      }
    }

    const downClick = () => {
      state.downId = state.DetailData.paper?.id
      state.downTitle = state.DetailData.paper?.title
      state.isDown = true
    }

    const showMistakeDialog = (item) => {
      state.mistakeId = item.id
      state.misatkeDialogVisible = true
    }

    const onAddMistakeClose = (v) => {
      state.misatkeDialogVisible = false
      state.mistakeId = ''
    }

    return {
      ...toRefs(state),
      randomHexColor,
      downClick,
      showMistakeDialog,
      onAddMistakeClose
    }
  },
}
</script>

<style scoped lang="scss">
#PaperDetail {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 !important;

  .left_warp {
    flex: 1;
    background: #ffffff;
    box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
    border-radius: 2px 2px 0px 0px;
    padding: 1.875rem;

    .title {
      font-size: 1.375rem;
      font-weight: bold;
      color: #222222;
      margin-bottom: 3.125rem;
    }

    .subhead {
      font-size: 1rem;
      font-weight: bold;
      color: #222222;
      margin-bottom: 1.875rem;
    }
    .normal_btn{
      width: 5.5rem;
      height: 1.875rem;
      line-height: 1.875rem;
      border: 1px solid #485ecb;
      color: #485ecb;
      border-radius: 0;
      padding: 0;
    }
  }

  .right_warp {
    width: 18.75rem;
    margin-left: 0.625rem;

    .btns {
      margin-bottom: 0.625rem;
      width: 100%;
      height: 3.125rem;
      background: #485ecb;
      border-radius: 2px 0px 0px 2px;
      font-size: 1rem;
      font-weight: bold;
      color: #fff;
      text-align: center;
      line-height: 3.125rem;
      cursor: pointer;
    }

    .analyze_box {
      width: 100%;
      height: 24.1875rem;
      background: #ffffff;
      box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
      border-radius: 2px;
      padding: 1.25rem 0.9375rem;

      .title_warp {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;

        .lt_box {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .name {
            font-size: 1rem;
            font-weight: bold;
            color: #222222;
          }

          .score {
            font-size: 0.875rem;
            font-weight: 400;
            color: #999999;
            margin-left: 0.125rem;
          }
        }

        .rt_box {
          font-size: 1rem;
          font-weight: 400;
          color: #485ecb;
        }
      }

      .pie_charts {
        width: 100%;
        height: 18.75rem;
      }
    }

    .level_analyze {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
      border-radius: 2px;
      margin-top: 0.625rem;
      padding: 1.25rem 0.9375rem;

      .title {
        font-size: 1rem;
        font-weight: bold;
        color: #222222;
        margin-bottom: 1.25rem;
      }

      .items_box {
        margin-bottom: 1.5625rem;

        &:last-child {
          margin-bottom: 0;
        }

        .t_warp {
          margin-bottom: 0.625rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;

          .lt_b {
            font-size: 1rem;
            font-weight: 400;
            color: #222222;
            flex: 8;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            span {
              font-size: 0.875rem;
              font-weight: 400;
              color: #999999;
              margin-left: 0.9375rem;
            }
          }

          .rt_b {
            font-size: 1rem;
            font-weight: 400;
            color: #222222;
            flex: 2;
          }
        }

        .b_warp {
          height: 0.5rem;
          border-radius: 0.125rem;
        }
      }
    }
  }
}
</style>
