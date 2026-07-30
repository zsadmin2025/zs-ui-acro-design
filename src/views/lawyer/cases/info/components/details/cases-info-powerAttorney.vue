<template>
  <div class="cases-info-powerAttorney">
    <div class="content-container" v-html="content"> </div>
    <a-modal
      v-model:visible="visible"
      width="50%"
      title-align="start"
      :draggable="true"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> 授权委托书</template>
      <div> <ZsEditor v-model="content" /></div>
    </a-modal>

    <!-- <div class="actions">
      <a-space>
        <a-button type="primary" status="warning"> 打印 </a-button>
        <a-button type="primary"> 编辑 </a-button>
      </a-space>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';
  import { ref, watch } from 'vue';

  const infoAddOrEditStore = useInfoAddOrEditStore();

  const props = defineProps<{
    caseInfo: any;
    type: string; // 用于区分详情和编辑
  }>();

  const content = ref('');

  // 监听 props.caseInfo 变化，并更新 content
  watch(
    () => props.caseInfo,
    (newCaseInfo) => {
      if (newCaseInfo) {
        content.value = newCaseInfo.powerAttorney ?? '';
      }
    },
    { deep: true, immediate: true },
  );
  const visible = ref(false);

  const emits = defineEmits(['refreshDetails']);

  const handleOk = () => {
    infoAddOrEditStore.savePowerAttorney(
      {
        caseInfoId: props.caseInfo.caseInfoId,
        powerAttorney: content.value,
      },
      emits,
    );
    visible.value = false;
  };
  const handleCancel = () => {
    visible.value = false;
  };

  const openEditor = () => {
    visible.value = true;
  };

  defineExpose({
    openEditor,
  });
</script>

<style lang="less" scoped>
  .cases-info-powerAttorney {
    display: flex;
    justify-content: center; /* 水平居中 */
    // align-items: center; /* 垂直居中 */
    min-height: 800px;
    height: 100%; /* 设置容器高度为视口高元*/
  }
  .cases-info-powerAttorney .content-container {
    max-width: 700px;
    width: 100%;
    text-align: left;
    padding: 20px;
    // border: 1px solid #ddd;
    // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
