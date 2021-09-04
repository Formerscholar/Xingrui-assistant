<template>
  <div id="DownDialog">
    <el-dialog v-model="dialogVisible" width="37.5rem" center @open="onDialogOpen" @close="onDialogClose">
      <el-form label-width="100px" :rules="rules" ref="form_ref" :model="form_data">
        <el-form-item label="科目" prop="subject_id">
          <el-select v-model="form_data.subject_id" placeholder="选择科目" style="width: 100%">
            <el-option
                v-for="(item,index) in condition_data.subject"
                :key="index"
                :label="item.title"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade_id">
          <el-select v-model="form_data.grade_id" placeholder="选择年级" style="width: 100%">
            <el-option
                v-for="(item,index) in condition_data.grade"
                :key="index"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="form_data.name" placeholder="输入课件教案名称"></el-input>
        </el-form-item>
        <el-form-item prop="files">
          <el-upload
              drag
              :action="upload_url"
              :file-list="form_data.files"
              :with-credentials='true'
              :limit="upload_config.limit"
              :before-upload="onBeforeUploadCallback"
              :on-success="onSuccessCallback"
              :on-exceed="onExceedCallback"
              :on-remove="onRemoveCallback">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 .pdf .doc .docx .ppt格式文件，且不超过 5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #title>
        <div class="dialog_title">上传教案</div>
      </template>
      <template #footer>
        <div class="dialog_footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitClick">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {reactive, toRefs, watch, onMounted, ref} from 'vue'
import {baseURL} from '@/utils'
import {ElMessage} from "element-plus";
import {getSubjectList,getAllGrade} from '@/network/block'
import { useStore } from 'vuex'
import {addMaterial} from '@/network/material'

export default {
  props: {
    visible: Boolean,
  },
  emits: ["close", "update"],
  setup(props, context) {
    const store = useStore()

    const state = reactive({
      upload_url:"/ins/Material/upload",

      condition_data:{
        subject:[],
        grade:[],
      },

      upload_config: {
        limit: 1,
      },

      form_data: {
        subject_id: "",
        grade_id: "",
        name: "",
        files: [
          // {
          //   name: 'food.jpeg',
          //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          // }
        ]
      },
      form_ref: ref(),
      rules: {
        subject_id: [
          {required: true, message: '请选择科目', trigger: 'change'},
        ],
        grade_id: [
          {required: true, message: '请选择年级', trigger: 'change'},
        ],
        name: [
          {required: true, message: '请输入课件教案名称', trigger: 'blur'},
          {max: 64, message: '最大长度限制64个字符', trigger: 'blur'}
        ],
        files: [
          {required: true, type: "array", message: '请上传文件', trigger: 'blur'},
          {
            validator: (rule, value, callBack) => {
              if (value.length)
                callBack()
              else
                callBack("请上传文件")
            }
          }
        ],
      },

      dialogVisible: false
    })

    watch(
        () => props.visible,
        (data, prevdata) => {
          state.dialogVisible = props.visible
        }
    )

    onMounted(() => {
      state.upload_url = baseURL + state.upload_url
      state.dialogVisible = props.visible

      loadCondition()
    })

    const loadCondition = async () => {
      var {code,data} = await getSubjectList()
      if(!code)
      {
        let current_subject = store.state.userInfo.subject_ids.split(",").map((s) => { return parseInt(s) });
        let subject_list = []
        data.forEach(item => {
          if(current_subject.includes(item.id))
            subject_list.push(item)
        })
        state.condition_data.subject = subject_list
      }
      var {code,data} = await getAllGrade()
      if(!code)
      {
        let current_grade = store.state.userInfo.grade_ids.split(",").map((s) => { return parseInt(s) });
        let grade_list = []
        data.forEach(item => {
          if(current_grade.includes(item.id))
            grade_list.push(item)
        })
        state.condition_data.grade = grade_list
      }
    }

    const submitClick = () => {
      state.form_ref.validate(async (valid) => {
        if (valid) {
          // ElMessage.success("通过表单验证")
          let {code,data} = await addMaterial(state.form_data)
          if(!code)
          {
            ElMessage.success("提交教案成功")
            context.emit("submit")
            state.dialogVisible = false
          }
        }
      })
    }

    const onDialogClose = () => {
      context.emit('close', state.dialogVisible);
    }

    const onBeforeUploadCallback = (file) => {
      const suffix = file.name.substr(file.name.lastIndexOf("."))
      const allow_suffix = [".pdf", ".doc", ".docx", ".ppt"]
      if (allow_suffix.includes(suffix) === false) {
        ElMessage.error("上传文件只能是 .pdf .doc .docx .ppt格式!")
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        ElMessage.error("上传文件大小不能超过 5MB!")
        return false
      }
    }

    const onSuccessCallback = (res, file, fileList) => {
      if(res.code)
      {
        ElMessage.error(res.msg)
      }
      else
      {
        state.form_data.files.push({
          name:file.name,
          url:res.data.file_src,
          size:file.size,
        })
      }
    }

    const onExceedCallback = (files, fileList) => {
      ElMessage.warning("最多上传 " + state.upload_config.limit + " 个文件")
    }

    const onRemoveCallback = (files, fileList) => {
      state.form_data.files = fileList
    }

    return {
      ...toRefs(state),
      onDialogClose,
      submitClick,
      onExceedCallback,
      onBeforeUploadCallback,
      onRemoveCallback,
      onSuccessCallback
    }
  },
}
</script>

<style scoped lang="scss">
#DownDialog {
  .box {
    .chooice {
      & > div {
        display: flex;
        margin-bottom: 2rem;
        padding-left: 1.5rem;

        .el-radio {
          margin-right: 0;
        }

        & > p {
          font-size: 0.875rem;
          color: #999999;
        }
      }

      & > div:last-child {
        margin-bottom: 0;
      }
    }
  }

  .dialog_title {
    text-align: left;
  }

  .dialog_footer {
    text-align: right;
  }
}
</style>
