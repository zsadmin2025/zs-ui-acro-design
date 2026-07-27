<template>
  <div>
    <ZsContainer layout="left-right">
      <template #left>
        <ZsDept @node-click="deptStore.handleNodeClick" />
      </template>
      <template #right-header>
        <a-row :gutter="[16, 16]">
          <a-col :flex="1">
            <a-form
              :model="dataForm"
              label-align="left"
              :auto-label-width="true"
            >
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="部门名称" field="deptName">
                    <a-input
                      v-model="dataForm.deptName"
                      placeholder="请输入部门名称"
                      :allow-clear="true"
                    />
                  </a-form-item>
                </a-col>
                <a-col flex="1">
                  <div style="text-align: right">
                    <a-space :size="9" wrap>
                      <a-button type="primary" @click="deptStore.loadDeptPage">
                        <template #icon>
                          <icon-search />
                        </template>
                        {{ $t('searchTable.form.search') }}
                      </a-button>
                      <a-button @click="deptStore.resetForm">
                        <template #icon>
                          <icon-refresh />
                        </template>
                        {{ $t('searchTable.form.reset') }}
                      </a-button>
                    </a-space>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template #right-main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12">
            <a-space>
              <a-button
                v-permission="'sys:dept:save'"
                type="primary"
                @click="deptStore.handleAddOrEdit($event)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
            </a-space>
          </a-col>
          <a-col
            v-if="appStore.device !== 'mobile'"
            :xs="24"
            :sm="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => deptStore.resetForm()">
                  <icon-refresh size="18" />
                </div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #right-main-body>
        <a-table
          row-key="sysDeptId"
          :loading="loading"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'sys:dept:update'"
                @click="deptStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:dept:delete'"
                status="danger"
                @click="deptStore.handleDelete(record)"
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
      <template #right-footer>
        <a-pagination
          v-model:current="dataForm.current"
          v-model:page-size="dataForm.pageSize"
          :total="total"
          :show-total="appStore.device !== 'mobile'"
          :show-jumper="appStore.device !== 'mobile'"
          :show-page-size="appStore.device !== 'mobile'"
          :simple="appStore.device === 'mobile'"
          @change="deptStore.handleCurrentChange"
          @page-size-change="deptStore.handleSizeChange"
        />
      </template>
    </ZsContainer>
    <dept-add-or-edit ref="addEditRef" @refresh="loadAll()" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useDeptStore } from '@/store/modules/sys/dept/deptStore';
  import { useAppStore } from '@/store';
  import deptAddOrEdit from './components/dept-add-or-edit.vue';

  const deptStore = useDeptStore();
  const { addEditRef, loading, dataForm, list, total } = storeToRefs(deptStore);
  const appStore = useAppStore();

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${
          rowIndex + 1 + (dataForm.value.current - 1) * dataForm.value.pageSize
        }`,
      width: 60,
      align: 'center',
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '部门负责人',
      dataIndex: 'deptHeadName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);
  const currentSize = ref('medium');

  const loadAll = () => {
    deptStore.loadDeptPage();
    deptStore.loadDeptTreeData();
  };
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };
  onMounted(async () => {
    await deptStore.loadDeptPage();
  });
</script>
