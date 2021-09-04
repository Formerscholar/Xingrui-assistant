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
          <el-radio-group v-model="format" style="flex:1;">
            <el-radio label="doc" style="margin-bottom:.9375rem;"
            >DOC
              <span class="tip" style="display: none">doc格式文档，公式为图片，不可编辑公式</span>
            </el-radio>
            <el-radio label="docx"
            >DOCX <span class="tip" style="display: none">docx格式文档，可编辑公式</span>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="select_box">
          <div class="lable">纸张大小</div>
          <el-radio-group v-model="size" style="flex:1;">
            <el-radio
                label="A4"
                style="margin-bottom:.9375rem;margin-right:1.25rem;"
            >A4
            </el-radio
            >
            <el-radio
                label="A3"
                style="margin-bottom:.9375rem;margin-right:.9375rem;"
            >A3（双栏）
            </el-radio
            >
            <el-radio
                label="B3"
                style="margin-bottom:.9375rem;margin-right:.9375rem;"
            >B3（双栏）
            </el-radio
            >
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
import {reactive, toRefs, watch} from 'vue'
import {rootURL} from '@/utils'

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
      content: [],
      type: 1,

      visible: false,
    })
    const downClick = () => {
      window.open(
          `${rootURL}/ins/paper/download?paper_id=${props.downId}&paper_type=${state.size}&ext=${state.format}`
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

    return {
      ...toRefs(state),
      downClick,
      onDialogClose,
      onDialogOpen
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
