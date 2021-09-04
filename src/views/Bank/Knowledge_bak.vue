<template>
  <div id="Knowledge">
    <div class="left_tree">
      <div class="title">知识点组卷</div>
      <div class="tree_grop">
        <el-tree
          :data="data"
          show-checkbox
          :props="defaultNodeKey"
          ref="tree"
          @node-click="getCheckedNodes"
        >
        </el-tree>
      </div>
    </div>
    <div class="right_content">
      <div class="title_select">
        <!-- 科目 -->
        <div class="selectTypes">
          <div class="key">科目</div>
          <div
              v-for="(item, idx) in subjectList"
              :class="idx == subjectCurrent ? 'val current' : 'val'"
              :key="item.id"
              @click="subjectClick(idx, item.id)"
          >
            {{ item.title }}
          </div>
        </div>
        <div class="selectTypes">
          <div class="key">年级</div>
          <el-checkbox style="margin-bottom: 0.625rem; margin-right: 1.5rem"  v-model="gradeCheckAll" @change="handleGradeCheckAllChange">全选</el-checkbox>
          <el-checkbox-group
            v-model="gradeChecked"
            style="margin-bottom: 0.625rem;"
            @change="gradeCheckChange"
          >
            <el-checkbox
              v-for="grade in gradeList"
              :key="grade.id"
              :label="grade.id"
              >{{ grade.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 题型 -->
        <div class="selectTypes">
          <div class="key">题型</div>
          <div :class="typeCurrent == -1? 'val current' : 'val'" @click="typeClick(-1)">全部</div>
          <div
            v-for="(item, idx) in typeList"
            :class="idx == typeCurrent ? 'val current' : 'val'"
            :key="item.id"
            @click="typeClick(idx)"
          >
            {{ item.title }}
          </div>
        </div>
        <!-- 难度 -->
        <div class="selectTypes">
          <div class="key">难度</div>
          <div :class="levelCurrent == -1? 'val current' : 'val'" @click="levelClick(-1)">全部</div>
          <div
            v-for="(item, idx) in levelList"
            :class="idx == levelCurrent ? 'val current' : 'val'"
            :key="item.id"
            @click="levelClick(idx)"
          >
            {{ item.name }}
          </div>
        </div>
        
      </div>
      <!-- 题目列表 -->
      <div class="titleList">
        <div
          class="item"
          v-for="(item, idx) in questionData"
          :key="item.id"
        >
          <div class="content" v-html="item.content_all"></div>
          <!-- 答案 -->
          <div class="answer_box" v-if="item.isanswer">
            <div class="items">
              <span class="key">【考点】</span>
              <div class="val" v-html="item.know_point_names"></div>
            </div>
            <div class="items">
              <span class="key">【答案】</span>
              <div class="val" v-html="item.answer"></div>
            </div>
            <div class="items">
              <span class="key">【解析】</span>
              <div class="val" v-html="item.analysis"></div>
            </div>
          </div>
          <div class="btns">
            <div class="left_tip">
              <!-- 题类 -->
              <div class="topic" style="margin-right:1.5625rem;">
                题类：{{ item.type_name }}
              </div>
              <!-- 知识点 -->
              <!-- <div class="point" style="margin-right:1.5625rem;">
                知识点：{{ item.know_point_names }}
              </div> -->
              <!-- 次数 -->
              <!-- <div class="coumt">
                组卷次数：0
              </div> -->
            </div>
            <div class="right_btns">
              <!-- 查看答案 -->
              <div class="look" @click="seeAnswer(item.id, idx)">
                <img
                  class="look_img"
                  src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/look.png"
                  alt="look"
                />
                <span>查看答案</span>
              </div>
<!--              <div class="detail" @click="todetail(item.id)">-->
<!--                <img-->
<!--                  class="detail_img"-->
<!--                  src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/detail.png"-->
<!--                  alt="detail"-->
<!--                />-->
<!--                <span>试题详情</span>-->
<!--              </div>-->
              <el-popover
                  placement="left"
                  :width="400"
                  trigger="click"
                  @show = "onSimmilarShow(idx)"
              >
                <template #reference>
                  <div class="similar">
                    <img
                        class="look_img"
                        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/look.png"
                        alt="look"
                    />
                    <span>相似试题</span>
                  </div>
                </template>
                <SimilarQuestion :ref="setSimRef($ctx,idx)" :question_id="item.id" @added="onSimmilarAdd" @removed="onSimmilarRemove" />
              </el-popover>


              <!-- 添加/移除btn -->
              <el-button
                plain
                class="add"
                v-if="!item.has_add_basket"
                @click="addquestionId(item.id)"
                >添加组卷</el-button>
              <el-button
                plain
                class="sub"
                v-else
                @click="delquestionId(item.id)"
                >移除组卷</el-button>
              <!-- 收录错题 -->
              <el-button
                  plain
                  class="normal_btn"
                  @click="addMistake(item.id)"
              >收录错题</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        class="pagina"
        background
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        :total-count="count"
        layout="prev, pager, next, jumper"
        :total="questionData.count"
      >
      </el-pagination>
    </div>
    <!-- 试题篮 TopicCar -->
    <TopicCar ref="TiRef" />
  </div>
</template>

<script>
import {
  reactive,
  onMounted,
  toRefs,
  onBeforeUpdate,
  updated,
  onBeforeMount,
  ref,
  onUpdated,
  watch,
  nextTick
} from 'vue'
import TopicCar from '@/components/TopicCar/TopicCar'
import SimilarQuestion from "@/components/Knowledge/SimilarQuestion";
import {
  getquestion,
  getSearchCondition,
  getbasketAdd,
  getbasketDel,
  getAnswer,
} from '@/network/knowledge'
import {getKnowledgeByGradIds,getTypeBySubjectId} from '@/network/block'
import { treeData } from '@/utils'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  components: {
    TopicCar,
    SimilarQuestion
  },
  setup() {
    const router = useRouter()

    const state = reactive({
      data: [],
      defaultNodeKey: {
        children: 'child',
        label: 'title',
      },
      questionData: [],

      subjectList:[],
      subjectCurrent:0,

      gradeList: [],
      gradeCheckAll: true,
      gradeChecked:[],

      typeCurrent: -1,
      typeList: [],

      levelList: [],
      levelCurrent: -1,

      page: 1,
      count:0,
      limit:10,

      tree: ref(),
      knowledgeArr: [],
      TiRef: ref(),

      sim: ref([]),
    })

    const setSimRef = (el,index) => {
      console.log(el)
      // nextTick(() => {
      //   state.sim.push(el)
      // })
      // state.sim.push(el)
      // state.sim[index] = el
    }

    const store = useStore()

    onMounted(() => {
      init()
    })

    onBeforeUpdate(() => {
      state.sim = []
    })
    onUpdated(() => {
      // state.sim = []
    })

    watch(
      () => store.state.questionList,
      (data, prevdata) => {
        loadQuestion()
      }
    )

    const init = async () => {
      await loadCondition()
      await loadQuestion()
    }

    const loadCondition  = async () => {
      let {code,data} = await getSearchCondition()
      if(!code)
      {
        state.subjectList = data.subject
        state.gradeList = data.grade
        state.typeList = data.type
        state.levelList = data.level
        state.data = treeData(data.knowledge)
      }
    }

    const gradeCheckChange = async (value) => {
      let checkedCount = value.length
      state.gradeCheckAll = checkedCount === state.gradeChecked.length

      await loadKnowledge()
      await loadQuestion()
    }

    const levelClick = (idx) => {
      state.levelCurrent = idx
      loadQuestion()
    }

    const typeClick = (index) => {
      state.typeCurrent = index
      loadQuestion()
    }

    const handleCurrentChange = (val) => {
      state.page = val
      loadQuestion()
    }

    const getCheckedNodes = (data) => {
      _.debounce(
        () => {
          let checked = true
          state.tree.getCheckedNodes().map((item) => {
            if (data.id == item.id) {
              checked = false
            }
          })
          state.tree.setChecked(data, checked, true)
          state.knowledgeArr = state.tree
            .getCheckedNodes()
            .map((item) => item.id)
          loadQuestion()
        },
        333,
        {
          leading: true,
          trailing: false,
        }
      )()
    }

    const addquestionId = async (id) => {
      const { code } = await getbasketAdd({ id })
      if (code == 0) {
        loadQuestion()
        state.TiRef.getbasketDetailData()
      }
    }

    const delquestionId = async (id) => {
      const { code } = await getbasketDel({ id })
      if (code == 0) {
        loadQuestion()
        state.TiRef.getbasketDetailData()
      }
    }

    const seeAnswer = async (id, idx) => {
      state.questionData[idx].isanswer = !state.questionData[idx]
        .isanswer
      if (!state.questionData[idx].isanswer) return
      if (state.questionData[idx]['know_point_names']) return
      const { code, data } = await getAnswer({
        id,
      })
      if (code == 0) {
        state.questionData[idx]['know_point_names'] = data.know_point_names
        state.questionData[idx]['answer'] = data.answer
        state.questionData[idx]['analysis'] = data.analysis
      }
    }

    const todetail = (id) => {
      router.push(`/knowledge/detail/${id}`)
    }

    const subjectClick = async (index) => {
      state.subjectCurrent = index
      state.page = 1

      await loadKnowledge()
      await loadType()
      await loadQuestion()

      nextTick(() => {
        state.TiRef.getbasketDetailData()
      })
    }

    const handleGradeCheckAllChange = async (v) => {
      state.gradeList.forEach(item=>{
        state.gradeChecked.push(item.id)
      })
      state.gradeChecked = v ? state.gradeChecked : []

      await loadKnowledge()
      await loadQuestion()
    }

    const loadKnowledge = async () => {
      let {code,data} = await getKnowledgeByGradIds({
        subject_id:state.subjectList[state.subjectCurrent].id,
        grade_ids:state.gradeChecked
      })

      if(!code)
      {
        state.data = treeData(data)
        state.knowledgeArr = []
      }
    }

    const loadType = async () => {
      let {code,data} = await getTypeBySubjectId({
        subject_id:state.subjectList[state.subjectCurrent].id
      })

      if(!code)
      {
        state.typeList = data
      }
    }

    const loadQuestion = async () => {
      const { code, data } = await getquestion({
        subject:state.subjectList[state.subjectCurrent].id,
        grade: state.gradeChecked,
        type: state.typeCurrent == -1 ? '':state.typeList[state.typeCurrent].id,
        level: state.levelCurrent == -1 ? '':state.levelList[state.levelCurrent].id,
        knowledge: state.knowledgeArr,
        page: state.page,
      })
      if (code == 0) {
        data.list.map((item) => {
          item['isanswer'] = false
        })
        state.questionData = data.list
        state.count = data.count
      }
    }

    const addMistake = () =>{

    }

    const onSimmilarShow = (index) => {
      console.log(index,state.sim)
      // nextTick(() => {
      //   state.sim[index].loadQuestion()
      // })
    }

    const onSimmilarAdd = (id) => {
      state.TiRef.getbasketDetailData()

      state.questionData.map((item) => {
        if(item.id == id)
          item.has_add_basket = 1
      })
    }

    const onSimmilarRemove = (id) => {
      state.TiRef.getbasketDetailData()

      state.questionData.map((item) => {
        if(item.id == id)
          item.has_add_basket = 0
      })
    }

    return {
      ...toRefs(state),
      levelClick,
      typeClick,
      handleCurrentChange,
      getCheckedNodes,
      addquestionId,
      seeAnswer,
      delquestionId,
      todetail,
      subjectClick,
      handleGradeCheckAllChange,
      gradeCheckChange,
      addMistake,
      onSimmilarShow,
      setSimRef,
      onSimmilarAdd,
      onSimmilarRemove,
    }
  },
}
</script>

<style scoped lang="scss">
#Knowledge {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 !important;
  padding-right: 2.9375rem !important;
  .left_tree {
    width: 18.5625rem;
    margin-right: 0.625rem;
    .title {
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      background: #485ecb;
      border-radius: 0px 2px 2px 0px;
      font-size: 1rem;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      margin-bottom: 0.625rem;
    }
    .tree_grop {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 32px 0px rgba(93, 93, 93, 0.04);
      border-radius: 2px;
      padding: 1.875rem;
    }
  }
  .right_content {
    flex: 1;
    .pagina {
      margin-top: 1.25rem;
      margin-bottom: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .title_select {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
      border-radius: 2px;
      .selectTypes {
        border-bottom: 1px dashed #e5e5e5;
        padding: 1.25rem;
        padding-bottom: 0;
        margin: 0 0.625rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        &:last-child {
          border-width: 0;
        }
        .key {
          width: 6rem;
          font-size: 1rem;
          font-weight: bold;
          color: #222222;
          margin-bottom: 0.625rem;
        }
        .val {
          font-size: 1rem;
          font-weight: 400;
          color: #222222;
          margin-right: 2.5rem;
          margin-bottom: 0.625rem;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
        .current {
          font-weight: bold;
          color: #485ecb;
        }
      }
    }
    .titleList {
      margin-top: 0.625rem;
      .item {
        width: 100%;
        background: #ffffff;
        box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
        border-radius: 2px 2px 0px 0px;
        margin-bottom: 0.625rem;
        overflow: hidden;
        &:last-child {
          margin-bottom: 0;
        }
        .content {
          margin: 1.875rem;
          border-bottom: 1px dashed #f1f1f1;
        }
        .answer_box {
          padding: 1.875rem;
          padding-top: 0;
          border-bottom: 1px solid #e5e5e5;
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
          width: 100%;
          height: 2.75rem;
          background: #ffffff;
          box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
          border-radius: 0px 0px 2px 2px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.875rem;
          .left_tip {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          .right_btns {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .look,
            .detail,
            .similar{
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 1.5625rem;
              cursor: pointer;
              span {
                font-size: 0.875rem;
                font-weight: 400;
                color: #485ecb;
                margin-left: 0.625rem;
              }
            }
            .add,
            .sub,
            .normal_btn{
              width: 5.5rem;
              height: 1.875rem;
              border: 1px solid #485ecb;
              color: #485ecb;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0;
            }
            .sub {
              border: 1px solid #222222;
              color: #222222;
            }
          }
        }
      }
    }
  }
}
</style>
