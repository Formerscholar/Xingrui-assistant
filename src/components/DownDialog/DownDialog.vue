<template>
  <div id="DownDialog">
    <el-dialog title="下载" v-model="visible" width="40.625rem" center @open="onDialogOpen" @close="onDialogClose">
      <template #title>
        <div class="dialog_title">下载</div>
      </template>
      <div class="downDiv">
        <div class="title">{{ downTitle }}</div>
        <div class="select_box">
          <div class="lable">纸张布局</div>
          <ul class="list">
            <li v-for="(item,index) in size_list" :key="index" @click="onSizeChange(item)">
              <img :src="item.value == size ? item.act_img.default : item.img.default">
              <span>{{item.label}}</span>
            </li>
          </ul>
        </div>
        <div class="select_box">
          <div class="lable">试卷内容</div>
          <el-checkbox-group v-model="content">
            <el-checkbox label="1">答案</el-checkbox>
            <el-checkbox label="2">解析</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="select_box">
          <div class="lable">试卷下载</div>
          <el-radio-group v-model="type" class="radio_list">
              <el-radio label="1">教师用卷<span class="tip">(题干后附答案)</span></el-radio>

              <el-radio label="2">普通用卷<span class="tip">(卷后统一附答案)</span></el-radio>

              <el-radio label="3">学生用卷<span class="tip">(无答案)</span></el-radio>

          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <div class="dialog_footer">
          <el-button type="primary" @click="downClick">确 定</el-button>
          <el-button @click="isDown = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {reactive, toRefs, watch,onMounted} from 'vue'
import {rootURL} from '@/utils'
import  qs from 'qs'

export default {
  props: {
    isDown: Boolean,
    downTitle: String,
    downId: String,
  },
  emits: ["close"],
  setup(props, context) {
    watch(
        () => props.isDown,
        (data, prevdata) => {
          state.visible = props.isDown
        }
    )

    const state = reactive({
      format: 'doc',
      size: 'A4',
      content: ["1"],
      type: "1",

      size_list:[
        {
          label:"A4",
          value:"A4",
          img:require("@/assets/img/paper/A4.png"),
          act_img:require("@/assets/img/paper/A4_2.png")
        },
        {
          label:"B4 (双栏)",
          value:"B4",
          img:require("@/assets/img/paper/B4.png"),
          act_img:require("@/assets/img/paper/B4_2.png")
        },
        {
          label:"A3 (双栏)",
          value:"A3",
          img:require("@/assets/img/paper/A3.png"),
          act_img:require("@/assets/img/paper/A3_2.png")
        }
      ],

      visible: false,
    })

    onMounted(() => {

    })

    const downClick = () => {
      let query = qs.stringify({
        paper_id:props.downId,
        ext:state.format,
        paper_type:state.size,
        content:state.content,
        down_type:state.type
      });

      window.open(
          `${rootURL}/ins/paper/download?${query}`
      )
      state.visible = false
    }

    const onDialogOpen = () => {
      state.format = 'doc'
      state.size = 'A4'
    }

    const onDialogClose = () => {
      state.visible = false
      context.emit("close")
    }

    const onSizeChange = (item) => {
      state.size = item.value
    }

    return {
      ...toRefs(state),
      downClick,
      onDialogClose,
      onDialogOpen,
      onSizeChange
    }
  },
}
</script>

<style scoped lang="scss">
#DownDialog {
  .dialog_title {
    text-align: left;
  }

  .dialog_footer {
    text-align: right;
  }

  .downDiv {
    width: 100%;

    .title {
      width: 100%;
      text-align: center;
      color: #222222;
      font-weight: bold;
    }

    .select_box {
      margin-top: 30px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding-left: 3.125rem;

      .lable {
        font-size: 1rem;
        font-weight: 400;
        color: #222222;
        width: 6.25rem;
        margin-right: 1.25rem;
      }
      .list{
        display: flex;
        flex-direction: row;
        li{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-left: 1.875rem;
          cursor: pointer;
          img{
            margin-bottom: 10px;
          }
        }
        li:first-child{
          margin-left: 0;
        }
      }
      .radio_list{
        display: flex;
        flex-direction: column;
        .el-radio{
          margin-bottom: .875rem;
        }
        .el-radio:last-child{
          margin-bottom: 0;
        }
      }

      .tip {
        margin-left: 1rem;
        font-size: 0.875rem;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
</style>
