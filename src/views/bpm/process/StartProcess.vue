<template>
  <div class="start-process">
    <template v-if="!store.currentDefinition">
      <!-- 流程列表页面 -->
      <div class="category-sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">流程分类</h3>
        </div>
        <div class="category-list">
          <div
            v-for="category in categories"
            :key="category.id"
            :class="['category-item', { active: activeTab === category.id }]"
            @click="activeTab = category.id"
          >
            <span class="item-name">{{ category.name }}</span>
            <span
              :class="[
                'item-count',
                { highlight: getDefinitionsByCategory(category.id).length > 0 },
              ]"
              >{{ getDefinitionsByCategory(category.id).length }}</span
            >
          </div>
        </div>
      </div>

      <div class="process-main">
        <a-spin :loading="loading" style="width: 100%">
          <div class="main-header">
            <h2 class="current-category">{{ currentCategoryName }}</h2>
            <span class="process-count"
              >{{ currentDefinitions.length }} 个流程</span
            >
          </div>

          <div class="process-content">
            <div class="process-grid">
              <div
                v-for="item in currentDefinitions"
                :key="item.id"
                class="process-card"
                @click="handleSelectProcess(item)"
              >
                <div class="card-icon">
                  <zs-icon :icon="item.icon || 'icon-experiment'" :size="28" />
                </div>
                <div class="card-info">
                  <div class="card-title">{{ item.processName }}</div>
                  <div class="card-desc">
                    {{ item.description || '暂无描述' }}
                  </div>
                </div>
                <div class="card-action">
                  <icon-right />
                </div>
              </div>
            </div>

            <a-empty
              v-if="!loading && currentDefinitions.length === 0"
              description="暂无可用流程"
            />
          </div>
        </a-spin>
      </div>
    </template>

    <template v-else>
      <!-- 发起流程页面 -->
      <div class="process-form-page">
        <header class="form-header">
          <div class="header-inner">
            <span class="header-accent"></span>
            <h2 class="form-title">{{
              store.currentDefinition.processName
            }}</h2>
            <a-button size="large" class="back-btn" @click="handleBack">
              <template #icon><icon-left /></template>
              返回
            </a-button>
          </div>
        </header>

        <main class="form-main">
          <div class="form-container">
            <div class="form-card">
              <a-spin :loading="formLoading" class="form-spin">
                <a-tabs v-model:active-key="store.activeTab" class="form-tabs">
                  <a-tab-pane key="form" title="表单项">
                    <form-create
                      v-model="formData"
                      :rule="formRule"
                      :option="formOption"
                      @submit="handleSubmit"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="diagram" title="流程图">
                    <div class="diagram-container">
                      <zs-workflow-viewer
                        v-if="store.modelJson"
                        :model-json="store.modelJson"
                        :workflow-name="store.currentDefinition.processName"
                      />
                      <div v-else class="empty-diagram">
                        <a-empty description="暂无流程图数据" />
                      </div>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </a-spin>
            </div>
          </div>
        </main>

        <footer class="form-footer">
          <div class="footer-inner">
            <a-button size="large" class="cancel-btn" @click="handleBack">
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
              发起
            </a-button>
          </div>
        </footer>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { IconRight, IconLeft } from '@arco-design/web-vue/es/icon';
  import { useStartProcessStore } from '@/store/modules/bpm/process/startProcessStore';
  import type { ProcessDefinition } from '@/types/bpm/bpmTypes';
  import ZsWorkflowViewer from '@/components/zs-workflow-viewer/index.vue';
  import { bpmTaskMyProcessApi } from '@/api/bpm/task/my-process';

  const store = useStartProcessStore();

  const activeTab = ref('');

  const formData = ref<Record<string, any>>({});

  const loading = computed(() => store.loading);
  const categories = computed(() => store.categories);
  const formLoading = computed(() => store.formLoading);
  const submitting = computed(() => store.submitting);
  const formRule = computed(() => store.formRule);
  const formOption = computed(() => store.formOption);

  const currentDefinitions = computed(() => {
    return store.definitions.filter(
      (def) => def.categoryId === activeTab.value,
    );
  });

  const currentCategoryName = computed(() => {
    const category = categories.value.find((c) => c.id === activeTab.value);
    return category?.name || '';
  });

  watch(
    () => store.categories,
    (newCategories) => {
      if (newCategories.length > 0 && !activeTab.value) {
        activeTab.value = newCategories[0].id;
      }
    },
    { immediate: true },
  );

  function getDefinitionsByCategory(categoryId: string): ProcessDefinition[] {
    return store.definitions.filter((def) => def.categoryId === categoryId);
  }

  async function handleSelectProcess(item: ProcessDefinition) {
    if (item.formType === 1 || item.formType === 2) {
      await store.selectProcess(item);
      formData.value = {};
    } else {
      Message.warning('该流程未配置表单');
    }
  }

  function handleBack() {
    store.currentDefinition = null;
    store.resetState();
    formData.value = {};
    activeTab.value = '';
    store.loadDefinitions();
    store.loadCategories();
  }

  async function handleSubmit() {
    await bpmTaskMyProcessApi.startProcess({
      processDefinitionId: store.currentDefinition?.processDefinitionId,
      variables: formData.value,
    });
    Message.success('流程发起成功');
    handleBack();
  }

  onMounted(() => {
    store.loadDefinitions();
    store.loadCategories();
  });

  onUnmounted(() => {
    store.resetState();
  });
</script>

