<template>
  <div class="approval-action-panel">
    <a-divider />
    <div class="action-buttons">
      <a-space :size="12" wrap>
        <!-- 通过 -->
        <a-button type="primary" @click="showPassModal = true">
          <template #icon><icon-check /></template>
          通过
        </a-button>

        <!-- 驳回 -->
        <a-button status="danger" @click="showRejectModal = true">
          <template #icon><icon-close /></template>
          驳回
        </a-button>

        <!-- 转办 -->
        <a-button @click="showTransferModal = true">
          <template #icon><icon-send /></template>
          转办
        </a-button>

        <!-- 委派 -->
        <a-button @click="showDelegateModal = true">
          <template #icon><icon-user-add /></template>
          委派
        </a-button>

        <!-- 加签 -->
        <a-button @click="showAddSignModal = true">
          <template #icon><icon-plus-circle /></template>
          加签
        </a-button>

        <!-- 减签 -->
        <a-button @click="showReduceSignModal = true">
          <template #icon><icon-minus-circle /></template>
          减签
        </a-button>

        <!-- 抄送 -->
        <a-button @click="showCcModal = true">
          <template #icon><icon-copy /></template>
          抄送
        </a-button>
      </a-space>
    </div>

    <!-- 通过弹窗 -->
    <a-modal v-model:visible="showPassModal" title="审批通过" @ok="handlePass">
      <a-form auto-label-width>
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

    <!-- 驳回弹窗 -->
    <a-modal v-model:visible="showRejectModal" title="驳回" @ok="handleReject">
      <a-form auto-label-width>
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

    <!-- 转办弹窗 -->
    <a-modal
      v-model:visible="showTransferModal"
      title="转办"
      @ok="handleTransfer"
    >
      <a-form auto-label-width>
        <a-form-item label="转办人" required>
          <ZsSelectUser
            v-model="targetAssignee"
            :multiple="false"
            @on-select="(val: any) => (targetAssignee = val?.userId ?? '')"
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

    <!-- 委派弹窗 -->
    <a-modal
      v-model:visible="showDelegateModal"
      title="委派"
      @ok="handleDelegate"
    >
      <a-form auto-label-width>
        <a-form-item label="委派人" required>
          <ZsSelectUser
            v-model="targetAssignee"
            :multiple="false"
            @on-select="(val: any) => (targetAssignee = val?.userId ?? '')"
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

    <!-- 加签弹窗 -->
    <a-modal
      v-model:visible="showAddSignModal"
      title="加签"
      @ok="handleAddSign"
    >
      <a-form auto-label-width>
        <a-form-item label="加签人" required>
          <ZsSelectUser
            v-model="targetAssignee"
            :multiple="false"
            @on-select="(val: any) => (targetAssignee = val?.userId ?? '')"
          />
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

    <!-- 减签弹窗 -->
    <a-modal
      v-model:visible="showReduceSignModal"
      title="减签"
      @ok="handleReduceSign"
    >
      <a-form auto-label-width>
        <a-form-item label="减签人" required>
          <ZsSelectUser
            v-model="targetAssignee"
            :multiple="false"
            @on-select="(val: any) => (targetAssignee = val?.userId ?? '')"
          />
        </a-form-item>
        <a-form-item label="减签意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入减签意见"
            :max-length="500"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 抄送弹窗 -->
    <a-modal v-model:visible="showCcModal" title="抄送" @ok="handleCc">
      <a-form auto-label-width>
        <a-form-item label="抄送人" required>
          <ZsSelectUser
            v-model="ccUsers"
            :multiple="true"
            @on-select="(val: any) => handleCcSelect(val)"
          />
        </a-form-item>
        <a-form-item label="抄送意见">
          <a-textarea
            v-model="comment"
            placeholder="请输入抄送意见（选填）"
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
  import { Message } from '@arco-design/web-vue';
  import type { ApprovalAction } from '@/types/bpm/bpmTypes';
  import { bpmTaskApi } from '@/api/bpm/task';

  const props = defineProps<{
    taskId: string;
    loading?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'action', action: ApprovalAction): void;
    (e: 'success', actionType: string): void;
    (e: 'update:loading', val: boolean): void;
  }>();

  // 弹窗状态
  const showPassModal = ref(false);
  const showRejectModal = ref(false);
  const showTransferModal = ref(false);
  const showDelegateModal = ref(false);
  const showAddSignModal = ref(false);
  const showReduceSignModal = ref(false);
  const showCcModal = ref(false);

  // 通用字段
  const comment = ref('');
  const targetAssignee = ref('');
  const ccUsers = ref<string[]>([]);

  const resetState = () => {
    comment.value = '';
    targetAssignee.value = '';
    ccUsers.value = [];
  };

  // 通过
  const handlePass = async () => {
    emit('update:loading', true);
    try {
      await bpmTaskApi.completeTask(props.taskId, {
        action: 'PASS',
        comment: comment.value,
      });
      Message.success('审批通过');
      resetState();
      showPassModal.value = false;
      emit('success', 'PASS');
    } finally {
      emit('update:loading', false);
    }
  };

  // 驳回
  const handleReject = async () => {
    if (!comment.value) {
      Message.warning('请输入驳回意见');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskApi.completeTask(props.taskId, {
        action: 'REJECT',
        comment: comment.value,
      });
      Message.success('已驳回');
      resetState();
      showRejectModal.value = false;
      emit('success', 'REJECT');
    } finally {
      emit('update:loading', false);
    }
  };

  // 转办
  const handleTransfer = async () => {
    if (!targetAssignee.value) {
      Message.warning('请选择转办人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskApi.transferTask(props.taskId, {
        assignee: targetAssignee.value,
        comment: comment.value,
      });
      Message.success('转办成功');
      resetState();
      showTransferModal.value = false;
      emit('success', 'TRANSFER');
    } finally {
      emit('update:loading', false);
    }
  };

  // 委派
  const handleDelegate = async () => {
    if (!targetAssignee.value) {
      Message.warning('请选择委派人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskApi.delegateTask(props.taskId, {
        assignee: targetAssignee.value,
        comment: comment.value,
      });
      Message.success('委派成功');
      resetState();
      showDelegateModal.value = false;
      emit('success', 'DELEGATE');
    } finally {
      emit('update:loading', false);
    }
  };

  // 加签
  const handleAddSign = async () => {
    if (!targetAssignee.value) {
      Message.warning('请选择加签人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskApi.addSignTask(props.taskId, {
        assignee: targetAssignee.value,
        comment: comment.value,
      });
      Message.success('加签成功');
      resetState();
      showAddSignModal.value = false;
      emit('success', 'ADD_SIGN');
    } finally {
      emit('update:loading', false);
    }
  };

  // 减签
  const handleReduceSign = async () => {
    if (!targetAssignee.value) {
      Message.warning('请选择减签人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskApi.reduceSignTask(props.taskId, {
        assignee: targetAssignee.value,
        comment: comment.value,
      });
      Message.success('减签成功');
      resetState();
      showReduceSignModal.value = false;
      emit('success', 'REDUCE_SIGN');
    } finally {
      emit('update:loading', false);
    }
  };

  // 抄送
  const handleCc = async () => {
    if (ccUsers.value.length === 0) {
      Message.warning('请选择抄送人');
      return;
    }
    emit('update:loading', true);
    try {
      await bpmTaskApi.ccTask(props.taskId, {
        ccUserIds: ccUsers.value,
        comment: comment.value,
      });
      Message.success('抄送成功');
      resetState();
      showCcModal.value = false;
      emit('success', 'CC');
    } finally {
      emit('update:loading', false);
    }
  };

  const handleCcSelect = (val: any) => {
    if (val) {
      if (Array.isArray(val)) {
        ccUsers.value = val.map((v: any) => v.userId);
      } else {
        ccUsers.value = [val.userId];
      }
    }
  };
</script>

<style lang="less" scoped>
  .approval-action-panel {
    margin-top: 16px;

    .action-buttons {
      display: flex;
      justify-content: center;
    }
  }
</style>
