<template>
  <div class="page">
    <div class="box">
      <div class="search">
        <div class="search_item">
          <h4>科目</h4>
          <ul>
            <li
              :class="{ active: search_data.subject_id == item.id }"
              v-for="(item, index) in condition_data.subject"
              :key="index"
              @click="onSubjectChange(index)"
            >{{ item.title }}</li>
          </ul>
        </div>
        <div class="search_item">
          <h4>年级</h4>
          <ul>
            <li
              :class="{ active: search_data.grade_id == item.id }"
              v-for="(item, index) in condition_data.grade"
              :key="index"
              @click="onGradeChange(index)"
            >{{ item.name }}</li>
          </ul>
        </div>
        <div class="search_item">
          <h4>分类</h4>
          <ul>
            <li
              :class="{ active: search_data.category_id == item.id }"
              v-for="(item, index) in condition_data.category"
              :key="index"
              @click="onCategoryChange(index)"
            >{{ item.name }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="form">
        <el-form inline @submit.native.prevent>
          <el-form-item prop="keyword">
            <el-input
              type="text"
              v-model="search_data.keyword"
              size="medium"
              prefix-icon="el-icon-search"
              placeholder="输入试卷名称"
              @keyup.enter.native="doSearch"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="result">
          共计
          <span>{{ count }}</span>份试卷
        </div>
      </div>
    </div>
    <div class="box">
      <div class="list_box" v-if="count > 0">
        <div class="list">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="left">
              <SubjectPic :subject_id="item.subject_id" />
            </div>
            <div class="middel">
              <h5>{{ item.title }}</h5>
              <ul>
                <li>
                  更新时间：{{
                  formatTimeToStr(item.add_time * 1000, 'yyyy-MM-dd hh:mm')
                  }}
                </li>
                <li>浏览次数：166</li>
                <li v-if="item.is_famous">
                  最后同步时间：{{
                  formatTimeToStr(item.sync_time * 1000, 'yyyy-MM-dd hh:mm')
                  }}
                </li>
              </ul>
            </div>
            <div class="right">
              <el-button v-if="!item.is_famous" @click="onSyncClick(item)">同步至我的试卷</el-button>
              <el-button
                v-if="item.is_famous"
                type="danger"
                @click="pageDetali(item.local_paper_id)"
              >查看</el-button>
              <el-button type="primary" @click="onDownClick(item)">下载</el-button>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            layout="prev, pager, next,jumper"
            :total="count"
          ></el-pagination>
        </div>
      </div>
      <el-empty description="未找到数据" v-else></el-empty>
    </div>
    <DownDialog :visible="visible" :down_list="down_list" @close="onDownDialogClose" />
  </div>
</template>

<script>
import { reactive, ref, onMounted, toRefs } from 'vue'
import storage from '@/utils/storage'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import DownDialog from '../../components/Famous/DownDialog'
import { getCondition, getList, syncToLocal } from '@/network/famous'
import SubjectPic from '../../components/Paper/SubjectPic'
import { formatTimeToStr } from '@/utils'

export default {
  props: {},
  components: {
    DownDialog,
    SubjectPic,
  },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      search_data: {
        subject_id: '',
        grade_id: '',
        category_id: '',
        keyword: '',
      },
      condition_data: {
        subject: [],
        grade: [],
        category: [],
      },

      page: 1,
      count: 0,
      limit: 20,

      list: [],

      visible: false,
      down_list: [],
    })

    onMounted(() => {
      init()
    })

    const init = async () => {
      let { code, data } = await getCondition()
      if (!code) {
        state.condition_data.subject = [
          { title: '全部', id: 0 },
          ...data.subject,
        ]
        state.condition_data.grade = [{ name: '全部', id: 0 }, ...data.grade]
        state.condition_data.category = [
          { name: '全部', id: 0 },
          ...data.category,
        ]

        // if (data.default_subject_id) {
        //   state.search_data.subject_id = data.default_subject_id
        // }
        // if (data.grade.length > 0) state.search_data.grade_id = data.grade[0].id
        // if (data.category) state.search_data.category_id = data.category[0].id
      }

      doSearch()
    }

    const doSearch = async () => {
      let params = {
        ...{
          page: state.page,
          limit: state.limit,
        },
        ...state.search_data,
      }

      let { code, data } = await getList(params)
      if (!code) {
        state.list = data.data
        state.count = data.total
      }
    }

    const onSubjectChange = (index) => {
      state.search_data.subject_id = state.condition_data.subject[index].id
      doSearch()
    }

    const onGradeChange = (index) => {
      state.search_data.grade_id = state.condition_data.grade[index].id
      doSearch()
    }

    const onCategoryChange = (index) => {
      state.search_data.category_id = state.condition_data.category[index].id
      doSearch()
    }

    const handleCurrentChange = _.debounce((page) => {
      state.page = page
      doSearch()
    }, 300)

    const onDownClick = (item) => {
      state.visible = true

      let list = []
      if (item.pdf1)
        list.push({
          name: '教师用卷',
          desc: '(含答案和解析)',
          url: item.pdf1,
        })
      if (item.pdf2)
        list.push({
          name: '学生用卷',
          desc: '(不含答案和解析)',
          url: item.pdf2,
        })
      state.down_list = list
    }
    const onDownDialogClose = () => {
      state.visible = false
    }
    const onSyncClick = async (item) => {
      let { code, data } = await syncToLocal({
        sync_id: item.id,
      })
      if (!code) {
        ElMessage.success('同步成功')
        doSearch()
      }
    }
    const pageDetali = (id) => {
      router.push(`/paper/detail/${id}`)
    }

    return {
      ...toRefs(state),
      onDownClick,
      onDownDialogClose,
      doSearch,
      onSubjectChange,
      onGradeChange,
      onCategoryChange,
      handleCurrentChange,
      formatTimeToStr,
      onSyncClick,
      pageDetali,
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
    background: #ffffff;
    padding: 1.875rem;
    margin-bottom: 0.9375rem;
  }

  .box:nth-child(1) {
    padding: 0.625rem;

    .search {
      .search_item {
        display: flex;
        padding: 1.25rem;
        border-bottom: 1px solid #e5e5e5;

        h4 {
          font-size: 1rem;
          color: #222222;
          flex-basis: 5rem;
          text-align: center;
        }

        ul {
          flex: 1;

          li {
            display: inline-block;
            margin-right: 2.5rem;

            .el-checkbox {
              &::v-deep(.el-checkbox__label) {
                font-size: 1rem !important;
              }
            }
          }

          li:hover {
            cursor: pointer;
            color: #485ecb;
          }

          .active {
            color: #485ecb;
            font-weight: bold;
          }
        }
      }

      .search_item:last-child {
        border-bottom: 0;
      }
    }
  }

  .box:nth-child(2) {
    padding: 0;
    background: none;
    .form {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-form {
        .el-form-item {
          margin-bottom: 0;
        }
      }

      .result {
        font-weight: bold;

        span {
          color: #f96160;
          margin: 0 10px;
        }
      }
    }
  }

  .box:nth-child(3) {
    margin-bottom: 0;
    padding: 0;
    .list_box {
      .list {
        padding: 0 1.875rem;
        .item {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #e5e5e5;
          padding: 1.875rem 0;

          .left {
            flex-basis: 4.375rem;
            &::v-deep(.com) {
              height: 100%;
              .img_box {
                height: 100%;
                width: 100%;
                margin-right: 0;
              }
            }
          }

          .middel {
            flex: 1;
            margin-left: 1.875rem;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;

            h5 {
              font-weight: bold;
              height: 20px;
              line-height: 20px;
              font-size: 1rem;

              span {
                background: #f18037;
                padding: 4px 6px;
                line-height: 1;
                color: #ffffff;
                display: inline-block;
                margin-left: 10px;
                font-size: 0.75rem;
              }
            }

            p {
              margin-top: 1.875rem;
              color: #999999;
              font-size: 0.875rem;
            }

            ul {
              margin-top: 0.875rem;

              li {
                display: inline-block;
                margin-left: 3.125rem;
                font-size: 0.875rem;
              }

              li:first-child {
                margin-left: 0;
              }
            }
          }

          .right {
            flex-basis: 20rem;
            align-self: stretch;
            margin-left: 1.875rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
        }

        .item:last-child {
          border-bottom: 0;
        }
      }

      .pagination {
        text-align: center;
      }
    }
  }
}
</style>