<style lang="less" scoped>
  .start-process {
    display: flex;
    height: 100%;
    gap: var(--base-padding);
  }

  .category-sidebar {
    width: 220px;
    flex-shrink: 0;
    background: var(--color-bg-2);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .sidebar-header {
      padding: 16px 20px;
      border-bottom: 1px solid #f0f1f4;

      .sidebar-title {
        font-size: 15px;
        font-weight: 600;
        color: #1d2129;
        margin: 0;
      }
    }

    .category-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;

      .category-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 2px;

        .item-name {
          font-size: 13px;
          font-weight: 500;
          color: #4e5969;
          transition: color 0.2s ease;
        }

        .item-count {
          font-size: 12px;
          color: #c9cdd4;
          background: #f2f3f5;
          padding: 2px 8px;
          border-radius: 10px;
          min-width: 24px;
          text-align: center;
          transition: all 0.2s ease;

          &.highlight {
            color: #165dff;
            background: #e8f3ff;
            font-weight: 600;
          }
        }

        &:hover {
          background: #f7f8fa;
        }

        &.active {
          background: #e8f3ff;

          .item-name {
            color: #165dff;
            font-weight: 600;
          }

          .item-count {
            color: #165dff;
            background: #d6e8ff;
          }
        }
      }
    }
  }

  .process-main {
    flex: 1;
    min-width: 0;
    background: var(--color-bg-2);
    border-radius: var(--border-radius);
    padding: var(--base-padding);
    overflow-y: auto;

    .main-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 20px;

      .current-category {
        font-size: 18px;
        font-weight: 600;
        color: #1d2129;
        margin: 0;
      }

      .process-count {
        font-size: 13px;
        color: #86909c;
      }
    }
  }

  .process-content {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .process-card {
    display: flex;
    align-items: center;
    padding: 16px 18px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #f0f1f4;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: #e5e6eb;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);

      .card-icon {
        background: #165dff;
        color: #ffffff;
        transform: scale(1.05);
      }

      .card-action {
        opacity: 1;
        transform: translateX(0);
        color: #165dff;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .card-icon {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7f8fa;
      border-radius: 10px;
      color: #4e5969;
      margin-right: 14px;
      transition: all 0.25s ease;
    }

    .card-info {
      flex: 1;
      min-width: 0;

      .card-title {
        font-size: 14px;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.5;
      }

      .card-desc {
        font-size: 12px;
        color: #a0a4aa;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.5;
      }
    }

    .card-action {
      flex-shrink: 0;
      margin-left: 10px;
      color: #c9cdd4;
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.25s ease;
      font-size: 14px;
    }
  }

  :deep(.arco-empty) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;

    .arco-empty-description {
      color: #c9cdd4;
      font-size: 14px;
    }
  }

  /* ===================== 发起流程页面样式 ===================== */
  .process-form-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #f5f6f8;
  }

  .form-header {
    flex-shrink: 0;
    background: #ffffff;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 32px;
    border-bottom: 1px solid #f2f3f5;
  }

  .header-accent {
    display: block;
    width: 4px;
    height: 22px;
    border-radius: 2px;
    background: #165dff;
    flex-shrink: 0;
  }

  .form-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a2e;
    letter-spacing: 0.3px;
    flex: 1;
  }

  .back-btn {
    min-width: 88px;
    border-radius: 8px;
    border-color: #eef0f2;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      color: #1a1a2e;
      border-color: #d0d4da;
      background: #fafbfc;
    }
  }

  .form-main {
    flex: 1;
    overflow-y: auto;
  }

  .form-container {
    height: 100%;
  }

  .form-card {
    height: 100%;
    background: #ffffff;
    box-sizing: border-box;
    animation: cardFadeIn 0.35s ease;
  }

  .form-spin {
    width: 100%;
    height: 100%;
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

  .form-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.arco-tabs) {
    height: 100%;

    .arco-tabs-header {
      flex-shrink: 0;
    }

    .arco-tabs-content {
      flex: 1;
      overflow: auto;
      padding: 24px;
    }
  }

  .diagram-container {
    height: calc(100vh - 280px);
    min-height: 400px;
  }

  .empty-diagram {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-footer {
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.03);
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
    border-radius: 8px;
    border-color: #eef0f2;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      color: #1a1a2e;
      border-color: #d0d4da;
      background: #fafbfc;
    }
  }

  .submit-btn {
    min-width: 120px;
    border-radius: 8px;
    font-weight: 500;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 6px rgba(22, 93, 255, 0.25);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      box-shadow: 0 4px 12px rgba(22, 93, 255, 0.35);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  :deep(.el-form) {
    .el-form-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .el-form-item__label {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a2e;
        padding-bottom: 8px;
        line-height: 1.5;
      }
    }

    .el-input__wrapper,
    .el-textarea__inner {
      border-radius: 8px;
      border-color: #eef0f2;
      background: #fafbfc;
      box-shadow: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: #d0d4da;
        background: #ffffff;
      }

      &:focus,
      &.is-focus {
        border-color: #165dff;
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

    .el-select {
      width: 100%;

      .el-select__wrapper {
        border-radius: 8px;
        border-color: #eef0f2;
        background: #fafbfc;
        box-shadow: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          border-color: #d0d4da;
          background: #ffffff;
        }

        &.is-focused {
          border-color: #165dff;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.08);
        }
      }
    }

    .el-date-editor {
      --el-date-editor-width: 100%;
    }

    .el-form-item__label .el-form-item__label--required::before {
      color: #f53f3f;
    }

    .el-form-item__error {
      font-size: 12px;
      padding-top: 4px;
    }

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
