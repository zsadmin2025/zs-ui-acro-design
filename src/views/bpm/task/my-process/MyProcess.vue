<template>
  <div class="my-process">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="[16, 16]">
          <a-col :flex="1">
            <a-form
              :model="searchForm"
              label-align="left"
              :auto-label-width="true"
            >
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="流程名称">
                    <a-input
                      v-model="searchForm.processDefinitionName"
                      placeholder="请输入流程名称"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="状态">
                    <a-select
                      v-model="searchForm.status"
                      placeholder="请选择状态"
                      :allow-clear="true"
                    >
                      <a-option value="RUNNING">审批中</a-option>
                      <a-option value="COMPLETED">已通过</a-option>
                      <a-option value="REJECTED">已驳回</a-option>
                      <a-option value="TERMINATED">已撤销</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col flex="1">
                  <div style="text-align: right">
                    <a-space :size="9" wrap>
                      <a-button type="primary" @click="store.loadData()"
                        ><template #icon><icon-search /></template
                        >搜索</a-button
                      >
                      <a-button @click="store.resetSearch()"
                        ><template #icon><icon-refresh /></template
                        >重置</a-button
                      >
                    </a-space>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12"
            ><span class="page-subtitle">我发起的流程</span></a-col
          >
          <a-col
            v-if="appStore.device !== 'mobile'"
            :xs="24"
            :sm="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip content="刷新"
                ><div class="action-icon" @click="store.loadData()"
                  ><icon-refresh size="18" /></div
              ></a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table
          row-key="processInstanceId"
          :loading="loading"
          :columns="columns"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
          :table-layout-fixed="true"
        >
          <template #operations="{ record }">
            <a-space size="mini" wrap>
              <a-link @click="goToDetail(record)">
                <template #icon><icon-eye /></template>详情
              </a-link>
              <!-- <a-link
                v-if="record.status !== 'COMPLETED'"
                status="danger"
                @click="store.handleCancel(record)"
              >
                <template #icon><icon-close-circle /></template>撤回
              </a-link> -->
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :show-total="appStore.device !== 'mobile'"
          :show-jumper="appStore.device !== 'mobile'"
          :show-page-size="appStore.device !== 'mobile'"
          :simple="appStore.device === 'mobile'"
          @change="store.loadData()"
          @page-size-change="store.loadData()"
        />
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { h, resolveComponent } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useMyProcessStore } from '@/store/modules/bpm/task/myProcessStore';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';

  const store = useMyProcessStore();
  const appStore = useAppStore();
  const router = useRouter();
  const { loading, list, total, searchForm, pagination } = storeToRefs(store);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const goToDetail = (record: any) => {
    router.push({
      path: '/bpm/task/detail',
      query: {
        processInstanceId: record.processInstanceId,
      },
    });
  };

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${
          rowIndex +
          1 +
          (pagination.value.current - 1) * pagination.value.pageSize
        }`,
      width: 60,
      align: 'center',
    },
    {
      title: '流程名称',
      dataIndex: 'processDefinitionName',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: '发起人',
      dataIndex: 'startUserName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '发起部门',
      dataIndex: 'startDeptName',
      ellipsis: true,
      width: 130,
    },
    {
      title: '业务单据',
      dataIndex: 'businessKey',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    {
      title: '当前进度节点',
      width: 220,
      render: ({ record }) => {
        const r = record as any;
        const tasks = r.currentTasks;
        if (tasks && tasks.length > 0) {
          const assignee = r.assigneeName || '';
          const nodeName = tasks[0].name || '';
          const text = assignee
            ? `${assignee} (${nodeName}) 审批中`
            : `${nodeName} 审批中`;
          return h('span', text);
        }
        return h('span', '-');
      },
    },
    {
      title: '流程状态',
      width: 100,
      render: ({ record }) => {
        const { status } = record as any;
        let color = 'gray';
        let label = status || '-';
        let icon = '';
        if (status === 'RUNNING') {
          color = 'blue';
          label = '审批中';
          icon = 'icon-sync';
        } else if (status === 'COMPLETED') {
          color = 'green';
          label = '已通过';
          icon = 'icon-check';
        } else if (status === 'REJECTED') {
          color = 'red';
          label = '已驳回';
          icon = 'icon-close';
        } else if (status === 'TERMINATED') {
          color = 'orange';
          label = '已撤销';
          icon = 'icon-stop';
        }
        return h(resolveComponent('a-tag'), { color }, () => [
          icon
            ? h(resolveComponent(icon), { style: 'margin-right:4px' })
            : null,
          label,
        ]);
      },
    },
    { title: '发起时间', dataIndex: 'startTime', width: 170 },
    {
      title: '结束时间',
      width: 170,
      render: ({ record }) => (record as any).endTime || '-',
    },
    {
      title: '操作',
      slotName: 'operations',
      width: 150,
      align: 'left',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);

  onMounted(() => {
    store.loadData();
  });
  onUnmounted(() => {
    store.resetState();
  });
</script>
