<template>
  <div id="Knowledge">
    <div class="left_tree">
      <div class="title">
        <div :class="{active:sourceType == 0}" @click="onSourceChange(0)">按章节</div>
        <div :class="{active:sourceType == 1}" @click="onSourceChange(1)">按知识点</div>
      </div>
      <div class="tree_grop">
        <el-tree
          :data="data"
          show-checkbox
          :props="defaultNodeKey"
          ref="tree"
          @node-click="getCheckedNodes"
        >
          <template #default="{node,data}">
            <span class="tree_node">
              <el-tooltip class="item" effect="light" :content="node.label" placement="right">
                <span>{{ ellipsis(node.label,8) }}</span>
              </el-tooltip>
            </span>
          </template>
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
          >{{ item.title }}</div>
        </div>
        <div class="selectTypes">
          <div class="key">年级</div>
          <div
            v-for="(item, idx) in gradeList"
            :class="idx == gradeCurrent ? 'val current' : 'val'"
            :key="item.id"
            @click="gradeChange(idx)"
          >{{ item.name }}</div>
        </div>
        <!-- 题型 -->
        <div class="selectTypes">
          <div class="key">题型</div>
          <div :class="typeCurrent == -1 ? 'val current' : 'val'" @click="typeClick(-1)">全部</div>
          <div
            v-for="(item, idx) in typeList"
            :class="idx == typeCurrent ? 'val current' : 'val'"
            :key="item.id"
            @click="typeClick(idx)"
          >{{ item.title }}</div>
        </div>
        <!-- 难度 -->
        <div class="selectTypes">
          <div class="key">难度</div>
          <div :class="levelCurrent == -1 ? 'val current' : 'val'" @click="levelClick(-1)">全部</div>
          <div
            v-for="(item, idx) in levelList"
            :class="idx == levelCurrent ? 'val current' : 'val'"
            :key="item.id"
            @click="levelClick(idx)"
          >{{ item.name }}</div>
        </div>
        <!-- 搜索框 -->
        <div class="search">
          <el-input
            size="medium "
            prefix-icon="el-icon-search"
            placeholder="输入题目标题的关键字,多关键字空格分隔"
            v-model="keyword"
            @input="onKeywordChange"
            @keyup.enter.native="loadQuestion"
          ></el-input>
          <el-button type="primary" @click="loadQuestion" style="margin-left:10px;">搜索</el-button>
        </div>
      </div>
      <!-- 题目列表 -->
      <div class="titleList">
        <div class="item" v-for="(item, idx) in questionData" :key="item.id">
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
              <div class="topic" style="margin-right:1.5625rem;">题类：{{ item.type_name }}</div>
              <!-- 知识点 -->
              <!-- <div class="point" style="margin-right:1.5625rem;">
                知识点：{{ item.know_point_names }}
              </div>-->
              <!-- 次数 -->
              <!-- <div class="coumt">
                组卷次数：0
              </div>-->
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
              <div class="similar" @click="onSimmilarShow(idx)">
                <img
                  class="look_img"
                  src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/look.png"
                  alt="look"
                />
                <span>同类型题目</span>
              </div>

              <!-- 添加/移除btn -->
              <el-button
                plain
                class="add"
                v-if="!item.has_add_basket"
                @click="addquestionId(item.id)"
              >添加组卷</el-button>
              <el-button plain class="sub" v-else @click="delquestionId(item.id)">移除组卷</el-button>
              <!-- 收录错题 -->
              <el-button plain class="normal_btn" @click="showMistakeDialog(item)">收录错题</el-button>
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
        layout="prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
    <!-- 试题篮 TopicCar -->
    <TopicCar ref="TiRef" />
    <!--  相似试题弹出框  -->
    <el-dialog title="同类型题目" v-model="simmilarDialogVisible" width="40rem" :show-close="false">
      <div class="simmilar_content">
        <div class="question_list">
          <div class="question_item" v-for="(item,index) in simmilarList" :key="index">
            <div class="content">
              <div v-html="item.content_all"></div>
            </div>
            <div class="tool">
              <!--              <el-button type="text" icon="iconfont iconsousuo">查看详情</el-button>-->
              <el-button
                type="text"
                icon="iconfont iconwujiaoxing"
                v-if="!item.has_add_basket"
                @click="addSimmilarQuesiton(index)"
              >添加组卷</el-button>
              <el-button
                type="text"
                icon="iconfont iconwujiaoxing"
                v-else
                @click="delSimmilarQuesiton(index)"
              >移除组卷</el-button>
            </div>
          </div>
        </div>
      </div>
      <template #title>
        <div class="simmilar_header">
          <div>
            <i class="iconfont iconsuiji2"></i>同类型题目
          </div>
          <el-button @click="reLoadSimmilarList" type="text" style="padding: 0!important;">
            <i class="iconfont iconshuaxin"></i>换一批
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!--  收录错题弹出框  -->
    <AddMistake2
      :is_add_mistake="misatkeDialogVisible"
      :question_id="mistakeId"
      @close="onAddMistakeClose"
    />
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
  nextTick,
} from 'vue'
import TopicCar from '@/components/TopicCar/TopicCar'
import SimilarQuestion from '@/components/Knowledge/SimilarQuestion'
import AddMistake from '@/components/Knowledge/AddMistake'
import AddMistake2 from '@/components/Knowledge/AddMistake2'
import {
  getquestion,
  getSearchCondition,
  getbasketAdd,
  getbasketDel,
  getAnswer,
  getInfo,
} from '@/network/knowledge'
import {
  getKnowledgeByGradIds,
  getTypeBySubjectId,
  getChapterList,
} from '@/network/block'
import { treeData } from '@/utils'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from '../../utils/storage'

