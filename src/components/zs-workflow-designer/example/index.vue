<template>
  <div class="workflow-designer-example">
    <div class="example-header">
      <h2>钉钉风格工作流设计器示例</h2>
      <p>仿钉钉审批流程设计器，支持拖拽、条件分支、并行分支等高级功能</p>
    </div>

    <div class="example-content">
      <WorkflowDesigner
        ref="designerRef"
        v-model="workflowData"
        workflow-name="请假审批流程"
        @change="handleChange"
        @save="handleSave"
      />
    </div>

    <div class="example-actions">
      <a-space>
        <a-button type="primary" @click="loadExample"> 加载示例流程 </a-button>
        <a-button @click="exportWorkflow"> 导出JSON </a-button>
        <a-button @click="importWorkflow"> 导入JSON </a-button>
        <a-button status="danger" @click="clearWorkflow"> 清空 </a-button>
      </a-space>
    </div>

    <!-- 导入弹窗 -->
    <a-modal
      v-model:visible="importModalVisible"
      title="导入流程"
      @ok="confirmImport"
      @cancel="importModalVisible = false"
    >
      <a-textarea
        v-model="importJson"
        placeholder="请粘贴流程JSON数据"
        :auto-size="{ minRows: 8, maxRows: 15 }"
      />
    </a-modal>

    <!-- 导出弹窗 -->
    <a-modal
      v-model:visible="exportModalVisible"
      title="导出流程"
      :footer="false"
    >
      <a-textarea
        v-model="exportJson"
        readonly
        :auto-size="{ minRows: 8, maxRows: 15 }"
      />
      <a-button
        type="primary"
        long
        style="margin-top: 16px"
        @click="copyExport"
      >
        复制到剪贴板
      </a-button>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import WorkflowDesigner from '../index.vue';
  import type { WorkflowDefinition } from '../types';

  const designerRef = ref<InstanceType<typeof WorkflowDesigner>>();
  const workflowData = ref<WorkflowDefinition>({
    id: 'wf_example',
    name: '请假审批流程',
    version: 1,
    nodes: [],
  });

  const importModalVisible = ref(false);
  const exportModalVisible = ref(false);
  const importJson = ref('');
  const exportJson = ref('');

  // 加载示例流程
  function loadExample() {
    workflowData.value = {
      id: 'wf_leave',
      name: '请假审批流程',
      version: 1,
      nodes: [
        {
          id: 'start_1',
          type: 'start',
          name: '发起人',
        },
        {
          id: 'approver_1',
          type: 'approver',
          name: '直属领导审批',
          approvers: {
            source: 'leader',
            values: [],
            level: 1,
          },
          mode: 'or',
          timeout: 24,
          autoPass: false,
        },
        {
          id: 'condition_1',
          type: 'condition',
          name: '请假天数判断',
          branches: [
            {
              id: 'branch_1',
              name: '3天以内',
              conditions: [{ field: 'days', operator: 'le', value: '3' }],
              nodes: [
                {
                  id: 'cc_1',
                  type: 'cc',
                  name: '抄送HR',
                  ccList: {
                    source: 'role',
                    values: ['hr_role'],
                  },
                },
              ],
            },
            {
              id: 'branch_2',
              name: '3天以上',
              conditions: [{ field: 'days', operator: 'gt', value: '3' }],
              nodes: [
                {
                  id: 'approver_2',
                  type: 'approver',
                  name: '部门总监审批',
                  approvers: {
                    source: 'leader',
                    values: [],
                    level: 2,
                  },
                  mode: 'or',
                },
              ],
            },
          ],
        },
        {
          id: 'end_1',
          type: 'end',
          name: '结束',
        },
      ],
    };
    Message.success('示例流程已加载');
  }

  // 导出流程
  function exportWorkflow() {
    const data = designerRef.value?.getWorkflowData();
    if (data) {
      exportJson.value = JSON.stringify(data, null, 2);
      exportModalVisible.value = true;
    }
  }

  // 复制导出内容
  function copyExport() {
    navigator.clipboard.writeText(exportJson.value).then(() => {
      Message.success('已复制到剪贴板');
    });
  }

  // 导入流程
  function importWorkflow() {
    importJson.value = '';
    importModalVisible.value = true;
  }

  // 确认导入
  function confirmImport() {
    try {
      const nodes = JSON.parse(importJson.value);
      if (Array.isArray(nodes)) {
        workflowData.value = {
          ...workflowData.value,
          nodes,
        };
        importModalVisible.value = false;
        Message.success('流程导入成功');
      } else {
        Message.error('无效的流程数据');
      }
    } catch {
      Message.error('JSON格式错误');
    }
  }

  // 清空流程
  function clearWorkflow() {
    workflowData.value = {
      ...workflowData.value,
      nodes: [],
    };
    Message.success('流程已清空');
  }

  // 流程变化
  function handleChange(nodes: any[]) {
    console.log('流程变化:', nodes);
  }

  // 保存流程
  function handleSave(data: WorkflowDefinition) {
    console.log('保存流程:', data);
    Message.success('流程保存成功');
  }
</script>

<style lang="less" scoped>
  .workflow-designer-example {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f6f7;

    .example-header {
      padding: 20px 24px;
      background: #fff;
      border-bottom: 1px solid #e5e6eb;

      h2 {
        margin: 0 0 8px;
        font-size: 20px;
        font-weight: 600;
        color: #1f2329;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #8f959e;
      }
    }

    .example-content {
      flex: 1;
      overflow: hidden;
      padding: 16px;

      :deep(.workflow-designer) {
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }
    }

    .example-actions {
      padding: 16px 24px;
      background: #fff;
      border-top: 1px solid #e5e6eb;
      display: flex;
      justify-content: center;
    }
  }
</style>
