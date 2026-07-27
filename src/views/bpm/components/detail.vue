<template>
  <div class="detail-page-wrapper">
    <zs-container layout="header-main-footer" class="todo-detail-container">
      <!-- 头部：信息卡片 -->
      <template #header>
        <div class="info-card">
          <div class="info-card__title-row">
            <h1 class="info-card__title">
              {{ detail?.processDefinitionName || '工作汇报' }}
            </h1>
            <span
              :class="[
                'status-tag',
                `status-tag--${getStatusColor(
                  detail?.processInstance?.status,
                )}`,
              ]"
            >
              {{ getStatusLabel(detail?.processInstance?.status) }}
            </span>
          </div>
          <div class="info-card__meta">
            <div class="meta-item">
              <span class="meta-item__label">单据编号</span>
              <span
                class="meta-item__value"
                :title="detail?.businessKey ?? undefined"
                >{{ detail?.businessKey || '-' }}</span
              >
            </div>
            <div class="meta-item">
              <span class="meta-item__label">申请人</span>
              <span class="meta-item__value">{{
                detail?.processInstance?.startUserName ||
                detail?.startUser?.startUserName ||
                '-'
              }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-item__label">申请日期</span>
              <span class="meta-item__value">{{
                detail?.processInstance?.startTime || detail?.startTime || '-'
              }}</span>
            </div>
            <!-- <div class="meta-item">
            <span class="meta-item__label">所属单位</span>
            <span
              class="meta-item__value"
              :title="detail?.startUser?.companyName ?? undefined"
              >{{ detail?.startUser?.companyName || '-' }}</span
            >
          </div> -->
            <div class="meta-item">
              <span class="meta-item__label">所属部门</span>
              <span
                class="meta-item__value"
                :title="detail?.startUser?.deptName ?? undefined"
                >{{ detail?.startUser?.deptName || '-' }}</span
              >
            </div>
          </div>
        </div>
      </template>

      <!-- 主体：标签页 -->
      <template #main-body>
        <a-spin :loading="loading" class="spin-wrap">
          <template v-if="!loading">
            <a-tabs v-model:active-key="activeTab" class="detail-tabs">
              <a-tab-pane key="form" title="单据信息">
                <div class="print-section-title">单据信息</div>
                <!-- 动态表单 (formCreate) -->
                <template
                  v-if="detail?.formType === 'DYNAMIC' && formRule.length"
                >
                  <div class="form-create-wrap">
                    <form-create
                      v-model="formData"
                      :rule="formRule"
                      :option="formCreateOption"
                    />
                  </div>
                </template>
                <!-- 业务表单 -->
                <template
                  v-else-if="
                    detail?.formType === 'BUSINESS' && detail.businessFormPath
                  "
                >
                  <div class="section-label">业务表单</div>
                  <component
                    :is="businessComponent"
                    v-if="businessComponent"
                    v-model="formData"
                  />
                  <a-empty v-else description="业务表单加载中..." />
                </template>
                <!-- 普通表单数据 -->
                <template v-else-if="Object.keys(formData).length > 0">
                  <div class="section-label">表单数据</div>
                  <a-descriptions
                    :column="{ xs: 1, sm: 2, md: 3 }"
                    bordered
                    size="small"
                  >
                    <a-descriptions-item
                      v-for="(value, key) in formData"
                      :key="key"
                      :label="key"
                    >
                      {{ formatValue(value) }}
                    </a-descriptions-item>
                  </a-descriptions>
                </template>
                <a-empty v-else description="暂无表单数据" />
              </a-tab-pane>

              <a-tab-pane key="approval" title="审批信息">
                <div class="print-section-title">审批流程信息</div>
                <ApprovalTrace :traces="approvalTraces" />
              </a-tab-pane>

              <a-tab-pane key="diagram" title="流程图">
                <div class="diagram-box">
                  <zs-workflow-viewer
                    v-if="modelJson"
                    :model-json="modelJson"
                  />
                  <a-empty v-else description="暂无流程图数据" />
                </div>
              </a-tab-pane>
            </a-tabs>
          </template>
        </a-spin>
      </template>

      <!-- 底部：操作按钮 -->
      <template #footer>
        <ApprovalActionPanel
          :task-id="taskId"
          :process-instance-id="processInstanceId"
          :process-status="processStatus"
          :button-permissions="buttonPermissions"
          :returnable-nodes="returnableNodes"
          :form-data="formData"
          @success="handleActionSuccess"
          @print="handlePrint"
        />
      </template>
    </zs-container>

    <div id="approval-print-content" ref="printRef" class="print-content">
      <div class="print-header">
        <h1 class="print-title">{{
          detail?.processDefinitionName || '工作汇报'
        }}</h1>
        <div class="print-meta">
          <span class="print-meta-item">
            <span class="print-meta-label">单据编号：</span>
            <span class="print-meta-value">{{
              detail?.businessKey || '-'
            }}</span>
          </span>
          <span class="print-meta-item">
            <span class="print-meta-label">打印时间：</span>
            <span class="print-meta-value">{{ currentTime }}</span>
          </span>
          <span class="print-meta-item">
            <span class="print-meta-label">打印人员：</span>
            <span class="print-meta-value">{{ printUserName }}</span>
          </span>
        </div>
      </div>

      <div class="print-section">
        <div class="print-section-title">表单信息</div>
        <table class="print-table">
          <tbody>
            <tr>
              <td class="print-table-label">申请人</td>
              <td class="print-table-value">{{
                detail?.processInstance?.startUserName ||
                detail?.startUser?.startUserName ||
                '-'
              }}</td>
              <td class="print-table-label">申请日期</td>
              <td class="print-table-value">{{
                detail?.processInstance?.startTime || detail?.startTime || '-'
              }}</td>
            </tr>
            <tr>
              <td class="print-table-label">所属单位</td>
              <td class="print-table-value">{{
                detail?.startUser?.companyName || '-'
              }}</td>
              <td class="print-table-label">所属部门</td>
              <td class="print-table-value">{{
                detail?.startUser?.deptName || '-'
              }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="print-section">
        <div class="print-section-title">表单内容</div>
        <table class="print-table">
          <tbody>
            <template v-if="formData && Object.keys(formData).length > 0">
              <tr v-for="(value, key) in formData" :key="key">
                <td class="print-table-label">{{ getFieldLabel(key) }}</td>
                <td class="print-table-value print-table-full">{{
                  formatValue(value)
                }}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="2" class="print-table-empty">暂无表单数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="print-section">
        <div class="print-section-title">流程记录</div>
        <table class="print-table print-table-bordered">
          <thead>
            <tr>
              <th class="print-th">审批人</th>
              <th class="print-th">审批角色</th>
              <th class="print-th">审批时间</th>
              <th class="print-th">审批结果</th>
              <th class="print-th">审批意见</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="approvalTraces && approvalTraces.length > 0">
              <template v-for="trace in approvalTraces" :key="trace.id">
                <tr v-for="(approver, idx) in trace.approvers" :key="idx">
                  <td class="print-td">{{ approver.assigneeName || '-' }}</td>
                  <td class="print-td">{{ trace.taskName || '-' }}</td>
                  <td class="print-td">{{
                    approver.endTime || approver.startTime || '-'
                  }}</td>
                  <td class="print-td">{{ getTraceLabel(approver.result) }}</td>
                  <td class="print-td">{{ approver.comment || '-' }}</td>
                </tr>
              </template>
            </template>
            <tr v-else>
              <td colspan="5" class="print-table-empty">暂无审批记录</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, shallowRef, onMounted, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { bpmTaskTodoApi } from '@/api/bpm/task/todo';
  import { useUserStore } from '@/store';
  import type {
    TaskDetail,
    ApprovalTraceItem,
    ApprovalTraceApprover,
  } from '@/types/bpm/bpmTypes';
  import ApprovalTrace from '@/views/bpm/components/ApprovalTrace.vue';
  import ApprovalActionPanel from '@/views/bpm/components/ApprovalActionPanel.vue';
  import ZsWorkflowViewer from '@/components/zs-workflow-viewer/index.vue';
  import dayjs from 'dayjs';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  const loading = ref(false);
  const detail = ref<TaskDetail | null>(null);
  const printRef = ref<HTMLElement | null>(null);

  const routeTaskId = computed(() => (route.query.taskId as string) || '');
  const routeProcessInstanceId = computed(
    () => (route.query.processInstanceId as string) || '',
  );
  const taskId = computed(
    () => detail.value?.todoTask?.taskId || routeTaskId.value,
  );
  const processInstanceId = computed(
    () => detail.value?.processInstanceId || routeProcessInstanceId.value,
  );
  const formData = ref<Record<string, any>>({});
  const formRule = ref<any[]>([]);
  const formCreateOption = ref<Record<string, any>>({});
  const formInfo = ref<Record<string, any> | null>(null);
  const approvalTraces = ref<ApprovalTraceItem[]>([]);
  const buttonPermissions = ref<any[]>([]);
  const returnableNodes = ref<{ nodeKey: string; nodeName: string }[]>([]);
  const modelJson = ref<string>('');
  const businessComponent = shallowRef<any>(null);

  const activeTab = ref('form');

  /** 是否有当前待办任务（决定表单是否可编辑） */
  const isEditable = ref(false);
  /** 流程实例状态（COMPLETED / RUNNING / REJECTED / TERMINATED） */
  const processStatus = computed(
    () => detail.value?.processInstance?.status || '',
  );

  // 加载业务组件
  const loadBusinessComponent = async (path: string) => {
    try {
      const modules = import.meta.glob('/src/views/**/*.vue');
      const normalizedPath = path.startsWith('/') ? path : `/src/views/${path}`;
      const matchedKey = Object.keys(modules).find((key) =>
        key.endsWith(normalizedPath.replace(/^\/src\/views/, '')),
      );
      if (matchedKey && modules[matchedKey]) {
        const comp = await modules[matchedKey]();
        businessComponent.value = (comp as any)?.default ?? comp;
      }
    } catch {
      businessComponent.value = null;
    }
  };

  const hasLoaded = ref(false);

  // 加载详情
  const loadDetail = async () => {
    const currentTaskId = routeTaskId.value;
    const currentProcessInstanceId = routeProcessInstanceId.value;
    if (!currentTaskId && !currentProcessInstanceId) {
      if (hasLoaded.value) {
        Message.error('缺少任务参数');
        router.back();
      }
      return;
    }
    loading.value = true;
    try {
      const { data } = await bpmTaskTodoApi.getTaskDetail(
        currentTaskId,
        currentProcessInstanceId,
      );
      const payload: Record<string, any> = data?.data ?? data;

      const instanceInfo = payload.instanceInfo || {};
      const rawFormInfo = payload.formInfo || {};
      const flowNodes: any[] = payload.flowNodes || [];
      const todoTaskData = payload.todoTask || {};
      const processDefinition = payload.processDefinition || {};

      formInfo.value = rawFormInfo;

      // 判断是否有活跃待办任务
      isEditable.value = !!todoTaskData.taskId;

      const mapped: TaskDetail = {
        processInstanceId:
          instanceInfo.processInstanceId || processInstanceId.value,
        processDefinitionId: instanceInfo.processDefinitionId,
        processDefinitionKey: instanceInfo.processDefinitionKey,
        processDefinitionName: instanceInfo.processDefinitionName,
        processInstanceName: instanceInfo.processInstanceName,
        businessKey: instanceInfo.businessKey,
        startUser: instanceInfo.startUser,
        startTime: instanceInfo.startTime,
        endTime: instanceInfo.endTime,
        processState: instanceInfo.processState,
        todoTask: todoTaskData,
        processInstance: {
          processInstanceId:
            instanceInfo.processInstanceId || processInstanceId.value,
          processDefinitionKey: instanceInfo.processDefinitionKey,
          processDefinitionName: instanceInfo.processDefinitionName,
          startUserId: instanceInfo.startUser?.startUserId,
          startUserName: instanceInfo.startUser?.startUserName,
          startTime: instanceInfo.startTime,
          endTime: instanceInfo.endTime,
          status: instanceInfo.processState,
          businessKey: instanceInfo.businessKey,
        },
      };

      // 表单信息处理
      if (rawFormInfo.formRule) {
        mapped.formType = rawFormInfo.formType === '1' ? 'DYNAMIC' : 'BUSINESS';

        let rules: any[] = [];
        try {
          rules =
            typeof rawFormInfo.formRule === 'string'
              ? JSON.parse(rawFormInfo.formRule)
              : rawFormInfo.formRule;
        } catch {
          /* ignore */
        }

        let options: Record<string, any> = { form: { labelWidth: 125 } };
        try {
          if (rawFormInfo.formOption) {
            options =
              typeof rawFormInfo.formOption === 'string'
                ? JSON.parse(rawFormInfo.formOption)
                : rawFormInfo.formOption;
          }
        } catch {
          /* ignore */
        }

        // 字段权限：READONLY(1/3) → disabled, HIDDEN(4) → 移除
        const permissions =
          todoTaskData.permissionConfig?.fieldPermissions || [];
        const permMap: Record<string, string> = {};
        permissions.forEach((p: any) => {
          permMap[p.field] = p.permission;
        });

        formRule.value = rules
          .filter((rule: any) => permMap[rule.field] !== '4')
          .map((rule: any) => {
            if (permMap[rule.field] === '1' || permMap[rule.field] === '3') {
              return {
                ...rule,
                props: { ...(rule.props || {}), disabled: true },
              };
            }
            return rule;
          });

        // 无活跃待办任务时，全局禁用表单
        if (!isEditable.value) {
          options.disabled = true;
        }

        formCreateOption.value = options;
        mapped.formSchema = { fields: rules };
        const PERM_LABEL: Record<string, string> = {
          '1': 'READONLY',
          '2': 'EDITABLE',
          '3': 'READONLY',
          '4': 'HIDDEN',
        };
        mapped.fieldPermissions = permissions.map((p: any) => ({
          field: p.field,
          title: p.title,
          permission: PERM_LABEL[p.permission] || 'EDITABLE',
        }));
      }

      if (rawFormInfo.formData) {
        mapped.formData = rawFormInfo.formData;
        formData.value = { ...rawFormInfo.formData };
      }

      detail.value = mapped;

      // flowNodes → ApprovalTraceItem
      // 节点状态与审批结果映射（节点状态：COMPLETED / IN_PROGRESS / NOT_STARTED）
      const mapNodeResult = (status?: string): string => {
        if (status === 'COMPLETED') return 'PASS';
        return 'PENDING'; // IN_PROGRESS / NOT_STARTED 均视为进行中
      };

      // 单个审批人的审批结果（仅取决于该审批人自身状态）
      const mapApproverResult = (status?: string): string => {
        if (status === 'COMPLETED') return 'PASS';
        if (status === 'REJECTED') return 'REJECT';
        return 'PENDING'; // 未操作或进行中
      };

      approvalTraces.value = flowNodes.map((node: any) => {
        // 构建审批人列表（每个审批人独立状态）
        const approvers: ApprovalTraceApprover[] =
          node.approvers?.map((approver: any) => {
            const approverUser = approver?.assigneeUser;
            return {
              taskId: approver?.taskId,
              assigneeName: approverUser?.startUserName,
              result: mapApproverResult(approver?.status),
              comment: approver?.comment,
              startTime: approver?.startTime,
              endTime: approver?.endTime,
              duration: approver?.durationInMillis
                ? Number(approver?.durationInMillis)
                : undefined,
            };
          }) || [];

        // 如果节点有审批人但无时间信息，回退到节点级时间
        const firstApprover = approvers[0];
        const effectiveStartTime = firstApprover?.startTime || node.startTime;
        const effectiveEndTime = firstApprover?.endTime || node.endTime;

        // 节点级耗时：优先用节点自身的 durationInMillis
        const nodeDuration = node.durationInMillis
          ? Number(node.durationInMillis)
          : undefined;

        // 节点级审批意见：取第一个有意见的审批人
        const firstComment =
          approvers.find((a: ApprovalTraceApprover) => a.comment)?.comment ||
          undefined;

        return {
          id: node.nodeKey,
          taskId: firstApprover?.taskId || node.taskId,
          taskName: node.nodeName,
          assigneeName: approvers[0]?.assigneeName,
          result: mapNodeResult(node.status),
          comment: firstComment,
          startTime: effectiveStartTime,
          endTime: effectiveEndTime,
          duration: nodeDuration,
          approvers,
        };
      });

      buttonPermissions.value =
        todoTaskData.permissionConfig?.buttonPermissions || [];

      returnableNodes.value = flowNodes
        .filter(
          (node: any) =>
            node.status === 'COMPLETED' && node.nodeKey !== 'start_1',
        )
        .map((node: any) => ({
          nodeKey: node.nodeKey,
          nodeName: node.nodeName,
        }));

      modelJson.value =
        payload.modelJson ||
        instanceInfo.modelJson ||
        processDefinition.modelJson ||
        '';

      if (mapped.formType === 'BUSINESS' && rawFormInfo.businessFormPath) {
        loadBusinessComponent(rawFormInfo.businessFormPath);
      }
      hasLoaded.value = true;
    } catch (error: any) {
      Message.error(error?.message || '加载详情失败');
    } finally {
      loading.value = false;
    }
  };

  const getStatusColor = (status?: string): 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'running':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status?: string): string => {
    const map: Record<string, string> = {
      running: '审批中',
      completed: '已通过',
      cancelled: '已取消',
    };
    return map[status ?? ''] || status || '未知';
  };

  const fieldLabelMap = computed(() => {
    const map: Record<string, string> = {};
    formRule.value.forEach((rule: any) => {
      if (rule.field && rule.title) {
        map[rule.field] = rule.title;
      }
    });
    return map;
  });

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value
          .map((item: any) => {
            if (typeof item === 'object') {
              return (
                item.name || item.label || item.title || JSON.stringify(item)
              );
            }
            return String(item);
          })
          .join('、');
      }
      return value.name || value.label || value.title || JSON.stringify(value);
    }
    return String(value);
  };

  const getFieldLabel = (fieldKey: string): string => {
    return fieldLabelMap.value[fieldKey] || fieldKey;
  };

  const currentTime = computed(() => dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const printUserName = computed(
    () => userStore.user.realName || userStore.user.username || '-',
  );

  const getTraceLabel = (result?: string): string => {
    const map: Record<string, string> = {
      PASS: '审批通过',
      REJECT: '驳回',
      TRANSFER: '转办',
      DELEGATE: '委派',
      PENDING: '审批中',
    };
    return map[result ?? ''] || result || '-';
  };

  const handlePrint = () => {
    const printContent = document.getElementById('approval-print-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      Message.error('无法打开打印窗口，请检查浏览器弹窗设置');
      return;
    }

    const styles = `
      @page {
        size: A4;
        margin: 20mm;
      }
      body {
        font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      }
      .print-header {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #333;
      }
      .print-title {
        font-size: 20px;
        font-weight: bold;
        margin: 0 0 10px 0;
      }
      .print-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #666;
      }
      .print-meta-item {
        display: flex;
      }
      .print-meta-label {
        font-weight: 500;
        margin-right: 4px;
      }
      .print-section {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      .print-section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e5e5e5;
        color: #1a1a1a;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      .print-table-label {
        width: 15%;
        min-width: 100px;
        padding: 8px 12px;
        background: #f5f5f5;
        font-weight: 500;
        text-align: right;
        vertical-align: top;
        border: 1px solid #ddd;
      }
      .print-table-value {
        padding: 8px 12px;
        border: 1px solid #ddd;
        text-align: left;
      }
      .print-table-full {
        width: 85%;
      }
      .print-table-empty {
        text-align: center;
        padding: 20px;
        color: #999;
      }
      .print-table-bordered {
        border: 1px solid #ddd;
      }
      .print-th {
        padding: 10px 8px;
        background: #f5f5f5;
        font-weight: bold;
        text-align: center;
        border: 1px solid #ddd;
        font-size: 13px;
      }
      .print-td {
        padding: 8px;
        border: 1px solid #ddd;
        text-align: center;
        font-size: 13px;
        word-break: break-all;
      }
      @media print {
        body * {
          visibility: hidden;
        }
        #print-content,
        #print-content * {
          visibility: visible;
        }
        #print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${detail.value?.processDefinitionName || '审批打印'}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div id="print-content">${printContent.innerHTML}</div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleActionSuccess = () => {
    Message.success('处理完成');
    loadDetail();
  };

  onMounted(async () => {
    await nextTick();
    loadDetail();
  });

  watch(
    () => [taskId.value, processInstanceId.value],
    () => {
      loadDetail();
    },
  );
</script>

<style lang="less" scoped>
  // ===================== 信息卡片 =====================
  .info-card {
    background: var(--color-bg-2, #fff);
    border-radius: var(--border-radius, 4px);
    padding: 16px 20px;

    &__title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    &__title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      margin: 0;
      line-height: 1.4;
    }

    &__meta {
      display: flex;
      flex-wrap: wrap;
      background: var(--color-fill-2);
      border-radius: 4px;
      padding: 4px 0;
    }
  }

  .meta-item {
    flex: 1;
    min-width: 160px;
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding: 6px 14px;

    &__label {
      font-size: 13px;
      color: var(--color-text-3);
      white-space: nowrap;
      flex-shrink: 0;
      &::after {
        content: '：';
      }
    }

    &__value {
      font-size: 13px;
      color: var(--color-text-1);
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  // ===================== 状态标签 =====================
  .status-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 3px;
    white-space: nowrap;

    &--info {
      background: var(--color-primary-light-1, #e8f0ff);
      color: rgb(var(--primary-6));
    }
    &--success {
      background: var(--color-success-light-1, #e8ffea);
      color: rgb(var(--success-6));
    }
    &--danger {
      background: var(--color-danger-light-1, #ffece8);
      color: rgb(var(--danger-6));
    }
    &--warning {
      background: var(--color-warning-light-1, #fff7e8);
      color: rgb(var(--warning-6));
    }
  }

  // ===================== loading =====================
  .spin-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  // ===================== 标签页 =====================
  .detail-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.arco-tabs) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    :deep(.arco-tabs-header) {
      padding: 0 16px;
      border-bottom: 1px solid var(--color-border-2);
    }

    :deep(.arco-tabs-nav::before) {
      display: none;
    }

    :deep(.arco-tabs-tab) {
      padding: 10px 14px;
      font-size: 14px;
      color: var(--color-text-2);
      &:hover {
        color: rgb(var(--primary-6));
      }
      &.arco-tabs-tab-active {
        color: rgb(var(--primary-6));
        font-weight: 500;
      }
    }

    :deep(.arco-tabs-content) {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
    }
  }

  // ===================== Tab 内部 =====================
  .section-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-1);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-border-2);
  }

  .diagram-box {
    position: relative;
    height: 100%;
    min-height: 300px;
    background: var(--color-fill-1);
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius, 4px);
    overflow: hidden;

    :deep(.zs-workflow-viewer) {
      width: 100%;
      height: 100%;
    }
  }

  // ===================== 流程图缩放控件修正 =====================
  .diagram-box {
    :deep(.zoom) {
      position: absolute;
      right: 12px;
      top: 12px;
      margin-top: 0;
    }
  }

  // ===================== form-create 容器 =====================
  // .form-create-wrap {
  //   background: var(--color-fill-2);
  //   border: 1px solid var(--color-border-2);
  //   border-radius: var(--border-radius, 4px);
  //   padding: 20px;

  //   :deep(.el-input__wrapper),
  //   :deep(.el-textarea__inner) {
  //     border-radius: 4px;
  //     border-color: var(--color-border-2);
  //     background: var(--color-bg-2);
  //     box-shadow: none;
  //     &:hover {
  //       border-color: var(--color-neutral-5);
  //     }
  //     &:focus,
  //     &.is-focus {
  //       border-color: rgb(var(--primary-6));
  //       box-shadow: 0 0 0 2px var(--color-primary-light-1);
  //     }
  //   }

  //   :deep(.el-input__wrapper) {
  //     padding: 0 12px;
  //     min-height: 36px;
  //   }

  //   :deep(.el-textarea__inner) {
  //     padding: 8px 12px;
  //     resize: vertical;
  //   }

  //   :deep(.el-select) {
  //     width: 100%;
  //     .el-select__wrapper {
  //       border-radius: 4px;
  //       border-color: var(--color-border-2);
  //       background: var(--color-bg-2);
  //       box-shadow: none;
  //       &:hover {
  //         border-color: var(--color-neutral-5);
  //       }
  //       &.is-focused {
  //         border-color: rgb(var(--primary-6));
  //         box-shadow: 0 0 0 2px var(--color-primary-light-1);
  //       }
  //     }
  //   }

  //   :deep(.el-input.is-disabled .el-input__wrapper),
  //   :deep(.el-textarea.is-disabled .el-textarea__inner),
  //   :deep(.el-select.is-disabled .el-select__wrapper) {
  //     background: var(--color-fill-2);
  //     border-color: var(--color-border-2);
  //     color: var(--color-text-2);
  //     cursor: not-allowed;
  //   }

  //   :deep(.el-form-item) {
  //     margin-bottom: 18px;
  //   }
  // }

  // ===================== 打印 =====================
  @media print {
    // 隐藏非打印内容
    .info-card,
    .approval-action-panel {
      display: none !important;
    }

    .detail-tabs :deep(.arco-tabs-header) {
      display: none !important;
    }

    // 隐藏流程图 tab
    .detail-tabs :deep(.arco-tabs-content-item:nth-child(3)) {
      display: none !important;
    }

    // 显示所有 tab 内容（单据信息 + 审批信息）
    .detail-tabs :deep(.arco-tabs-content-item) {
      display: block !important;
      opacity: 1 !important;
    }

    .detail-tabs :deep(.arco-tabs-content) {
      padding: 0 !important;
      overflow: visible !important;
    }
  }

  // 打印专用标题
  .print-section-title {
    display: none;
    @media print {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: #1d2129;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e6eb;
    }
  }

  // ===================== 打印内容容器 =====================
  .print-content {
    display: none;
    position: absolute;
    left: -9999px;
    width: 210mm;
    padding: 20mm;
    box-sizing: border-box;

    &.print-visible {
      display: block;
    }

    .print-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;

      .print-title {
        font-size: 20px;
        font-weight: bold;
        margin: 0 0 10px 0;
        color: #333;
      }

      .print-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #666;

        .print-meta-item {
          display: flex;

          .print-meta-label {
            font-weight: 500;
            margin-right: 4px;
          }
        }
      }
    }

    .print-section {
      margin-bottom: 20px;

      .print-section-title {
        display: block;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e5e5e5;
        color: #1a1a1a;
      }
    }

    .print-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;

      .print-table-label {
        width: 15%;
        min-width: 100px;
        padding: 8px 12px;
        background: #f5f5f5;
        font-weight: 500;
        text-align: right;
        vertical-align: top;
        border: 1px solid #ddd;
      }

      .print-table-value {
        padding: 8px 12px;
        border: 1px solid #ddd;
        text-align: left;

        &.print-table-full {
          width: 85%;
        }
      }

      .print-table-empty {
        text-align: center;
        padding: 20px;
        color: #999;
      }

      &.print-table-bordered {
        border: 1px solid #ddd;

        .print-th {
          padding: 10px 8px;
          background: #f5f5f5;
          font-weight: bold;
          text-align: center;
          border: 1px solid #ddd;
          font-size: 13px;
        }

        .print-td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 13px;
          word-break: break-all;
        }
      }
    }
  }

  // ===================== 其他 =====================
  :deep(.arco-empty) {
    padding: 48px 0;
    .arco-empty-description {
      color: var(--color-text-3);
    }
  }

  :deep(.arco-descriptions-item-label) {
    font-weight: 500;
    color: var(--color-text-2);
    background: var(--color-fill-2);
  }

  // ===================== 响应式 =====================
  @media (max-width: 900px) {
    .info-card {
      padding: 12px 14px;
    }
    .meta-item {
      min-width: 140px;
      padding: 4px 10px;
    }
  }

  @media (max-width: 560px) {
    .info-card__title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .meta-item {
      min-width: 100%;
    }
    .detail-tabs :deep(.arco-tabs-content) {
      padding: 12px;
    }
    .diagram-box {
      height: 320px;
    }
  }
</style>
