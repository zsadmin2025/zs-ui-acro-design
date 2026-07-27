<template>
  <div class="dynamic-form-page">
    <!-- 顶部标题栏 -->
    <header class="form-header">
      <div class="header-inner">
        <span class="header-accent"></span>
        <h2 class="form-title">{{ pageTitle }}</h2>
      </div>
    </header>

    <!-- 表单主体 -->
    <main class="form-main">
      <div class="form-container">
        <div class="form-card">
          <a-spin :loading="formLoading" class="form-spin">
            <form-create
              v-model="formData"
              :rule="formRule"
              :option="formOption"
              locale="zh-CN"
              @submit="handleSubmit"
            />
          </a-spin>
        </div>
      </div>
    </main>

    <!-- 底部操作栏 -->
    <footer class="form-footer">
      <div class="footer-inner">
        <a-button size="large" class="cancel-btn" @click="goBack">
          <template #icon><icon-left /></template>
          取消
        </a-button>
        <a-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="submitting"
          @click="handleSubmit"
        >
          提交流程
        </a-button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { IconLeft } from '@arco-design/web-vue/es/icon';
  import { useStartProcessStore } from '@/store/modules/bpm/process/startProcessStore';
  import { bpmTaskMyProcessApi } from '@/api/bpm/task/my-process';

  const router = useRouter();
  const route = useRoute();
  const store = useStartProcessStore();

  // 从路由参数获取流程信息
  const processDefinitionId = computed(
    () => route.query.processDefinitionId as string,
  );
  const processKey = computed(() => route.query.key as string);

  // 表单数据
  const formData = ref<Record<string, any>>({});

  // 计算属性
  const formLoading = computed(() => store.formLoading);
  const submitting = computed(() => store.submitting);
  const formRule = computed(() => store.formRule);
  const formOption = computed(() => store.formOption);
  const pageTitle = computed(
    () => store.currentDefinition?.processName ?? '流程表单',
  );

  // 返回上一页
  function goBack() {
    router.back();
  }

  // 提交表单
  async function handleSubmit() {
    await bpmTaskMyProcessApi.startProcess({
      processDefinitionId: processDefinitionId.value,
      variables: formData.value,
    });
  }

  // 生命周期
  onMounted(async () => {
    if (processKey.value) {
      await store.loadDefinitions();
      const targetProcess = store.definitions.find(
        (def) => def.processKey === processKey.value,
      );
      if (targetProcess) {
        await store.selectProcess(targetProcess);
      } else {
        Message.error('未找到对应的流程定义');
        router.back();
      }
    }
  });

  onUnmounted(() => {
    store.resetState();
  });
</script>

<style lang="less" scoped>
  // ===================== 变量 =====================
  @color-primary: #165dff;
  @color-primary-hover: #4080ff;
  @color-text: #1a1a2e;
  @color-text-secondary: #6b7280;
  @color-bg: #f5f6f8;
  @color-card-bg: #ffffff;
  @color-border: #eef0f2;
  @color-border-light: #f2f3f5;
  @radius-lg: 12px;
  @radius-md: 8px;
  @shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  @shadow-footer: 0 -1px 3px rgba(0, 0, 0, 0.03);
  @transition-base: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  @max-form-width: 800px;

  // ===================== 页面容器 =====================
  .dynamic-form-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: @color-bg;
  }

  // ===================== 顶部标题栏 =====================
  .form-header {
    flex-shrink: 0;
    background: @color-card-bg;
  }

  .header-inner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 32px;
    border-bottom: 1px solid @color-border-light;
  }

  .header-accent {
    display: block;
    width: 4px;
    height: 22px;
    border-radius: 2px;
    background: @color-primary;
    flex-shrink: 0;
  }

  .form-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: @color-text;
    letter-spacing: 0.3px;
  }

  // ===================== 表单主体 =====================
  .form-main {
    flex: 1;
    overflow-y: auto;
  }

  .form-container {
    height: 100%;
  }

  .form-card {
    height: 100%;
    background: @color-card-bg;
    box-sizing: border-box;
    animation: cardFadeIn 0.35s ease;
  }

  .form-spin {
    width: 100%;
  }

  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // ===================== 底部操作栏 =====================
  .form-footer {
    flex-shrink: 0;
    background: @color-card-bg;
    box-shadow: @shadow-footer;
  }

  .footer-inner {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
  }

  .cancel-btn {
    min-width: 88px;
    border-radius: @radius-md;
    border-color: @color-border;
    color: @color-text-secondary;
    font-weight: 500;
    transition: all @transition-base;

    &:hover {
      color: @color-text;
      border-color: #d0d4da;
      background: #fafbfc;
    }
  }

  .submit-btn {
    min-width: 120px;
    border-radius: @radius-md;
    font-weight: 500;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 6px rgba(22, 93, 255, 0.25);
    transition: all @transition-base;

    &:hover {
      box-shadow: 0 4px 12px rgba(22, 93, 255, 0.35);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // ===================== form-create 深度样式 =====================
  :deep(.el-form) {
    .el-form-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .el-form-item__label {
        font-size: 14px;
        font-weight: 500;
        color: @color-text;
        padding-bottom: 8px;
        line-height: 1.5;
      }
    }

    // 输入框
    .el-input__wrapper,
    .el-textarea__inner {
      border-radius: @radius-md;
      border-color: @color-border;
      background: #fafbfc;
      box-shadow: none;
      transition: all @transition-base;

      &:hover {
        border-color: #d0d4da;
        background: #ffffff;
      }

      &:focus,
      &.is-focus {
        border-color: @color-primary;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.08);
      }
    }

    .el-input__wrapper {
      padding: 0 12px;
      min-height: 40px;
    }

    .el-textarea__inner {
      padding: 10px 12px;
      resize: vertical;
    }

    // 下拉选择器
    .el-select {
      width: 100%;

      .el-select__wrapper {
        border-radius: @radius-md;
        border-color: @color-border;
        background: #fafbfc;
        box-shadow: none;
        transition: all @transition-base;

        &:hover {
          border-color: #d0d4da;
          background: #ffffff;
        }

        &.is-focused {
          border-color: @color-primary;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.08);
        }
      }
    }

    // 日期 / 时间选择器
    .el-date-editor {
      --el-date-editor-width: 100%;
    }

    // 必填星号
    .el-form-item__label .el-form-item__label--required::before {
      color: #f53f3f;
    }

    // 帮助文字
    .el-form-item__error {
      font-size: 12px;
      padding-top: 4px;
    }

    // 单选框 / 复选框组
    .el-radio-group,
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      padding-top: 4px;
    }

    .el-radio,
    .el-checkbox {
      margin-right: 0;
      height: auto;
    }
  }
</style>
