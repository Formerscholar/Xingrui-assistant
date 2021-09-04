<template>
  <div id="Password">
    <div class="box">
      <h4>修改密码</h4>
    </div>
    <div class="box form_box">
      <el-form label-position="top" :rules="rules" label-width="80px" :model="form_data">
        <el-form-item label="旧的密码" prop="old_password">
          <el-input v-model="form_data.old_password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新的密码">
          <el-input v-model="form_data.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="form_data.repassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs} from 'vue'
import { useRouter,useRoute } from 'vue-router'
import {updatePassword} from '@/network/user'
import { ElMessage } from 'element-plus'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      form_data : {
        old_password:'',
        password:'',
        repassword:''
      },
      rules:[

      ]
    })

    const onSubmit = async () => {
      let {code,data,msg} = await updatePassword(state.form_data)
      if(!code)
      {
        state.form_data.old_password = ""
        state.form_data.password = ""
        state.form_data.repassword = ""

        ElMessage.success({
          message: '密码修改成功',
          type: 'success'
        })
      }
    }

    return {
      ...toRefs(state),
      onSubmit
    }
  },
}
</script>

<style scoped lang="scss">
#Password {
  background: #FFFFFF;

  .box{
    margin-bottom: 1rem;
    h4{
      margin: 0;
      padding: 0;
      height: 3rem;
      line-height: 3rem;
    }
  }
  .form_box{
    width: 400px;
  }
}
</style>