export default {
  components: {
    TopicCar,
    SimilarQuestion,
    AddMistake2,
  },
  setup() {
    const router = useRouter()

    const state = reactive({
      data: [],

      sourceType: 0,

      defaultNodeKey: {
        children: 'child',
        label: 'title',
      },
      questionData: [],
      subjectList: [],
      subjectCurrent: 0,

      gradeList: [],
      gradeCurrent: 0,

      typeList: [],
      typeCurrent: -1,

      levelList: [],
      levelCurrent: -1,

      keyword: '',

      page: 1,
      count: 0,
      limit: 10,

      tree: ref(),
      TiRef: ref(),
      tree_selected: [],

      simmilarList: [],
      simmilarCount: 2,
      simmilarDialogVisible: false,
      simmilarId: 0,

      misatkeDialogVisible: false,
      mistakeId: 0,
    })

    const store = useStore()

    onMounted(() => {
      init()
    })

    watch(
      () => store.state.questionList,
      (data, prevdata) => {
        loadQuestion()
      }
    )

    const init = async () => {
      let source_type = storage.get('sourceType')
      if (source_type != null) state.sourceType = parseInt(source_type)

      await loadCondition()
      await loadQuestion()
    }

    const loadCondition = async () => {
      let { code, data } = await getSearchCondition({
        source_type: state.sourceType,
      })
      if (!code) {
        state.subjectList = data.subject
        state.gradeList = data.grade
        state.typeList = data.type
        state.levelList = data.level
        if (state.sourceType) state.data = treeData(data.knowledge)
        else state.data = treeData(data.chapter)

        state.subjectList.forEach((item, index) => {
          if (data.default_subject_id == item.id) state.subjectCurrent = index
        })
      }
    }

    const gradeChange = async (idx) => {
      state.gradeCurrent = idx

      await loadLeft()
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
          state.tree_selected = state.tree
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
      state.questionData[idx].isanswer = !state.questionData[idx].isanswer
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

      await loadLeft()
      await loadType()
      await loadQuestion()

      nextTick(() => {
        state.TiRef.getbasketDetailData()
      })
    }

    const loadLeft = async () => {
      if (state.sourceType) {
        let { code, data } = await getKnowledgeByGradIds({
          subject_id: state.subjectList[state.subjectCurrent].id,
          grade_id: state.gradeList[state.gradeCurrent].id,
        })

        if (!code) {
          state.data = treeData(data)
          state.tree_selected = []
        }
      } else {
        let { code, data } = await getChapterList({
          subject_id: state.subjectList[state.subjectCurrent].id,
          grade_id: state.gradeList[state.gradeCurrent].id,
        })

        if (!code) {
          state.data = treeData(data)
          state.tree_selected = []
        }
      }
    }

    const loadType = async () => {
      let { code, data } = await getTypeBySubjectId({
        subject_id: state.subjectList[state.subjectCurrent].id,
      })

      if (!code) {
        state.typeList = data
      }
    }

    const loadQuestion = async () => {
      let params = {
        subject: state.subjectList[state.subjectCurrent].id,
        grade: state.gradeList[state.gradeCurrent].id,
        type:
          state.typeCurrent == -1 ? '' : state.typeList[state.typeCurrent].id,
        level:
          state.levelCurrent == -1
            ? ''
            : state.levelList[state.levelCurrent].id,
        keyword: state.keyword,
        page: state.page,
        limit: state.limit,
      }

      if (state.sourceType) params.knowledge = state.tree_selected
      else params.chapter = state.tree_selected

      const { code, data } = await getquestion(params)
      if (code == 0) {
        data.list.map((item) => {
          item['isanswer'] = false
        })
        state.questionData = data.list
        state.count = data.count
      }
    }

    const onSimmilarShow = (index) => {
      state.simmilarDialogVisible = true
      state.simmilarList = []
      state.simmilarId = state.questionData[index].id

      loadSimmilarList(state.questionData[index].id)
    }

    const onSimmilarAdd = (id) => {
      state.TiRef.getbasketDetailData()

      state.questionData.map((item) => {
        if (item.id == id) item.has_add_basket = 1
      })
    }

    const onSimmilarRemove = (id) => {
      state.TiRef.getbasketDetailData()

      state.questionData.map((item) => {
        if (item.id == id) item.has_add_basket = 0
      })
    }

    const onSimmilarReload = (id) => {
      loadSimmilarList(id)
    }

    const loadSimmilarList = async (id) => {
      let { code, data } = await getInfo({
        id: id,
        count: state.simmilarCount,
      })
      if (!code) {
        state.simmilarList = data.about
      }
    }

    const reLoadSimmilarList = () => {
      loadSimmilarList(state.simmilarId)
    }

    const addSimmilarQuesiton = async (index) => {
      let item = state.simmilarList[index]
      const { code } = await getbasketAdd({
        id: item.id,
      })
      if (code == 0) {
        state.simmilarList[index].has_add_basket = 1
        state.TiRef.getbasketDetailData()
      }
    }

    const delSimmilarQuesiton = async (index) => {
      let item = state.simmilarList[index]
      const { code } = await getbasketDel({
        id: item.id,
      })
      if (code == 0) {
        state.simmilarList[index].has_add_basket = 0
        state.TiRef.getbasketDetailData()
      }
    }

    const showMistakeDialog = (item) => {
      state.mistakeId = item.id
      state.misatkeDialogVisible = true
    }

    const onAddMistakeClose = (v) => {
      state.misatkeDialogVisible = false
      state.mistakeId = ''
    }

    const onKeywordChange = _.debounce((v) => {
      // loadQuestion()
    }, 300)

    const ellipsis = (value, len) => {
      if (!value) return ''
      if (value.length > len) {
        return value.slice(0, len) + '...'
      }
      return value
    }

    const onSourceChange = (index) => {
      state.sourceType = index
      storage.set('sourceType', index)
      loadLeft()
      loadQuestion()
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
      gradeChange,
      showMistakeDialog,
      onSimmilarShow,
      onSimmilarAdd,
      onSimmilarRemove,
      onSimmilarReload,
      reLoadSimmilarList,
      addSimmilarQuesiton,
      delSimmilarQuesiton,
      onAddMistakeClose,
      onKeywordChange,
      loadQuestion,
      ellipsis,
      onSourceChange,
    }
  },
}
</script>

