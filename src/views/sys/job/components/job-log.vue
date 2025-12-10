<template>
  <a-drawer
    :visible="dialogFormVisible"
    width="50%"
    unmount-on-close
    @cancel="useJobLogStore.close"
  >
    <template #title>执行日志 </template>
    <ZsContainer layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col>
            <a-radio-group
              v-model="form.status"
              type="button"
              @change="useJobLogStore.handleStatusChange"
            >
              <a-radio value="">全部</a-radio>
              <a-radio :value="1">正常</a-radio>
              <a-radio :value="0">异常</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'sys:jobLog:export'"
                @click="useJobLogStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                {{ $t('searchTable.operation.download') }}
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => useJobLogStore.reset()"
                  ><icon-refresh size="18"
                /></div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col> </a-row
      ></template>
      <template #main-body>
        <a-table
          row-key="sysLogLoginId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="jobLogList"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <span v-if="record.status === 0" class="circle fail"></span>
            <span v-else-if="record.status === 1" class="circle pass"></span>
            <span v-if="record.status === 0"> 暂停 </span>
            <span v-else-if="record.status === 1"> 正常 </span>
          </template>
        </a-table>
      </template>
    </ZsContainer>

    <template #footer>
      <a-pagination
        v-model:current="form.current"
        v-model:page-size="form.pageSize"
        :total="total"
        show-total
        show-jumper
        show-page-size
        @change="useJobLogStore.handleCurrentChange"
        @page-size-change="useJobLogStore.handleSizeChange"
      />
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';

  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { jobLogStore } from '@/store/modules/sys/job/jobLogStore';

  const useJobLogStore = jobLogStore();
  const { dialogFormVisible, form, jobLogList, loading, total } =
    storeToRefs(useJobLogStore);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      ellipsis: true,
      tooltip: true,
      width: 150,
      fixed: 'left',
    },
    {
      title: '任务分组',
      dataIndex: 'jobGroup',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '任务类名',
      dataIndex: 'jobClass',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '日志信息',
      dataIndex: 'jobMessage',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '开始执行时间',
      dataIndex: 'startTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: '结束执行时间',
      dataIndex: 'endTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '异常信息',
      dataIndex: 'exceptionInfo',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  defineExpose({
    init: useJobLogStore.init,
    form,
  });
</script>
