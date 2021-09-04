<template>
  <div class="page">
    <el-dialog title="导入" v-model="dialogVisible" width="60rem" center @close="onDialogClose">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="title">
            <h4>导入数据预览
              <el-link type="primary" style="margin-left: 20px" :href="template_rul">模板下载</el-link>
            </h4>
            <el-upload
                :action="upload_url"
                :before-upload="onBeforeUpload"
                :show-file-list="false"
                :on-success="onUploadSuccess"
                name='file'
                :with-credentials='true'
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
          <el-table
              :data="list"
              tooltip-effect="dark"
              height="50vh"
              style="width: 100%"
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="mobile" label="手机号码"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="school" label="所在校区"></el-table-column>
            <el-table-column prop="subject" label="科目"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column label="状态" align="center">
              <template v-slot="scope">
                <template v-if="scope.row.error">
                  <el-tag type="danger">{{ scope.row.message }}</el-tag>
                </template>
                <template v-else>
                  <el-tag type="success">通过检测</el-tag>
                </template>
              </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="60">
              <template #default="scope">
                <el-button type="text" size="small" @click="onRemoveClick(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onDialogClose">取 消</el-button>
          <el-button type="primary" @click="handleImport" size="small">确定导入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs, watch} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {rootURL, baseURL} from '@/utils'
import {teacherImport} from '@/network/teacher'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      dialogVisible: false,
      list: [],
      upload_url: "/ins/Teacher/upload",
      template_rul: "/ins/block/downTpl?type=teacher",
    })

    watch(
        () => props.visible,
        (data, prevdata) => {
          state.dialogVisible = props.visible
        }
    )

    onMounted(() => {
      state.upload_url = baseURL + state.upload_url
      state.template_rul = baseURL + state.template_rul
      state.dialogVisible = props.visible
    })

    const onBeforeUpload = (file) => {
      const suffix = file.name.substr(file.name.lastIndexOf("."))
      const allow_suffix = [".xlsx",".xls"]
      if (allow_suffix.includes(suffix) === false) {
        ElMessage.error("上传文件只能是 .xlsx .xls 格式!")
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        ElMessage.error("上传文件大小不能超过 5MB!")
        return false
      }
    }

    const onUploadSuccess = (res) => {
      let {code, data} = res
      if (!code) {
        state.list = [...state.list,...data]
      }
    }

    const init = () => {
      state.dialogVisible = false
      state.list = []
    }

    const onDialogClose = () => {
      init()
      context.emit("close")
    }

    const handleImport = async () => {
      let {code, data} = await teacherImport({
        list: state.list
      })
      if (!code) {
        init()
        context.emit("import")
      }
    }

    const tableRowClassName = ({row,$index}) => {
      if(row.error)
        return 'warning-row'
      else
          return 'success-row'
    }

    const onRemoveClick = ({row,$index}) => {
      state.list.splice($index,1)
    }

    return {
      ...toRefs(state),
      onBeforeUpload,
      onUploadSuccess,
      onDialogClose,
      handleImport,
      tableRowClassName,
      onRemoveClick
    }
  },
}
</script>

<style scoped lang="scss">
.page {
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  &::v-deep(.warning-row) {
    background: oldlace;
  }

  &::v-deep(.success-row) {
    background: #f0f9eb;
  }
}
</style>
