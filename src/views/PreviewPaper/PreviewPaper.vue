<template>
  <div id="PreviewPaper">
    <div class="left_body">
      <img
        v-if="IfElse(1)"
        class="peal_line"
        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/peal_line.png"
        alt="peal_line"
      />
      <div class="html_content">
        <el-input class="title" v-model="title" placeholder="请输入标题"></el-input>
        <el-input v-if="IfElse(2)" class="subhead" v-model="name" placeholder="请输入副标题"></el-input>
        <el-input v-if="IfElse(4)" class="tip" v-model="paper_info" placeholder="请输入副标题"></el-input>
        <el-input v-if="IfElse(6)" class="fill" v-model="becareful" placeholder="请输入考生信息"></el-input>
        <table class="total" border="1" cellpadding="0" cellspacing="0" v-if="IfElse(3)">
          <tr>
            <td>题号</td>
            <td>一</td>
            <td>二</td>
            <td>三</td>
            <td>总分</td>
          </tr>
          <tr>
            <td>得分</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>

        <div class="Attention" v-if="IfElse(7)">
          <div class="title_text">
            <span style="color:#E50304;">*</span>注意事项：
          </div>
          <div class="value padnum">1．答题前填写好自己的姓名、班级、考号等信息</div>
          <div class="value">2．请将答案正确填写在答题卡上</div>
        </div>
        <div v-if="IfElse(8)">
          <div class="Volume">第Ⅰ卷（选择题）</div>
          <div class="annotation">第I卷的注释</div>
        </div>
        <div v-for="(item, idx) in basketList?.question" :key="idx">
          <div class="Topics">
            <table border="1" cellpadding="0" cellspacing="0" v-if="IfElse(9)">
              <tr>
                <td>评卷人</td>
                <td>得分</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </table>

            <span>
              {{ idx + 1 }}、{{ item.name }}（共{{ item.count }}题；共
              {{ item.score }}分）
            </span>
          </div>
          <div class="questions" v-for="(item, idx) in item.question_list" :key="idx">
            <span class="slot">
              {{ idx + 1 }}.
              <span class="score">({{ item.score }}分)</span>
            </span>
            <span class="question_body" v-html="item.content_all"></span>
            <div class="answer_box" v-if="item.isanswer">
              <div class="items">
                <span class="key">【考点】</span>
                <div class="val" v-html="item?.know_point_names"></div>
              </div>
              <div class="items">
                <span class="key">【答案】</span>
                <div class="val" v-html="item?.answer"></div>
              </div>
              <div class="items">
                <span class="key">【解析】</span>
                <div class="val" v-html="item?.analysis"></div>
              </div>
            </div>
            <div class="btns">
              <div class="items look" @click="changeIsAnswer(item.id)">查看答案</div>
              <div class="items score" @click="setScoreClick(item.id, item.score)">设置得分</div>
              <div
                class="items moveup"
                @click="getSort({ type: item.type, id: item.id, sort: 'up' })"
              >上移</div>
              <div
                class="items movedown"
                @click="getSort({ type: item.type, id: item.id, sort: 'down' })"
              >下移</div>
              <div class="items del" @click="getDelClick(item.id)">删除</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right_btn">
      <div class="twoBtns">
        <div class="complete" @click="Complete">完成组卷</div>
        <div class="analyze" v-if="routeId === undefined" @click="clearClick">清空组卷</div>
      </div>
      <div class="checkds">
        <div class="title_txt">试卷结构设置</div>
        <el-checkbox-group class="checkList" v-model="checkList">
          <el-checkbox label="1">密封线</el-checkbox>
          <el-checkbox label="2">副标题</el-checkbox>
          <el-checkbox label="3">总分栏</el-checkbox>
          <el-checkbox label="4">试卷信息</el-checkbox>
          <!-- <el-checkbox label="5">装订线</el-checkbox> -->
          <el-checkbox label="6">考生信息</el-checkbox>
          <el-checkbox label="7">注意事项</el-checkbox>
          <!-- <el-checkbox label="8">分卷及注释</el-checkbox>  -->
          <el-checkbox label="9">大题评分区</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="qinfo">
        <div class="title">试卷信息</div>
        <div class="hints">
          <div class="score_span">
            分数：
            <span>{{ basketList?.paper?.score }}分</span>
          </div>
          <div class="num_span">
            题数：
            <span>{{ basketList?.paper?.question_count }}题</span>
          </div>
          <div class="level_span">
            难度：
            <span>{{ level_text[basketList?.paper?.level] }}</span>
          </div>
        </div>
        <div class="subsection">
          <div class="subsection_title">
            <div class="dashed"></div>
            <div class="text">第Ⅰ卷(选择题)</div>
            <div class="dashed"></div>
          </div>
          <div v-for="(item, idx) in basketList?.paper?.detail" :key="idx">
            <div class="type_title">
              <div class="text">{{ idx + 1 }}、{{ item.name }}</div>
              <div class="btns">
                <span @click="slotByType(item.type, item.name)">排序</span>
                <span @click="delByType(item.type)">删除</span>
              </div>
            </div>
            <div class="sec_con">
              <div
                class="con_item"
                v-for="(item, idx) in item.quesiton_ids"
                :key="idx"
              >{{ idx + 1 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="温馨提示" v-model="isScoreBox" width="40.625rem">
      <div class="body_box">
        <div class="lable">分数</div>
        <el-input v-model="score_num" placeholder="请输入分数" style="width:80px;margin:0 1rem;"></el-input>
        <span>分</span>
      </div>
      <div class="footer_box">
        <el-button type="primary" @click="setScoreRequest">确 定</el-button>
        <el-button @click="() => (isScoreBox = false)">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="温馨提示" v-model="isSlot" width="40.625rem">
      <div class="slotBody">
        <div class="title">{{ slotname }}</div>
        <div class="slot_warp">
          <div class="key">排序方式</div>
          <el-radio-group v-model="slot">
            <el-radio label="1">难度从低到高</el-radio>
            <el-radio label="2">难度从高到低</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="footer_box">
        <el-button @click="() => (isSlot = false)">取 消</el-button>
        <el-button type="primary" @click="slotClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, onBeforeMount } from 'vue'
import {
  getbasketList,
  getSetScore,
  getSetSort,
  getdeleteById,
  getdeleteByType,
  getPaperAdd,
  getPaperSave,
} from '@/network/previewPaper'
import { getAnswer, getbasketDetailAll } from '@/network/knowledge'
import { level_text, setTimerType } from '@/utils'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  setup(props, ctx) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      level_text,
      checkList: [],
      basketList: {},
      scoreId: '',
      isScoreBox: false,
      score_num: 0,
      title:
        setTimerType(new Date().getTime(), true, 1) +
        store.state.userInfo.subject_name +
        '试卷',
      name: '试卷副标题',
      paper_info: '考试范围：xxx；考试时间：100分钟；命题人：xxx',
      becareful:
        '学校:___________姓名：___________班级：___________考号：___________',
      routeId: '',
      slottype: '',
      slotname: '',
      isSlot: false,
      slot: '1',
    })

    onBeforeMount(() => {
      state.routeId = route.params.id
      getbasketListData()
      console.log('store', store.state.userInfo)
    })

    const getbasketListData = async () => {
      const { code, data } = await getbasketList({
        id: state.routeId,
      })
      if (code == 0) {
        data.question.map((item) => {
          item.question_list.map((item1) => {
            item1['isanswer'] = false
          })
        })
        state.basketList = data
        console.log(state.basketList)
        if (data.paper_config) {
          state.title = data.paper_config.title
          state.becareful = data.paper_config.becareful
          state.paper_info = data.paper_config.paper_info
          state.name = data.paper_config.subtitle
          data.paper_config.is_becareful && state.checkList.push('7')
          data.paper_config.is_lock && state.checkList.push('1')
          data.paper_config.is_paper_info && state.checkList.push('4')
          data.paper_config.is_question_score && state.checkList.push('9')
          data.paper_config.is_student_info && state.checkList.push('6')
          data.paper_config.is_total_score && state.checkList.push('3')
          data.paper_config.is_subtitle && state.checkList.push('2')
        }
      }
    }

    const IfElse = (num) => {
      let isShow = _.find(state.checkList, (o) => {
        return o == num
      })
      return isShow
      isShow == 1 ? (
        <img
          class="peal_line"
          src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/peal_line.png"
          alt="peal_line"
        />
      ) : isShow == 2 ? (
        <el-input
          class="subhead"
          v-model={state.name}
          placeholder="请输入副标题"
        ></el-input>
      ) : isShow == 3 ? (
        <table class="total" border="1" cellpadding="0" cellspacing="0">
          <tr>
            <td>题号</td>
            <td>一</td>
            <td>二</td>
            <td>三</td>
            <td>总分</td>
          </tr>
          <tr>
            <td>得分</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      ) : isShow == 4 ? (
        <el-input
          class="tip"
          v-model={state.paper_info}
          placeholder="请输入副标题"
        ></el-input>
      ) : isShow == 6 ? (
        <el-input
          class="fill"
          v-model={state.becareful}
          placeholder="请输入考生信息"
        ></el-input>
      ) : isShow == 7 ? (
        <div class="Attention">
          <div class="title_text">
            <span style="color:#E50304;">*</span>注意事项：
          </div>
          <div class="value padnum">
            1．答题前填写好自己的姓名、班级、考号等信息
          </div>
          <div class="value">2．请将答案正确填写在答题卡上</div>
        </div>
      ) : isShow == 8 ? (
        <>
          <div class="Volume">第Ⅰ卷（选择题）</div>
          <div class="annotation">第I卷的注释</div>
        </>
      ) : isShow == 9 ? (
        <table border="1" cellpadding="0" cellspacing="0">
          <tr>
            <td>评卷人</td>
            <td>得分</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </table>
      ) : null
    }

    const changeIsAnswer = (id) => {
      state.basketList.question.map((item) => {
        item.question_list.map(async (item1) => {
          if (item1.id == id) {
            item1.isanswer = !item1.isanswer
            if (!item1.isanswer) return
            if (item1.know_point_names) return
            const { code, data } = await getAnswer({
              id,
            })
            if (code == 0) {
              item1['know_point_names'] = data.know_point_names
              item1['answer'] = data.answer
              item1['analysis'] = data.analysis
            }
          }
        })
      })
    }

    const getDelClick = async (id) => {
      const { code } = await getdeleteById({ id })
      if (code == 0) {
        getbasketListData()
      }
    }

    const getSort = async (obj) => {
      const { code } = await getSetSort(obj)
      if (code == 0) {
        getbasketListData()
      }
    }

    const setScoreClick = (id, score) => {
      state.scoreId = id
      state.score_num = score
      state.isScoreBox = true
    }

    const setScoreRequest = async () => {
      state.isScoreBox = false
      const { code } = await getSetScore({
        id: state.scoreId,
        score: state.score_num,
      })
      if (code == 0) {
        getbasketListData()
      }
    }

    const slotByType = (type, name) => {
      state.slottype = type
      state.slotname = name
      state.isSlot = true
    }

    const slotClick = async () => {
      state.isSlot = false

      const { code } = await getbasketList({
        type: [state.slottype],
        sort: state.slot,
      })
      if (code == 0) {
        getbasketListData()
      }
    }

    const delByType = async (type) => {
      const { code } = await getdeleteByType({ type })
      if (code == 0) {
        getbasketListData()
      }
    }

    const drag = (arr) => {
      return arr.map((item, idx) => {
        return (
          <div class="con_item" key={item}>
            {idx + 1}
          </div>
        )
      })
    }
    const findData = (num) => {
      return _.find(state.checkList, (o) => {
        return o == num
      }) != undefined
        ? 1
        : 0
    }

    const Complete = async () => {
      let arr = []
      state.basketList?.question.map((item, idx) => {
        arr.push({
          parent_id: 1,
          question_id: 0,
          title: `${idx + 1}、${item.name}（共${item.count}题；共 ${
            item.score
          }分）`,
          sort: 0,
          score: 0,
        })
        item.question_list.map((item1, idx1) => {
          arr.push({
            parent_id: 2,
            question_id: item1.id,
            title: idx1 + 1,
            sort: item1.sort,
            score: item1.score,
          })
        })
      })

      let reslove = null
      if (state.routeId) {
        reslove = await getPaperSave({
          id: state.routeId,
          title: state.title,
          name: '',
          is_subtitle: findData(2),
          subtitle: state.name,
          is_lock: findData(1),
          is_total_score: findData(3),
          is_paper_info: findData(4),
          paper_info: state.paper_info,
          is_student_info: findData(6),
          is_becareful: findData(7),
          becareful: state.becareful,
          is_question_score: findData(9),
          is_sub_section: 0,
          sub_section: '',
          questions: arr,
        })
      } else {
        reslove = await getPaperAdd({
          title: state.title,
          name: '',
          is_subtitle: findData(2),
          subtitle: state.name,
          is_lock: findData(1),
          is_total_score: findData(3),
          is_paper_info: findData(4),
          paper_info: state.paper_info,
          is_student_info: findData(6),
          is_becareful: findData(7),
          becareful: state.becareful,
          is_question_score: findData(9),
          is_sub_section: 0,
          sub_section: '',
          questions: arr,
        })
      }
      const { code } = reslove
      if (code == 0) {
        router.push('/paper')
      }
    }

    const clearClick = async () => {
      const { code } = await getbasketDetailAll()
      if (code == 0) {
        router.go(-1)
      }
    }

    return {
      ...toRefs(state),
      IfElse,
      changeIsAnswer,
      setScoreClick,
      getSort,
      getDelClick,
      clearClick,
      slotByType,
      delByType,
      setScoreRequest,
      slotClick,
      Complete,
    }
  },
}
</script>

