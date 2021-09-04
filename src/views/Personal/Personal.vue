<template>
  <div id="Personal">
    <div class="title">个人信息</div>
    <div class="avater"></div>
    <div class="name_box">
      <!-- <div class="placeholder"></div> -->
      <div class="name">{{user_data.name}}</div>
      <!-- <div class="tip">
        <template v-if="user_data.openid && user_data.unionid">已绑定微信</template>
        <template v-else>未绑定微信号</template>
      </div> -->
    </div>
    <div class="form_box">
      <el-form  label-width="140px">
        <el-form-item label="手机号">{{ user_data.account }}</el-form-item>
        <el-form-item label="姓名">
          <el-input
              v-model="user_data.name"
              placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="user_data.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在学校">
          <el-select
              v-model="user_data.school_id"
              placeholder="选择校区"
              clearable
              disabled
          >
            <el-option
                v-for="(item,index) in search_condition.school"
                :key="index"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="saveBtn" type="primary" round @click="saveUser">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs,onMounted} from 'vue'
import { useRouter,useRoute } from 'vue-router'
import {getUserInfo,saveUserInfo} from '@/network/user'
import {getSchoolList} from '@/network/block'
import { ElMessage } from 'element-plus'
import storage from "../../utils/storage";
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const state = reactive({
      user_data:{
        account:'',
        name:'',
        sex:'',
        school_id:'',
        openid:'',
        unionid:'',
      },

      search_condition:{
        school:[]
      }
    })

    onMounted( () => {
      loadUserInfo()
      loadCondition()
    })

    const loadUserInfo = async () => {
      let {code,data,msg} = await getUserInfo()
      if(!code)
      {
        state.user_data.account = data.account
        state.user_data.name = data.name
        state.user_data.sex = data.sex
        state.user_data.school_id = data.school_id
      }
    }

    const loadCondition = async () => {
      let {code,data,msg} = await  getSchoolList()

      if(!code)
        state.search_condition.school = data
    }

    const saveUser = async () => {
      let {code ,data ,msg} = await saveUserInfo(state.user_data)
      if(!code)
      {
        updateUserInfo()

        ElMessage.success({
          message: '用户数据保存成功',
          type: 'success'
        })
      }
    }

    const updateUserInfo = () => {
      let userInfo = store.state.userInfo
      userInfo.name = state.user_data.name

      store.commit("SetUserInfo",userInfo)
      storage.set("userInfo",JSON.stringify(userInfo))
    }

    return {
      ...toRefs(state),
      saveUser
    }
  },
}
</script>

<style scoped lang="scss">
#Personal {
  background: #FFFFFF;

  .title {
    font-size: 1rem;
    font-weight: 400;
    color: #222222;
  }
  .avater {
    background: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/default_ava.png')
    no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 3.75rem;
    border-radius: 50%;
    width: 9.375rem;
    height: 9.375rem;
    overflow: hidden;

    &:hover::after {
      content: '修改头像';
      background-color: rgba($color: #000000, $alpha: 0.618);
      border-radius: 50%;
      width: 100%;
      height: 100%;
      font-size: 1rem;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .name_box {
    margin-top: 1.875rem;
    margin-bottom: 1.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .placeholder,
    .tip {
      flex: 1;
      text-align: left;
    }
    .name {
      font-size: 1rem;
      font-weight: 400;
      color: #6d7783;
      margin: 0 1.25rem;
    }
    .tip {
      font-size: 1rem;
      font-weight: 400;
      color: #11d43f;
    }
  }
  .form_box {
    margin-top: 1.875rem;
    width: 30rem;
    margin: 0 auto;
    .form_item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3.125rem;
      margin-bottom: 1rem;
      &:last-child {
        margin-bottom: 0;
      }
      .lable_text {
        width: 4.0625rem;
        text-align: right;
        margin-right: 3.75rem;
        font-size: 1rem;
        font-weight: 400;
        color: #6d7783;
      }
      .content {
        flex: 1;
        font-size: 1rem;
        font-weight: 400;
        color: #222222;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tip {
          margin-left: 1.875rem;
          font-size: 1rem;
          font-weight: 400;
          color: #e54303;
        }
      }
      .saveBtn {
        margin-top: 5.625rem;
        width: 8.3125rem;
        height: 3.125rem;
        background: #485cc8;
        border-radius: 1.5625rem;
        font-size: 1rem;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
}
</style>
