<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="packageCode" label="套餐编码">
                    <a-input
                      v-model="form.packageCode"
                      placeholder="套餐编码"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="packageName" label="套餐名称">
                    <a-input
                      v-model="form.packageName"
                      placeholder="套餐名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="status" label="状态">
                    <a-select
                      v-model="form.status"
                      placeholder="请选择状态"
                      allow-clear
                    >
                      <a-option :value="0">下架</a-option>
                      <a-option :value="1">正常</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="tenantPackageStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="tenantPackageStore.reset">
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
        <a-row>
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'sys:tenantPackage:save'"
                type="primary"
                @click="tenantPackageStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'sys:tenantPackage:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="tenantPackageStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'sys:tenantPackage:export'"
                @click="tenantPackageStore.handleExport()"
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
                <div
                  class="action-icon"
                  @click="() => tenantPackageStore.reset()"
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
          row-key="sysTenantPackageId"
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
                v-permission="'sys:tenantPackage:update'"
                @click="tenantPackageStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:tenantPackage:delete'"
                status="danger"
                @click="tenantPackageStore.handleDelete(record)"
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
          @change="tenantPackageStore.handleCurrentChange"
          @page-size-change="tenantPackageStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <TenantPackageAddOrEdit
      ref="addEditRef"
      @refresh="tenantPackageStore.fetchData"
    />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useTenantPackageStore } from '@/store/modules/sys/tenant/tenantPackage/tenantPackageStore';
  import TenantPackageAddOrEdit from './components/tenantPackage-add-or-edit.vue';

  const tenantPackageStore = useTenantPackageStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(tenantPackageStore);

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
      title: '套餐编码',
      dataIndex: 'packageCode',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '套餐名称',
      dataIndex: 'packageName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '套餐价格',
      dataIndex: 'price',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '最大用户数',
      dataIndex: 'maxUser',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '最大存储空间(GB)',
      dataIndex: 'maxStorage',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    tenantPackageStore.fetchData();
  });
</script>
