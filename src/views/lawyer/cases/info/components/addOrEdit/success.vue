<template>
  <div class="container">
    <div class="wrapper">
      <a-result
        class="result"
        status="success"
        :title="$t('success.result.title')"
        :subtitle="$t('success.result.subTitle')"
      >
        <template #extra>
          <a-space class="operation-wrap" :size="16">
            <a-button key="back" type="primary" @click="close"> 关闭 </a-button>
            <a-button key="back" type="primary" @click="goBack">
              返回案件列表
            </a-button>
          </a-space>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';

  const infoAddOrEditStore = useInfoAddOrEditStore();

  const router = useRouter();
  const close = () => {
    infoAddOrEditStore.resultShow = false;
  };
  const goBack = () => {
    // 清空表单数据，关闭当前tabs
    router.push({ name: 'info' });
  };
</script>

<style scoped lang="less">
  .container {
    height: 100%;
  }
  .wrapper {
    padding: 24px 150px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
    height: 100%;
  }

  .result {
    margin: 150px 0 0 0;
  }

  .operation-wrap {
    margin-bottom: 40px;
    text-align: center;
  }
</style>

<style lang="less" scoped>
  .mobile {
    .wrapper {
      padding: 24px 10px;
      .steps-wrapper {
        transform: scale(0.8);
      }
    }
  }
</style>
