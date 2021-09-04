<template>
  <div class="page">
    <div class="box tool_box">
      <el-button type="primary" @click="handleAdd">新增类型</el-button>
    </div>
    <div class="box search_box">
      <el-form :model="search_data" :inline="true">
        <el-form-item>
          <el-input clearable prefix-icon="el-icon-search" placeholder="输入名称" v-model="search_data.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box list_box">
      <div class="table">
        <el-table
            :data="list"
            tooltip-effect="dark"
            style="width: 100%;"
        >
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template v-slot="scope">
              <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                        @click="handleEdit(scope.$index, scope.row)"
                        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/edit_icon.png"></el-image>
              <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                        @click="handleDelete(scope.$index, scope.row)"
                        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/delete_icon.png"></el-image>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            layout="prev, pager, next,jumper"
            :total="count">
          >
        </el-pagination>
      </div>
    </div>
    <!-- 新增/编辑 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible"  width="30rem" center>
      <el-form :model="form_data" :rules="rules" ref="form_ref" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form_data.name" placeholder="请输入名称" style="width: 16rem"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-form-item>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doSaveBuyType" v-if="form_data.id">确定</el-button>
          <el-button type="primary" @click="doAddBuyType" v-else>确定</el-button>
        </el-form-item>
      </template>
    </el-dialog>
    <!-- 删除confirm -->
    <el-dialog title="温馨提示" v-model="confirmShow" width="30rem" center>
      <span>确定删除，继续此操作？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmShow = false">取 消</el-button>
          <el-button type="primary" @click="doDeleteBuyType">确 定</el-button>
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
import {getBuyType, editBuyType, saveBuyType, addBuyType,deleteBuyType} from '@/network/buyType'

export default {
  props: {},
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      search_data: {
        keyword: '',
      },
      condition_data: {},

      page: 1,
      count: 0,
      limit: 10,

      list: [],

      dialogTitle: "",
      dialogVisible: false,
      form_ref: ref(),
      form_data: {
        id: "",
        name: ""
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {max: 20, message: '最大长度限制20个字符', trigger: 'blur'}
        ]
      },

      confirmShow: false,
      confirmId: "",
    })

    onMounted(() => {
      loadData()
    })

    const loadData = async () => {
      let params = {
        page: state.page,
        keyword: state.search_data.keyword
      }
      let {code, data} = await getBuyType(params)
      if (!code) {
        state.list = data.list
        state.count = data.count
      }
    }

    const handleEdit = (index, row) => {
      state.dialogVisible = true
      state.dialogTitle = "编辑"

      state.form_data.id = row.id
      state.form_data.name = row.name
    }

    const handleDelete = (index, row) => {
      state.confirmShow = true
      state.confirmId = row.id
    }

    const doSearch = () => {
      loadData()
    }

    const doAddBuyType = () => {
      state.form_ref.validate(async (valid) => {
        if (valid) {
          let {code, msg} = await addBuyType(state.form_data)
          if (!code) {
            state.dialogVisible = false
            ElMessage.success("添加类型成功")
            await loadData()
          }
        }
      })
    }

    const doSaveBuyType = () => {
      state.form_ref.validate(async (valid) => {
        if (valid) {
          let {code, msg} = await saveBuyType(state.form_data)
          if (!code) {
            state.dialogVisible = false
            ElMessage.success("编辑类型成功")
            await loadData()
          }
        }
      })
    }

    const doDeleteBuyType = async () => {
      let {code,msg} = await deleteBuyType({
        id:state.confirmId
      })
      if(!code)
      {
        ElMessage.success("删除成功")
        state.confirmShow = false
        await loadData()
      }
    }

    const handleAdd = () => {
      state.dialogVisible = true
      state.dialogTitle = "新增"

      state.form_data.id = ""
      state.form_data.name = ""
    }

    return {
      ...toRefs(state),
      handleEdit,
      handleDelete,
      doSearch,
      doAddBuyType,
      handleAdd,
      doDeleteBuyType,
      doSaveBuyType
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
  display: flex;
  flex-direction: column;

  .box {
    background: #FFFFFF;
    padding: 1.875rem;
  }

  .tool_box {
    padding-bottom: 0;
  }

  .search_box {
    padding-bottom: 0;

    .el-form {
      .el-form-item {
        margin-bottom: 0 !important;
      }
    }
  }

  .list_box {
    flex: 1;
    position: relative;

    .table {

    }

    .pagination {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 1.875rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
