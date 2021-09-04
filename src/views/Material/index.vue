<template>
  <div class="page">
    <div class="box">
      <div class="search">
        <div class="search_item">
          <h4>科目</h4>
          <ul>
            <li
              :class="{active:search_data.subject_id == item.id}"
              v-for="(item,index) in condition_data.subject"
              :key="index"
              @click="onSubjectChange(index)"
            >{{ item.title }}</li>
          </ul>
        </div>
        <div class="search_item">
          <h4>年级</h4>
          <ul>
            <li
              :class="{active:search_data.grade_id == item.id}"
              v-for="(item,index) in condition_data.grade"
              :key="index"
              @click="onGradeChange(index)"
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
              clearable
              v-model="search_data.keyword"
              size="medium"
              prefix-icon="el-icon-search"
              placeholder="输入教案名称"
              @keyup.enter.native="doSearch"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="result">
          共计
          <span>{{ count }}</span>件教案
        </div>
      </div>
    </div>
    <div class="box">
      <div class="list_box" v-if="count > 0">
        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="left">
              <img src="@/assets/img/material/word.png" v-if="item.suffix == 1" />
              <img src="@/assets/img/material/pdf.png" v-else-if="item.suffix == 2" />
              <img src="@/assets/img/material/ppt.png" v-else-if="item.suffix == 3" />
            </div>
            <div class="middel">
              <h5>{{ item.name }}</h5>
              <p>简介：{{item.desc}}</p>
              <ul>
                <li>大小：{{ item.size }}KB</li>
                <li>上传时间：{{formatTimeToStr(item.add_time * 1000,"yyyy-MM-dd hh:mm")}}</li>
              </ul>
            </div>
            <div class="right">
              <el-button v-if="!item.is_sync" @click="onSyncClick(item)">同步至我的课件</el-button>
              <el-button v-if="item.is_sync" type="danger">查看</el-button>
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
  </div>
</template>

<script>
import { reactive, ref, onMounted, toRefs } from 'vue'
import storage from '@/utils/storage'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { getCondition, getList, syncToLocal } from '@/network/material'
import { formatTimeToStr } from '@/utils'
import PDFJS from 'pdfjs-dist'
export default {
  props: {},
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      search_data: {
        subject_id: '',
        grade_id: '',
        keyword: '',
      },
      condition_data: {
        subject: [],
        grade: [],
      },
      page: 1,
      count: 0,
      limit: 10,
      list: [],
    })

    onMounted(() => {
      init()
      console.log(PDFJS);
    })

    const init = async () => {
      let { code, data } = await getCondition()
      if (!code) {
        state.condition_data.subject = [...data.subject]
        state.condition_data.grade = [...data.grade]

        if (data.default_subject_id) {
          state.search_data.subject_id = data.default_subject_id
        }
        if (data.grade.length > 0) state.search_data.grade_id = data.grade[0].id
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

    const handleCurrentChange = _.debounce((page) => {
      state.page = page
      doSearch()
    }, 300)

    const onSyncClick = async (item) => {
      let { code } = await syncToLocal(item)
      if (!code) {
        ElMessage.success('同步成功')
        doSearch()
      }
    }

    return {
      ...toRefs(state),
      doSearch,
      onSubjectChange,
      onGradeChange,
      formatTimeToStr,
      handleCurrentChange,
      onSyncClick,
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
    margin-bottom: 0.9375rem;
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
    .list_box {
      .list {
        .item {
          display: flex;
          flex-direction: row;
          padding: 1.875rem;
          border-bottom: 1px solid #e5e5e5;
          .left {
            width: 5rem;
            height: 6.25rem;
            background: url('../../assets/img/material/book.png') no-repeat
              center center;
            background-size: cover;
            position: relative;
            border: 1px solid #e5e5e5;
            padding: 2rem;
            img {
              position: absolute;
              right: 5px;
              bottom: 5px;
              width: 1.25rem;
              height: 1.25rem;
            }
          }
          .middel {
            flex: 1;
            margin-left: 1.875rem;
            overflow: hidden;
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
            flex-basis: 15rem;
            margin-left: 1.875rem;
            text-align: right;
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
  .box:nth-child(2) {
    background: none;
    padding: 0;
  }
  .box:last-child {
    margin-bottom: 0;
  }
}
</style>
