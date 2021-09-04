<template>
  <div id="PerInfo">
    <div class="title">个人信息</div>
    <div class="avater"></div>
    <div class="name_box">
      <div class="placeholder"></div>
      <div class="name">李krice</div>
      <div class="tip">未绑定微信号</div>
    </div>
    <div class="form_box">
      <div class="form_item">
        <div class="lable_text">手机号</div>
        <div class="content">
          134******90
        </div>
      </div>
      <div class="form_item">
        <div class="lable_text">姓名</div>
        <div class="content">
          <el-input
            style="width:15.875rem;"
            v-model="state.name"
            placeholder="请输入内容"
          ></el-input>
        </div>
      </div>
      <div class="form_item">
        <div class="lable_text">性别</div>
        <el-radio-group class="content" v-model="state.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </div>
      <div class="form_item">
        <div class="lable_text">所在学校</div>
        <div class="content">
          <el-select v-model="state.schooled" placeholder="请选择学校">
            <el-option label="黄金糕学校" value="0"> </el-option>
          </el-select>
        </div>
      </div>
      <div class="form_item">
        <el-button class="saveBtn" type="primary" round>保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({
      name: '李krice',
      sex: 1,
      AreaSelected: [],
      schooled: '',
    })

    const Distselected = (data) => {
      console.log(data)
    }

    return {
      state,
      Distselected,
    }
  },
}
</script>

<style scoped lang="scss">
#PerInfo {
  padding: 1.875rem 3.75rem;
  width: 100%;
  min-height: calc(100vh - 5rem);
  background: #ffffff;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 0px 2px 2px 0px;

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