<style scoped lang="scss">
#PreviewPaper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 !important;

  .left_body {
    flex: 1;
    background: #ffffff;
    box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
    border-radius: 2px 2px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 0.75rem 1rem;

    .peal_line {
      margin-right: 1rem;
    }

    .html_content {
      flex: 1;

      .title {
        width: 100%;
        text-align: center;
        font-size: 1.375rem;
        font-weight: bold;
        height: 2.4375rem;
        color: #222222;
        margin-bottom: 1rem;
        border: none;
        outline: none;
      }

      .subhead {
        width: 100%;
        border: none;
        outline: none;
        text-align: center;
        font-size: 1.125rem;
        font-weight: 400;
        height: 2.4375rem;
        color: #222222;
        margin-bottom: 1rem;
      }

      .tip {
        text-align: center;
        font-size: 1rem;
        font-weight: 400;
        color: #222222;
        width: 100%;
        border: none;
        height: 2.4375rem;
        outline: none;
      }

      .fill {
        text-align: center;
        height: 2.4375rem;
        font-size: 1rem;
        font-weight: 400;
        color: #222222;
        margin: 1rem 0;
        width: 100%;
        border: none;
        outline: none;
      }

      .total {
        width: 18rem;
        margin: 0 auto;
        margin-bottom: 0.9375rem;

        td {
          width: 3.625rem;
          height: 1.75rem;
          text-align: center;
        }
      }

      .Attention {
        font-size: 1rem;
        font-weight: 400;
        color: #222222;

        .padnum {
          margin-top: 0.8125rem;
          margin-bottom: 0.9375rem;
        }
      }

      .Volume {
        text-align: center;
        margin-top: 2.5rem;
        font-size: 1.125rem;
        font-weight: 400;
        color: #222222;
      }

      .annotation {
        font-size: 1rem;
        font-weight: 400;
        color: #999999;
        margin-top: 0.9375rem;
      }

      .Topics {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 2.5rem;
        margin-bottom: 2.0625rem;

        td {
          width: 3.625rem;
          height: 1.75rem;
          text-align: center;
        }

        span {
          margin-left: 0.9375rem;
          font-size: 1rem;
          font-weight: bold;
          color: #222222;
        }
      }

      .questions {
        padding: 1rem;
        position: relative;
        border: 1px solid #fff;
        border-radius: 6px;
        border-top-right-radius: 0;

        &:hover {
          border-color: #e5e5e5;
        }

        &:hover .btns {
          opacity: 1;
        }

        .slot {
          .score {
            color: #e50304;
          }
        }

        .answer_box {
          border-top: 1px dashed #f1f1f1;
          padding-top: 1rem;
          .items {
            margin-bottom: 1rem;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            .val {
              flex: 1;
              margin-left: 1.1875rem;
              font-size: 0.875rem;
              font-weight: 400;
              color: #222222;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }

        .btns {
          opacity: 0;
          position: absolute;
          right: -1px;
          top: -2.5625rem;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          border: 1px solid #e5e5e5;
          border-bottom: none;
          border-radius: 6px 6px 0px 0px;
          overflow: hidden;
          background-color: #fff;

          .items {
            padding-left: 2.9375rem;
            padding-right: 1.25rem;
            height: 2.5rem;
            line-height: 2.5rem;
            background-repeat: no-repeat;
            background-position: 1.25rem 50%;
            border-right: 1px solid #e5e5e5;
            cursor: pointer;

            &:hover {
              background-color: #485ecb;
              color: #fff;
              border-right: 1px solid #485ecb;
            }

            &:last-child {
              border-right: none;
            }
          }

          .look {
            background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/look_icon_curr.png');

            &:hover {
              background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/look_icon.png');
            }
          }

          .score {
            background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/score_icon_curr.png');

            &:hover {
              background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/score_icon.png');
            }
          }

          .moveup {
            background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/up_icon_curr.png');

            &:hover {
              background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/up_icon.png');
            }
          }

          .movedown {
            background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/down_icon_curr.png');

            &:hover {
              background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/down_icon.png');
            }
          }

          .del {
            background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/del_icon_curr.png');

            &:hover {
              background-image: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/question/del_icon.png');
            }
          }
        }
      }
    }
  }

  .right_btn {
    width: 18.5625rem;
    margin-left: 0.625rem;

    .twoBtns {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.625rem;

      .complete {
        flex: 1;
        height: 50px;
        line-height: 50px;
        background: #ffffff;
        border-radius: 2px 0px 0px 2px;
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
        color: #485ecb;
        cursor: pointer;
      }

      .analyze {
        flex: 1;
        height: 50px;
        line-height: 50px;
        background: #485ecb;
        border-radius: 0px 2px 2px 0px;
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
        color: #ffffff;
        cursor: pointer;
      }
    }

    .checkds {
      padding: 1.25rem 0.9375rem;
      padding-bottom: 0;
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
      border-radius: 2px;

      .title_txt {
        margin-bottom: 1.25rem;
      }

      .checkList {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .el-checkbox {
          flex: 1;
          margin-bottom: 1rem;

          &:last-child {
            margin-right: 30px !important;
          }
        }
      }
    }

    .qinfo {
      margin-top: 0.625rem;
      padding: 1.25rem 0.9375rem;
      padding-bottom: 0;
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
      border-radius: 2px;

      .title {
        font-size: 1rem;
        font-weight: bold;
        color: #222222;
        margin-bottom: 1.25rem;
      }

      .hints {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & > div {
          font-size: 0.875rem;
          font-weight: 400;
          color: #222222;

          span {
            color: #e50304;
          }
        }
      }

      .subsection {
        margin-top: 1.25rem;

        .subsection_title {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.25rem;

          .dashed {
            flex: 1;
            border-bottom: 1px dashed #dbdbdb;
          }

          .text {
            font-size: 1rem;
            font-weight: 400;
            color: #222222;
            margin: 0 6px;
          }
        }

        .type_title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .text {
            font-size: 1rem;
            font-weight: bold;
            color: #222222;
          }

          .btns {
            font-size: 0.875rem;
            font-weight: 400;
            color: #222222;
            cursor: pointer;

            span {
              &:first-child {
                margin-right: 0.9375rem;
              }
            }
          }
        }

        .sec_con {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 0.9375rem;

          .con_item {
            width: 1.875rem;
            height: 1.875rem;
            line-height: 1.875rem;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 0.375rem;
            text-align: center;
            margin-right: 1rem;
            margin-bottom: 1.25rem;

            &:nth-child(6n) {
              margin-right: 0;
            }
          }
        }
      }
    }
  }

  .el-dialog {
    .body_box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 1rem;
    }

    .slotBody {
      margin-bottom: 1rem;

      .slot_warp {
        margin-top: 1rem;
        .key {
          margin-bottom: 1rem;
        }
      }
    }

    .footer_box {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
