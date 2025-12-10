<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="jobName" label="任务名称">
                    <a-input v-model="form.jobName" placeholder="任务名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="jobGroup" label="任务组名">
                    <a-input v-model="form.jobGroup" placeholder="任务组名" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="status" label="任务状态">
                    <a-select
                      v-model="form.status"
                      placeholder="请选择任务状态"
                    >
                      <a-option :value="0"> 暂停 </a-option>
                      <a-option :value="1"> 正常 </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="jobClass" label="任务类名">
                    <a-input v-model="form.jobClass" placeholder="任务类名" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="jobStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="jobStore.reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'sys:job:save'"
                type="primary"
                @click="jobStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'sys:job:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="jobStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'sys:job:export'"
                @click="jobStore.handleExport()"
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
                <div class="action-icon" @click="() => jobStore.reset()"
                  ><icon-refresh size="18"
                /></div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table
          v-model:selected-keys="selectedKeys"
          :row-selection="rowSelection"
          row-key="sysJobId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
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

          <template #operations="{ record }">
            <a-space>
              <a-link
                v-permission="'sys:job:update'"
                @click="jobStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="
                  record.status === 0 ? 'sys:job:pause' : 'sys:job:resume'
                "
                @click="jobStore.handleClick(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>{{
                  record.status === 1 ? '暂停' : '恢复'
                }}</template>
              </a-link>
              <a-link
                v-permission="'sys:job:run'"
                @click="jobStore.handleRun(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default> 执行一次</template>
              </a-link>
              <a-link
                v-permission="'sys:jobLog:page'"
                @click="jobStore.handleLog(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default> 执行日志</template>
              </a-link>
              <a-link
                v-permission="'sys:job:delete'"
                status="danger"
                @click="jobStore.handleDelete(record)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-link>
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination
          v-model:current="form.current"
          v-model:page-size="form.pageSize"
          :total="total"
          show-total
          show-jumper
          show-page-size
          @change="jobStore.handleCurrentChange"
          @page-size-change="jobStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <JobAddOrEdit ref="addEditRef" @refresh="jobStore.fetchData" />
    <JobLog ref="logRef" @refresh="jobStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useJobStore } from '@/store/modules/sys/job/jobStore';
  import JobAddOrEdit from './components/job-add-or-edit.vue';
  import JobLog from './components/job-log.vue';

  const jobStore = useJobStore();
  const { addEditRef, logRef, loading, list, total, form, selectedKeys } =
    storeToRefs(jobStore);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 80,
      align: 'center',
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '任务类名',
      dataIndex: 'jobClass',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 400,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    jobStore.fetchData();
  });
</script>