<style scoped lang="scss">
.simmilar_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.simmilar_content {
  &::v-deep(.iconfont) {
    color: #485ecb !important;
    font-size: 2rem !important;
  }

  .question_list {
    display: block;
    background: #f0f2f5;

    .question_item {
      margin-bottom: 0.5rem;

      .content {
        &::v-deep(p) {
          word-break: break-all;
        }
      }

      .tool {
        display: flex;
        justify-content: flex-end;
        height: 3rem;
        background: #ffffff;
        align-items: center;

        .el-button {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

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
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.625rem;
      font-weight: bold;
      font-size: 1rem;
      div {
        flex: 1;
        background: #ffffff;
        color: #485ecb;
        text-align: center;
        height: 3.125rem;
        line-height: 3.125rem;
        cursor: pointer;
      }
      div:nth-child(1) {
        margin-right: 0.625rem;
      }
      .active {
        background: #485ecb;
        color: #ffffff;
      }
    }

    .tree_grop {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 32px 0px rgba(93, 93, 93, 0.04);
      border-radius: 2px;
      padding: 1.875rem;
      .tree_node {
        font-size: 0.875rem;
      }
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

        //&:last-child {
        //  border-width: 0;
        //}

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
      .search {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3rem;
        padding: 2rem;
        width: 500px;
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
            .similar {
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
            .normal_btn {
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
