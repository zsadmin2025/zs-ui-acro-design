<template>
  <div class="approval-action-panel">
    <div class="action-buttons">
      <!-- 实例已完成：仅打印、关闭 -->
      <a-space v-if="isInstanceDone" :size="12" wrap>
        <a-button @click="handlePrint">
          <template #icon><icon-printer /></template>
          打印
        </a-button>
        <a-button @click="handleClose">关闭</a-button>
      </a-space>

      <!-- 待办任务：按权限显示 -->
      <a-space v-else :size="12" wrap>
        <a-button
          v-if="btnEnabled('1')"
          type="primary"
          @click="showPassModal = true"
        >
          <template #icon><icon-check /></template>
          {{ btnLabel('1', '通过') }}
        </a-button>

        <a-button
          v-if="btnEnabled('2')"
          status="danger"
          @click="showRejectModal = true"
        >
          <template #icon><icon-close /></template>
          {{ btnLabel('2', '驳回') }}
        </a-button>

        <a-button v-if="btnEnabled('6')" @click="showReturnModal = true">
          <template #icon><icon-undo /></template>
          {{ btnLabel('6', '退回') }}
        </a-button>

        <a-button v-if="btnEnabled('3')" @click="showTransferModal = true">
          <template #icon><icon-send /></template>
          {{ btnLabel('3', '转办') }}
        </a-button>

        <a-button v-if="btnEnabled('4')" @click="showDelegateModal = true">
          <template #icon><icon-user-add /></template>
          {{ btnLabel('4', '委派') }}
        </a-button>

        <a-button v-if="btnEnabled('5')" @click="showAddSignModal = true">
          <template #icon><icon-plus-circle /></template>
          {{ btnLabel('5', '加签') }}
        </a-button>
        <a-button @click="handleClose">
          <template #icon><icon-close /></template>
          {{ '关闭' }}
        </a-button>
      </a-space>
    </div>

    <a-modal v-model:visible="showPassModal" title="审批通过" @ok="handlePass">
      <a-form :model="formModel" auto-label-width>
        <a-form-item label="审批意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入审批意见（选填）"
            :max-length="500"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            show-word-limit
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="showRejectModal" title="驳回" @ok="handleReject">
      <a-form :model="formModel" auto-label-width>
        <a-form-item label="驳回目标" required>
          <a-select
            v-model="rejectTarget"
            placeholder="请选择驳回目标"
            allow-clear
          >
            <a-option value="INITIATOR" label="发起人" />
            <a-option value="PREV" label="上一节点" />
            <a-option value="ANY" label="指定节点" />
          </a-select>
        </a-form-item>
        <a-form-item v-if="rejectTarget === 'ANY'" label="指定节点" required>
          <a-select
            v-model="rejectTargetActivityId"
            placeholder="请选择驳回的目标节点"
            allow-clear
          >
            <a-option
              v-for="node in returnableNodes"
              :key="node.nodeKey"
              :value="node.nodeKey"
              :label="node.nodeName"
            />
          </a-select>
        </a-form-item>
        <a-form-item label="驳回意见" required>
          <a-textarea
            v-model="comment"
            placeholder="请输入驳回意见"
            :max-length="500"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            show-word-limit
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="showTransferModal"
      title="转办"
      @ok="handleTransfer"
    >
      <a-form :model="formModel" auto-label-width>
        <a-form-item label="转办人" required>
          <ZsSelectUser
            v-model="targetUser"
            :multiple="false"
            @on-select="(val: any) => (targetUserId = val?.userId ? Number(val.userId) : undefined)"
          />
        </a-form-item>
        <a-form-item label="转办意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入转办意见（选填）"
            :max-length="500"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="showDelegateModal"
      title="委派"
      @ok="handleDelegate"
    >
      <a-form :model="formModel" auto-label-width>
        <a-form-item label="委派人" required>
          <ZsSelectUser
            v-model="targetUser"
            :multiple="false"
            @on-select="(val: any) => (targetUserId = val?.userId ? Number(val.userId) : undefined)"
          />
        </a-form-item>
        <a-form-item label="委派意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入委派意见（选填）"
            :max-length="500"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="showAddSignModal"
      title="加签"
      @ok="handleAddSign"
    >
      <a-form :model="formModel" auto-label-width>
        <a-form-item label="加签人" required>
          <ZsSelectUser
            v-model="targetUser"
            :multiple="false"
            @on-select="(val: any) => (targetUserId = val?.userId ? Number(val.userId) : undefined)"
          />
        </a-form-item>
        <a-form-item label="加签位置">
          <a-select
            v-model="signPosition"
            placeholder="请选择加签位置"
            allow-clear
          >
            <a-option value="BEFORE" label="前加签" />
            <a-option value="AFTER" label="后加签" />
          </a-select>
        </a-form-item>
        <a-form-item label="加签意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入加签意见（选填）"
            :max-length="500"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="showRevokeModal" title="撤回" @ok="handleRevoke">
      <a-form :model="formModel" auto-label-width>
        <a-form-item label="撤回意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入撤回意见（选填）"
            :max-length="500"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="showReturnModal" title="退回" @ok="handleReturn">
      <a-form :model="formModel" auto-label-width>
        <a-form-item label="退回节点" required>
          <a-select
            v-model="rejectTargetActivityId"
            placeholder="请选择要退回的节点"
            allow-clear
          >
            <a-option
              v-for="node in returnableNodes"
              :key="node.nodeKey"
              :value="node.nodeKey"
              :label="node.nodeName"
            />
          </a-select>
        </a-form-item>
        <a-form-item label="退回意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入退回意见（选填）"
            :max-length="500"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useTabBarStore } from '@/store';
  import type {
    ApprovalAction,
    TaskCompleteParams,
  } from '@/types/bpm/bpmTypes';
  import { bpmTaskTodoApi } from '@/api/bpm/task/todo';

  export interface ButtonPermission {
    id: string;
    displayName: string;
    enable: boolean;
  }

  const props = defineProps<{
    taskId: string;
    processInstanceId: string;
    buttonPermissions?: ButtonPermission[];
    returnableNodes?: { nodeKey: string; nodeName: string }[];
    loading?: boolean;
    formData?: Record<string, any>;
    /** 流程实例状态 */
    processStatus?: string;
  }>();
  const router = useRouter();
  const route = useRoute();
  const tabBarStore = useTabBarStore();

  const emit = defineEmits<{
    (e: 'action', action: ApprovalAction): void;
    (e: 'success', actionType: string): void;
    (e: 'update:loading', val: boolean): void;
    (e: 'print'): void;
  }>();

  const btnEnabled = (btnId: string): boolean => {
    if (!props.buttonPermissions || props.buttonPermissions.length === 0) {
      return true;
    }
    const perm = props.buttonPermissions.find((p) => p.id === btnId);
    return perm?.enable !== false;
  };

  const btnLabel = (btnId: string, fallback: string): string => {
    if (!props.buttonPermissions || props.buttonPermissions.length === 0) {
      return fallback;
    }
    const perm = props.buttonPermissions.find((p) => p.id === btnId);
    return perm?.displayName || fallback;
  };

  const isInstanceDone = computed(() => props.processStatus === 'completed');

  const showPassModal = ref(false);
  const showRejectModal = ref(false);
  const showRevokeModal = ref(false);
  const showReturnModal = ref(false);
  const showTransferModal = ref(false);
  const showDelegateModal = ref(false);
  const showAddSignModal = ref(false);

  const formModel = ref<Record<string, any>>({});
  const comment = ref('');
  const targetUser = ref('');
  const targetUserId = ref<number | undefined>(undefined);
  const rejectTarget = ref<string>('INITIATOR');
  const rejectTargetActivityId = ref('');
  const signPosition = ref<string>('BEFORE');

  const resetState = () => {
    comment.value = '';
    targetUser.value = '';
    targetUserId.value = undefined;
    rejectTarget.value = 'INITIATOR';
    rejectTargetActivityId.value = '';
    signPosition.value = 'BEFORE';
  };

  const buildBaseParams = (
    action: TaskCompleteParams['action'],
  ): TaskCompleteParams | null => {
    if (!props.taskId) {
      Message.error('任务ID不能为空');
      return null;
    }
    return {
      taskId: props.taskId,
      processInstanceId: props.processInstanceId,
      action,
      comment: comment.value || undefined,
      formData: props.formData || undefined,
    };
  };

  const handlePass = async () => {
    const params = buildBaseParams('COMPLETE');
    if (!params) return;
    emit('update:loading', true);
    try {
      await bpmTaskTodoApi.completeTask(params);
      Message.success('审批通过');
      resetState();
      showPassModal.value = false;
      emit('success', 'COMPLETE');
    } finally {
      emit('update:loading', false);
    }
  };

  const handleReject = async () => {
    const baseParams = buildBaseParams('REJECT');
    if (!baseParams) return;
    if (!comment.value) {
      Message.warning('请输入驳回意见');
      return;
    }
    if (!rejectTarget.value) {
      Message.warning('请选择驳回目标');
      return;
    }
    if (rejectTarget.value === 'ANY' && !rejectTargetActivityId.value) {
      Message.warning('请选择驳回的目标节点');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskTodoApi.completeTask({
        ...baseParams,
        rejectTarget: rejectTarget.value as any,
        rejectTargetActivityId:
          rejectTarget.value === 'ANY'
            ? rejectTargetActivityId.value
            : undefined,
      });
      Message.success('已驳回');
      resetState();
      showRejectModal.value = false;
      emit('success', 'REJECT');
    } finally {
      emit('update:loading', false);
    }
  };

  const handleReturn = async () => {
    const baseParams = buildBaseParams('RETURN');
    if (!baseParams) return;
    if (!rejectTargetActivityId.value) {
      Message.warning('请选择退回节点');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskTodoApi.completeTask({
        ...baseParams,
        rejectTarget: 'ANY',
        rejectTargetActivityId: rejectTargetActivityId.value,
      });
      Message.success('已退回');
      resetState();
      showReturnModal.value = false;
      emit('success', 'RETURN');
    } finally {
      emit('update:loading', false);
    }
  };

  const handleTransfer = async () => {
    const baseParams = buildBaseParams('TRANSFER');
    if (!baseParams) return;
    if (!targetUserId.value) {
      Message.warning('请选择转办人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskTodoApi.completeTask({
        ...baseParams,
        targetUserId: targetUserId.value,
      });
      Message.success('转办成功');
      resetState();
      showTransferModal.value = false;
      emit('success', 'TRANSFER');
    } finally {
      emit('update:loading', false);
    }
  };

  const handleDelegate = async () => {
    const baseParams = buildBaseParams('DELEGATE');
    if (!baseParams) return;
    if (!targetUserId.value) {
      Message.warning('请选择委派人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskTodoApi.completeTask({
        ...baseParams,
        targetUserId: targetUserId.value,
      });
      Message.success('委派成功');
      resetState();
      showDelegateModal.value = false;
      emit('success', 'DELEGATE');
    } finally {
      emit('update:loading', false);
    }
  };

  const handleAddSign = async () => {
    const baseParams = buildBaseParams('COMPLETE');
    if (!baseParams) return;
    if (!targetUserId.value) {
      Message.warning('请选择加签人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskTodoApi.completeTask({
        ...baseParams,
        signUserIds: [targetUserId.value],
        signPosition: signPosition.value as any,
      });
      Message.success('加签成功');
      resetState();
      showAddSignModal.value = false;
      emit('success', 'ADD_SIGN');
    } finally {
      emit('update:loading', false);
    }
  };

  const handlePrint = () => {
    emit('print');
  };

  const handleRevoke = async () => {
    const baseParams = buildBaseParams('REVOKE');
    if (!baseParams) return;
    emit('update:loading', true);
    try {
      await bpmTaskTodoApi.completeTask(baseParams);
      Message.success('已撤回');
      resetState();
      showRevokeModal.value = false;
      emit('success', 'REVOKE');
    } finally {
      emit('update:loading', false);
    }
  };

  const handleClose = () => {
    const tagList = tabBarStore.getTabList;
    const idx = tagList.findIndex((tag) => tag.fullPath === route.fullPath);
    if (idx === -1) {
      router.back();
      return;
    }
    // 先取得前一个标签页引用，再删除当前标签页
    const prevTag = tagList[idx - 1];
    tabBarStore.deleteTag(idx, tagList[idx]);
    if (prevTag) {
      router.push({ name: prevTag.name });
    } else {
      router.back();
    }
  };
</script>

<style lang="less" scoped>
  .approval-action-panel {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;

    .action-buttons {
      display: flex;
      justify-content: center;
    }
  }
</style>
