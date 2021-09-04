<template>
  <div id="DownDialog">
    <el-dialog title="下载" v-model="dialogVisible" width="37.5rem" center @open="onDialogOpen"  @close="onDialogClose">
      <div class="box">
        <div class="chooice">
          <div v-for="(item,index) in down_list" :key="index"><el-radio :label="index" v-model="type">{{item.name}}</el-radio><p>{{item.desc}}</p></div>
        </div>
      </div>
      <template #title>
        <div class="dialog_title">下载</div>
      </template>
      <template #footer>
        <div class="dialog_footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="downClick">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {reactive, toRefs, watch,onMounted} from 'vue'
import { rootURL } from '@/utils'
import {ElMessage} from "element-plus";

export default {
  props: {
    visible: Boolean,
    down_list: Array,
  },
  emits: ["close","update"],
  setup(props, context) {
    const state = reactive({
      dialogVisible:false,
      type:-1,
    })

    watch(
        () => props.visible,
        (data, prevdata) => {
          state.dialogVisible = props.visible
        }
    )

    onMounted( () => {
      state.dialogVisible = props.visible
    })

    const downClick = () => {
      if(state.type == -1)
      {
        ElMessage.error("请选择下载试卷类型")
      }
      else
        window.open(props.down_list[state.type].url)
    }

    const onDialogOpen = ()=> {
      state.type = -1
    }

    const onDialogClose = () => {
      context.emit('close', state.dialogVisible);
    }

    return {
      ...toRefs(state),
      onDialogClose,
      onDialogOpen,
      downClick
    }
  },
}
</script>

<style scoped lang="scss">
#DownDialog {
  .box{
    .chooice{
      & > div{
        display: flex;
        margin-bottom: 2rem;
        padding-left: 1.5rem;
        .el-radio{
          margin-right: 0;
        }
        & > p{
          font-size: 0.875rem;
          color: #999999;
        }
      }
      & > div:last-child{
        margin-bottom: 0;
      }
    }
  }
  .dialog_title{
    text-align: left;
  }
  .dialog_footer{
    text-align: right;
  }
}
</style>
