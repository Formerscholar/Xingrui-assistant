<template>
  <div class="page">
    <el-dialog :title="title?title:defaultDialogTitle" v-model="dialogVisible" @close="onDialogClose" width="30rem" center>
      <el-form :model="student_data" :rules="rules" ref="form_ref" label-width="110px">
        <el-form-item label="姓名" prop="name">
          <el-input
              v-model="student_data.name"
              placeholder="请输入学生姓名"
              style="width: 16rem"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
              v-model="student_data.sex"
              placeholder="性别"
          >
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在校区" prop="school_id">
          <el-select
              v-model="student_data.school_id"
              placeholder="请选择所在校区"
              @change="onSchoolChange"
          >
            <el-option
                v-for="item in search_condition.school"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select
              v-model="student_data.team_ids"
              placeholder="请选择班级"
              multiple
          >
            <el-option
                v-for="item in search_condition.team"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责老师">
          <el-select
              v-model="student_data.uids"
              placeholder="请选择老师"
              multiple
          >
            <el-option
                v-for="item in search_condition.teacher"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家长联系方式" prop="mobile">
          <el-input v-model="student_data.mobile" placeholder="请输入家长联系方式" style="width: 16rem"></el-input>
        </el-form-item>
        <el-form-item label="销售人员">
          <el-select
              v-model="student_data.saler"
              placeholder="请选择销售人员"
              clearable
          >
            <el-option
                v-for="item in search_condition.teacher"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input type="textarea" v-model="student_data.mark" placeholder="请输入学生的备注"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doAddStudent">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs, watch} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {StudentAdd} from '@/network/student'
import {getSchoolList, getTeamList, getTeacherList, getCourseList} from "@/network/block";
import {detailTeam} from '@/network/team'

export default {
  props: {
    title: String,
    visible: Boolean,
    teamId: Number
  },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      defaultDialogTitle: "新增",
      dialogVisible: false,


      search_condition: {
        school: [],
        team: [],
        teacher: [],
      },
      student_data: {
        id: "",
        name: "",
        sex: "",
        school_id: "",
        team_ids: [],
        uids: [],
        mobile: "",
        saler: "",
        mark: "",
      },
      form_ref: ref(),
      rules: {
        name: [
          {required: true, message: '请输入学生姓名', trigger: 'blur'},
          {max: 20, message: '最大长度限制20个字符', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'blur'},
        ],
        school_id: [
          {required: true, message: '请选择校区', trigger: 'blur'},
        ],
        team_ids: [
          {required: true, message: '请选择班级', trigger: 'blur'},
        ],
        uids: [
          {required: true, message: '请选择负责的老师', trigger: 'blur'},
        ],
        mobile: [
          {
            validator: (rule, value, callBack) => {
              if (value) {
                if (/^[1][0-9]{10}$/.test(value))
                  callBack()
                else
                  callBack("请输入正确的手机号码")
              } else
                callBack()
            }
          }
        ],
        mark: [
          {max: 200, message: '最大长度限制200个字符', trigger: 'blur'}
        ],
      },
    })

    watch(
        () => props.visible,
        (data, prevdata) => {
          state.dialogVisible = props.visible
          if(props.visible)
          {
            state.student_data.name = ""
            state.student_data.sex = ""
            state.student_data.mobile = ""
            state.student_data.saler = ""
            state.student_data.mark = ""
          }
        }
    )

    onMounted(() => {
      init()
    })

    const init = async () => {
      state.dialogVisible = props.visible
      await loadTeamDetail()
      await loadCondition()
    }

    const loadTeamDetail = async () => {
      let {code,data} = await detailTeam({
        id:props.teamId
      })
      if(!code)
      {
        state.student_data.school_id = data.school_id
        state.student_data.team_ids = [data.id]
        state.student_data.uids = [...data.uids]
      }
    }

    const loadCondition = async () => {
      let {code,data} = await getSchoolList()
      if(!code)
        state.search_condition.school = data

      if(state.student_data.school_id)
      {
        await onSchoolChange(state.student_data.school_id)
      }
    }

    const onSchoolChange = async (school_id) => {
      var {data} = await getTeamList({
        school_id: school_id
      })
      state.search_condition.team = data

      var {data} = await getTeacherList({
        school_id: school_id
      })
      state.search_condition.teacher = data
    }

    const doAddStudent = () => {
      state.form_ref.validate(async (valid) => {
          if(valid)
          {
            let {code} = await StudentAdd(state.student_data)
            if(!code)
            {
              ElMessage.success("添加学生成功")
              state.dialogVisible = false
            }
          }
      })
    }

    const onDialogClose = () => {
      context.emit('close', state.dialogVisible);
    }

    return {
      ...toRefs(state),
      onSchoolChange,
      doAddStudent,
      onDialogClose
    }
  },
}
</script>

<style scoped lang="scss">
.page {

}
</style>
