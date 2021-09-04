<template>
  <div id="Paper">
    <div class="title">
      <el-button type="primary" @click="goAddPaper" v-if="store.state.userInfo.subject_ids">新增组卷</el-button>
    </div>
    <div class="selcsear">
      <el-form inline>
        <el-form-item>
          <el-select
              style="width:9.375rem;"
              v-model="subject_text"
              placeholder="学科"
              clearable
          >
            <el-option
                v-for="item in search_condition.subject"
                :key="item.id"
                :label="item.title"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
              class="inp_dom"
              v-model="search_text"
              placeholder="输入试卷名称"
          >
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchbtn" type="primary" @click="getpaperListData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lists" v-if="count > 0">
      <div class="item" v-for="item in listData.list" :key="item.id">
        <div class="left_info">
          <SubjectPic :subject_id="item.subject_id" />
          <div class="info_texts">
            <h4 @click="pageDetali(item.id)">{{ item.title }}</h4>
            <p>
              <span>出卷人：{{ item.user_data.name }}</span>
              <span>组卷时间：{{ setTimerType(item.add_time * 1000, true) }}</span>
            </p>
          </div>
        </div>
        <div class="right_btns">
          <el-button
            class="itembtn edit"
            type="danger"
            @click="editPaper(item.id)"
            >编辑</el-button
          >
          <el-button
            class="itembtn download"
            type="primary"
            @click="downloadPaper(item.id, item.title)"
            >下载</el-button
          >
          <el-button
            class="itembtn remove"
            @click="deletePaper(item.id, item.title)"
            >删除</el-button
          >
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
    <DownDialog :isDown="isDown" :downId="downId" :downTitle="downTitle" @close="onDownDialogClose" />
    <el-dialog title="温馨提示" v-model="isdel" width="40.625rem">
      <span>确认删除{{ delTitle }}吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isdel = false">取 消</el-button>
          <el-button type="primary" @click="delClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, onBeforeMount, toRefs } from 'vue'
import { getpaperList, getdeleteItem, geteditItem } from '@/network/paper'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { setTimerType, rootURL } from '@/utils'
import DownDialog from '@/components/DownDialog/DownDialog'
import {getSubjectList} from '@/network/block'
import SubjectPic from "../../components/Paper/SubjectPic";

export default {
  components: {
    DownDialog,
    SubjectPic
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      subject_text: '',
      grade_text: '',
      search_text: '',
      listData: {},
      downId: '',
      downTitle: '',
      isDown: false,
      isdel: false,
      delId: '',
      delTitle: '',

      search_condition:{
        subject:[]
      },

      page: 1,
      count: 0,
      limit: 10,
    })

    onBeforeMount(() => {
      loadCondition()
      getpaperListData()
    })

    const loadCondition = async () => {
      var {code,data} = await getSubjectList()
      if(!code)
        state.search_condition.subject = data
    }

    const getpaperListData = async () => {
      const { code, data } = await getpaperList({
        keyword: state.search_text,
        page: state.page,
        limit: state.limit,
        subject_id: state.subject_text,
        from:"my"
      })
      if (code == 0) {
        state.listData = data
        state.count = data.count
      }
    }

    const deletePaper = (id, title) => {
      state.delId = id
      state.delTitle = title
      state.isdel = true
    }

    const delClick = async () => {
      state.isdel = false
      const { code } = await getdeleteItem({ id: state.delId })
      if (code == 0) {
        getpaperListData()
      }
    }

    const downloadPaper = (id, title) => {
      state.downId = id
      state.downTitle = title
      state.isDown = true
    }

    const editPaper = async (id) => {
      const { code } = await geteditItem({ id })
      if (code == 0) {
        router.push(`/preview_edit/${id}`)
      }
    }

    const pageDetali = (id) => {
      router.push(`/paper/detail/${id}`)
    }

    const onDownDialogClose = () => {
      state.isDown = false
      state.downId = ''
      state.downTitle = ''
    }

    const goAddPaper = () => {
      router.push(`/bank`)
    }

    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      getpaperListData()
    },300)

    return {
      ...toRefs(state),
      store,
      setTimerType,
      deletePaper,
      downloadPaper,
      getpaperListData,
      editPaper,
      delClick,
      pageDetali,
      onDownDialogClose,
      goAddPaper,
      handleCurrentChange
    }
  },
}
</script>

<style scoped lang="scss">
#Paper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  padding: 1.875rem;
  .title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #222222;
    margin-bottom: 1rem;
  }
  .lists {
    .item {
      height: 7.625rem;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.875rem;
      margin-bottom: 0.9375rem;
      &:last-child {
        margin-bottom: 0;
      }

      .left_info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .paper_icon {
          margin-right: 1.875rem;
        }
        .info_texts {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;

          h4{
            font-size: 1rem;
            font-weight: bold;
            color: #222222;
            margin-bottom: 0.8125rem;
            cursor: pointer;
          }
          p{
            margin-bottom: 0.625rem;
            span{
              font-size: 0.875rem;
              font-weight: 400;
              color: #444444;
              margin-left: .875rem;
            }
            span:first-child{
              margin-left: 0;
            }
          }
        }
      }
      .right_btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .itembtn {
          width: 4.5625rem;
          height: 2.625rem;
          border-radius: 0.375rem;
        }
        .edit {
          background: #f96160;
          border-color: #f96160;
        }
        .download {
          background: #485cc8;
          border-color: #485cc8;
        }
        .remove {
          border: 1px solid #485cc8;
          background-color: #fff;
          color: #485cc8;
          &:hover {
            color: #485cc8;
          }
        }
      }
    }
    .pagination{
      text-align: center;
    }
  }
  .downDiv {
    width: 100%;
    .title {
      width: 100%;
      text-align: center;
    }
    .select_box {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding-left: 3.125rem;
      .lable {
        font-size: 1rem;
        font-weight: 400;
        color: #222222;
        width: 6.25rem;
        margin-right: 1.25rem;
      }
      .tip {
        margin-left: 1rem;
        font-size: 0.875rem;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
</style>
