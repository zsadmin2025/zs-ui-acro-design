<template>
  <div class="role-container">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16" style="width: fit-content">
          <a-col :flex="1">
            <a-form :model="form" label-align="left" :auto-label-width="true">
              <a-form-item label="角色名称">
                <a-input
                  v-model="form.roleName"
                  placeholder="请输入角色名称"
                  :allow-clear="true"
                />
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :flex="'86px'">
            <a-space :size="18">
              <a-button type="primary" @click="roleStore.loadRolePage">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="roleStore.resetSearch">
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
                v-permission="'sys:role:save'"
                type="primary"
                @click="roleStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'sys:role:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="roleStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button v-permission="'sys:role:export'">
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
                <div class="action-icon" @click="() => roleStore.resetSearch()"
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
          row-key="sysRoleId"
          :loading="loading"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :row-selection="rowSelection"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
          :table-layout-fixed="true"
        >
          <template #dataScope="{ record }">
            <span v-if="record.dataScope === 1"> 全部数据权限 </span>
            <span v-else-if="record.dataScope === 2"> 自定义数据权限 </span>
            <span v-else-if="record.dataScope === 3"> 本部门数据权限 </span>
            <span v-else-if="record.dataScope === 4">
              本部门及以下数据权限
            </span>
            <span v-else-if="record.dataScope === 5"> 仅本人数据权限 </span>
          </template>
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                size="small"
                @click="roleStore.handleMenuPermission(record)"
              >
                <template #icon>
                  <icon-tool />
                </template>
                <template #default>权限</template>
              </a-link>
              <a-link
                v-permission="'sys:role:update'"
                @click="roleStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:role:delete'"
                status="danger"
                @click="roleStore.handleDelete(record)"
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
          @change="roleStore.handleCurrentChange"
          @page-size-change="roleStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <RoleAddOrEdit ref="addEditRef" @refresh="roleStore.loadRolePage()" />
    <RoleDataScope ref="dataScopeRef" />
    <RoleMenuPermission ref="menuPermissionRef" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useRoleStore } from '@/store/modules/sys/role/roleStore';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import RoleAddOrEdit from './components/role-add-or-edit.vue';
  import RoleDataScope from './components/role-data-scope.vue';
  import RoleMenuPermission from './components/role-menu-permission.vue';

  const roleStore = useRoleStore();
  const {
    addEditRef,
    dataScopeRef,
    menuPermissionRef,
    loading,
    list,
    total,
    form,
    selectedKeys,
  } = storeToRefs(roleStore);

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
      width: 60,
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '数据范围',
      dataIndex: 'dataScope',
      slotName: 'dataScope',
      ellipsis: true,
      tooltip: true,
      width: 300,
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
      width: 205,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };
  onMounted(() => {
    roleStore.loadRolePage();
  });
</script>
