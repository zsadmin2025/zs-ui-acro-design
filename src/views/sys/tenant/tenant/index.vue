<template>
  <div class="tenant-container">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" label-align="left" :auto-label-width="true">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="tenantName" label="租户名称">
                    <a-input v-model="form.tenantName" placeholder="租户名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="contactPerson" label="联系人">
                    <a-input
                      v-model="form.contactPerson"
                      placeholder="联系人"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="contactPhone" label="手机号">
                    <a-input v-model="form.contactPhone" placeholder="手机号" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="status" label="状态">
                    <a-select
                      v-model="form.status"
                      placeholder="请选择状态"
                      allow-clear
                    >
                      <a-option :value="0">启用</a-option>
                      <a-option :value="1">禁用</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'">
            <a-space :size="18">
              <a-button type="primary" @click="tenantStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="tenantStore.reset">
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
                v-permission="'sys:tenant:save'"
                type="primary"
                @click="tenantStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'sys:tenant:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="tenantStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'sys:tenant:export'"
                @click="tenantStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                导出
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => tenantStore.reset()"
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
          row-key="sysTenantUserId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'sys:tenant:update'"
                @click="tenantStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:tenant:delete'"
                status="danger"
                @click="tenantStore.handleDelete(record)"
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
          @change="tenantStore.handleCurrentChange"
          @page-size-change="tenantStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <TenantAddOrEdit ref="addEditRef" @refresh="tenantStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useTenantStore } from '@/store/modules/sys/tenant/tenant/tenantStore';
  import TenantAddOrEdit from './components/tenant-add-or-edit.vue';

  const tenantStore = useTenantStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(tenantStore);

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
      title: '租户名称',
      dataIndex: 'tenantName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 150,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    tenantStore.fetchData();
  });
</script>
