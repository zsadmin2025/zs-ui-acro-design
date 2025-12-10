<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="jobAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysJobId ? '新增定时任务' : '修改定时任务' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="任务名称" field="jobName">
        <a-input v-model="form.jobName" placeholder="请输入任务名称" />
      </a-form-item>
      <a-form-item label="任务组名" field="jobGroup">
        <a-select v-model="form.jobGroup" placeholder="请输入任务组名">
          <a-option
            v-for="item in jobGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </a-select>
      </a-form-item>
      <a-form-item label="cron执行表达式" field="cronExpression">
        <a-input
          v-model="form.cronExpression"
          placeholder="请输入cron执行表达式"
        />
      </a-form-item>
      <a-form-item label="任务类名" field="jobClass">
        <a-input v-model="form.jobClass" placeholder="请输入任务类名" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-input v-model="form.remark" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="jobAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="jobAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useJobAddOrEditStore } from '@/store/modules/sys/job/jobAddOrEditStore';

  const jobAddOrEditStore = useJobAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } =
    storeToRefs(jobAddOrEditStore);

  const emits = defineEmits(['refresh']);

  const jobGroupOptions = [
    { label: '默认', value: 'DEFAULT' },
    { label: '系统', value: 'SYSTEM' },
  ];

  defineExpose({
    init: jobAddOrEditStore.init,
    form,
  });
</script>
