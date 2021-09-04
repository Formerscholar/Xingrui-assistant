<template>
  <div class="page">
    <div class="box title">上传试卷列表</div>
    <div class="box search">
      <el-row>
        <el-col :span="22">
          <el-form inline>
            <el-form-item>
              <el-select placeholder="选择班级" v-model="search_data.team_id">
                <el-option v-for="(item,index) in condition_data.team" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select placeholder="选择科目" v-model="search_data.subject_id">
                <el-option v-for="(item,index) in condition_data.subject" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                  placeholder="请输入试卷名称"
                  prefix-icon="el-icon-search"
                  v-model="search_data.keyword">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSearch" >搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="onUploadClick">上传试卷</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="box list">
      <el-table
          ref="ref_list"
          :data="table_data"
          tooltip-effect="dark"
          style="width: 99%;"
      >
        <el-table-column prop="name" label="名称" width="200"> </el-table-column>
        <el-table-column label="上传时间" width="">
          <template v-slot="scope">{{
              setTimerType(scope.row.add_time * 1000, true)
            }}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="">
          <template v-slot="scope">{{
              setTimerType(scope.row.add_time * 1000, true)
            }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box page">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="count"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted,toRefs } from 'vue'
import storage from '@/utils/storage'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import {getList,add} from '@/network/paperUpload'
import {getTeamList,getSubjectList} from '@/network/block'

export default {
  props:{},
  setup(props,context) {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      search_data:{
        team_id:'',
        subject_id:'',
        keyword:'',
      },
      condition_data:{
        team:[],
        subject:[],
      },
      page:1,
      count:0,
      limit:10,

      table_data:[],
    })

    onMounted(() => {
      loadData()
      loadCondition()
    })

    const loadData = async () => {
      let {code,data} = await getList()
      if(!code)
      {
        state.table_data = data.list
        state.count = data.count
      }
    }

    const loadCondition = async () => {
      var {code,data} = await getTeamList()
      if(!code)
        state.condition_data.team = data

      var {code,data} = await getSubjectList()
      if(!code)
        state.condition_data.subject = data
    }

    const doSearch = () => {
      loadData()
    }

    const handleSizeChange = () => {

    }

    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      loadData()
    },300)

    const onUploadClick = () => {
      router.push('/paperupload/add')
    }

    return {
      ...toRefs(state),
      doSearch,
      handleSizeChange,
      handleCurrentChange,
      onUploadClick
    }
  },
}
</script>

<style scoped lang="scss">
  .page{
    background: #ffffff;
    position: relative;

    .box{
      display: block;
      width: 100%;
      margin-bottom: .5rem;
    }
    .title{
      margin-bottom: 2rem;
      font-size: 1.25rem;
      font-weight: bold;
    }
    .search{
      margin-bottom: 0;
    }
    .page{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 1.875rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
