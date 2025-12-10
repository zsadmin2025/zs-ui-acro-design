<template>
  <a-drawer
    :visible="menuBtnVisible"
    :title="`${sysMenuTitle}-按钮权限`"
    width="50%"
    @cancel="menuBtnPermissionStore.handleCancel"
    @ok="menuBtnPermissionStore.handleOk"
  >
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <a-space>
          <a-button
            v-permission="'sys:menu:btnPermissions:save'"
            type="primary"
            @click="menuBtnPermissionStore.handleAddOrEdit($event)"
          >
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-table
      row-key="sysMenuId"
      :columns="(columns as TableColumnData[])"
      :data="menuBtnPermissions"
      :bordered="false"
      :size="currentSize"
      :pagination="false"
    >
      <template #status="{ record }">
        <span v-if="record.status === 0" class="circle fail"></span>
        <span v-else-if="record.status === 1" class="circle pass"></span>
        <span v-if="record.status === 0"> 禁用 </span>
        <span v-else-if="record.status === 1"> 启用 </span>
      </template>
      <template #operations="{ record }">
        <a-space>
          <a-button
            v-permission="'sys:menu:btnPermissions:update'"
            type="text"
            size="small"
            @click="menuBtnPermissionStore.handleAddOrEdit(record)"
          >
            编辑
          </a-button>
          <a-button
            v-permission="'sys:menu:btnPermissions:delete'"
            type="text"
            size="small"
            status="danger"
            @click="menuBtnPermissionStore.handleDelete(record)"
          >
            删除
          </a-button>
        </a-space>
      </template>
    </a-table>
  </a-drawer>
  <menu-btn-permissions-add-or-edit
    ref="menuBtnPermissionAddRef"
    @refresh="menuBtnPermissionStore.queryBtnPermissions()"
  />
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useMenuBtnPermissionStore } from '@/store/modules/sys/menu/menuBtnPermissionStore';
  import MenuBtnPermissionsAddOrEdit from './menu-btn-permissions-add-or-edit.vue';

  const menuBtnPermissionStore = useMenuBtnPermissionStore();
  const {
    menuBtnPermissionAddRef,
    menuBtnVisible,
    sysMenuId,
    sysMenuTitle,
    menuBtnPermissions,
  } = storeToRefs(menuBtnPermissionStore);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '按钮名称',
      dataIndex: 'title',
      ellipsis: true,
      tooltip: true,
      width: 100,
      fixed: 'left',
    },
    {
      title: '权限标识',
      dataIndex: 'permissions',
      ellipsis: true,
      tooltip: true,
      width: 300,
      slotName: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      slotName: 'sort',
      align: 'center',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 120,
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

  defineExpose({
    sysMenuTitle,
    sysMenuId,
    init: menuBtnPermissionStore.init,
  });
</script>
