<template>
  <div class="page">
    <div class="box">
      <div class="tool_bar">
        <el-button type="primary" @click="openUploadDialog">上传教案</el-button>
      </div>
    </div>
    <div class="box">
      <div class="search">
        <div class="search_item">
          <h4>科目</h4>
          <ul>
            <li :class="{active:search_data.subject_id == item.id}" v-for="(item,index) in condition_data.subject" :key="index" @click="onSubjectChange(index)">{{ item.title }}</li>
          </ul>
        </div>
        <div class="search_item">
          <h4>年级</h4>
          <ul>
            <li :class="{active:search_data.grade_id == item.id}" v-for="(item,index) in condition_data.grade" :key="index" @click="onGradeChange(index)">{{ item.name }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="form">
        <el-form inline>
          <el-form-item prop="keyword">
            <el-input type="text" clearable size="medium" prefix-icon="el-icon-search" placeholder="输入教案名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="result">
          共计<span>{{ count }}</span>件教案
        </div>
      </div>
    </div>
    <div class="box">
      <div class="list_box" v-if="count > 0">
        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="left">
              <img src="@/assets/img/material/word.png" v-if="item.suffix == 1"/>
              <img src="@/assets/img/material/pdf.png" v-else-if="item.suffix == 2" />
              <img src="@/assets/img/material/ppt.png" v-else/>
            </div>
            <div class="middel">
              <h5>{{ item.name }}</h5>
              <p>简介：{{item.desc}}</p>
              <ul>
                <li>大小：{{ item.file_size }}KB</li>
                <li>上传时间：{{formatTimeToStr(item.add_time * 1000,"yyyy-MM-dd hh:mm")}}</li>
              </ul>
            </div>
            <div class="right">
              <el-button type="danger">查看</el-button>
              <el-button type="primary" @click="onDownClick(item)">下载</el-button>
              <el-button @click="onDelClick(item)">删除</el-button>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
              :current-page="page"
              :page-size="limit"
              layout="prev, pager, next,jumper"
              :total="count">
          </el-pagination>
        </div>
      </div>
      <el-empty description="未找到数据" v-else></el-empty>
    </div>
    <UploadDialog :visible="visible" @close="onCloseUploadDialog" @submit="onSubmitUpload" />
    <!-- 删除dialog -->
    <el-dialog title="温馨提示" v-model="confirmShow" width="40.625rem" center>
      <span>确定删除？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmShow = false">取 消</el-button>
          <el-button type="primary" @click="onDelConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import UploadDialog from "../../components/MyMaterial/UploadDialog";
import {getCondition,getMyList,remove} from '@/network/material'
import {formatTimeToStr,baseURL} from '@/utils'

export default {
  components:{
    UploadDialog
  },
  props: {},
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      search_data: {
        subject_id:'',
        grade_id:'',
        keyword:'',
      },
      condition_data: {
        subject: [],
        grade: [],
      },

      page: 1,
      count: 0,
      limit: 10,

      list: [],

      visible:false,

      confirmShow:false,
      confirm_data: {
        id:0,
      },
    })

    onMounted(() => {
      init()
    })

    const init = async () => {
      let {code,data} = await getCondition()
      if(!code)
      {
        state.condition_data.subject = [...data.subject]
        state.condition_data.grade = [{id:'',name:'全部'},...data.grade]

        if(data.default_subject_id)
        {
          state.search_data.subject_id =  data.default_subject_id
        }
      }

      doSearch()
    }

    const doSearch = async () => {
      let params = {...{
          page:state.page,
          limit:state.limit,
        },...state.search_data}

      let {code,data} = await getMyList(params)
      if(!code)
      {
        state.list = data.list
        state.count = data.count
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

    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      doSearch()
    },300)

    const openUploadDialog = () => {
      state.visible = true
    }

    const onCloseUploadDialog = () => {
      state.visible = false
    }

    const onDownClick = (item) => {
      if(item.is_sync)
      {
        window.open(item.file_src)
      }
      else
      {
        window.open(baseURL + item.file_src)
      }
    }

    const onDelClick = (item) => {
      state.confirm_data.id = item.id
      state.confirmShow = true
    }

    const onDelConfirm = async () => {
      let {code} = await remove({
        id:state.confirm_data.id
      })
      if(!code)
      {
        ElMessage.success("删除成功")
        state.confirmShow = false
        doSearch()
      }
    }

    const onSubmitUpload = () =>{
      doSearch()
    }

    return {
      ...toRefs(state),
      openUploadDialog,
      onCloseUploadDialog,
      doSearch,
      onSubjectChange,
      onGradeChange,
      formatTimeToStr,
      handleCurrentChange,
      onDownClick,
      onDelClick,
      onDelConfirm,
      onSubmitUpload
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
    padding: 0.625rem;

    .search {
      padding: 0.40rem;
      .search_item{
        display: flex;
        padding: 1.25rem;
        border-bottom: 1px solid #E5E5E5;
        h4{
          font-size: 1rem;
          color: #222222;
          flex-basis: 5rem;
          text-align: center;
        }
        ul{
          flex: 1;
          li{
            display: inline-block;
            margin-right: 2.5rem;
            .el-checkbox{
              &::v-deep(.el-checkbox__label){
                font-size: 1rem !important;
              }
            }
          }
          li:hover{
            cursor: pointer;
            color: #485ECB;
          }
          .active{
            color: #485ECB;
            font-weight:bold;
          }
        }
      }
      .search_item:last-child{
        border-bottom: 0;
      }
    }
    .form{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-form{
        .el-form-item{
          margin-bottom: 0;
        }
      }
      .result{
        font-weight: bold;
        span{
          color: #F96160;
          margin: 0 10px;
        }
      }
    }
    .list_box{
      .list{
        .item{
          display: flex;
          flex-direction: row;
          padding: 1.875rem;
          border-bottom: 1px solid #E5E5E5;
          .left{
            width: 5rem;
            height: 6.25rem;
            background: url('../../assets/img/material/book.png') no-repeat center center;
            background-size: cover;
            position: relative;
            border: 1px solid #E5E5E5;
            padding: 2rem;
            img{
              position: absolute;
              right: 5px;
              bottom: 5px;
              width: 1.25rem;
              height: 1.25rem;
            }
          }
          .middel{
            flex: 1;
            margin-left: 1.875rem;
            overflow: hidden;
            h5{
              font-weight: bold;
              height: 20px;
              line-height: 20px;
              font-size: 1rem;
              span{
                background: #F18037;
                padding: 4px 6px;
                line-height: 1;
                color: #FFFFFF;
                display: inline-block;
                margin-left: 10px;
                font-size: 0.75rem;
              }
            }
            p{
              margin-top: 1.875rem;
              color: #999999;
              font-size: 0.875rem;
            }
            ul{
              margin-top: 0.875rem;
              li{
                display: inline-block;
                margin-left: 3.125rem;
                font-size: 0.875rem;
              }
              li:first-child{
                margin-left: 0;
              }
            }
          }
          .right{
            flex-basis: 15rem;
            margin-left: 1.875rem;
            text-align: right;
          }
        }
        .item:last-child{
          border-bottom: 0;
        }
      }
      .pagination{
        text-align: center;
      }
    }
  }
  .box:nth-child(1){
    margin-bottom: 0;
    padding: 1.875rem;
    padding-bottom: 0;
  }
  .box:nth-child(3){
    background: none;
  }
}
</style>
