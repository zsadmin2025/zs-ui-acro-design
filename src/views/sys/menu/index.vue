<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #main-header>
        <a-row>
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'sys:post:save'"
                type="primary"
                @click="menuStore.handleAddOrEdit($event)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <!-- <a-button @click="menuStore.handleExport">
                <template #icon>
                  <icon-download />
                </template>
                <template #default>导出</template>
              </a-button> -->
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => menuStore.resetForm()"
                  ><icon-refresh size="18" />
                </div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table
          row-key="sysMenuId"
          :loading="loading"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #type="{ record }">
            <a-tag v-if="record.type === 1" color="arcoblue"> 目录 </a-tag>
            <a-tag v-if="record.type === 2" color="green"> 菜单 </a-tag>
          </template>
          <template #icon="{ record }">
            <ZsIcon :icon="record.icon" size="16" />
          </template>
          <template #hideInMenu="{ record }">
            <a-tag v-if="record.hideInMenu" color="arcoblue">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
          <template #hideChildrenInMenu="{ record }">
            <a-tag v-if="record.hideChildrenInMenu" color="arcoblue">
              否
            </a-tag>
            <a-tag v-else color="red">是</a-tag>
          </template>
          <template #noAffix="{ record }">
            <a-tag v-if="record.noAffix" color="red"> 否</a-tag>
            <a-tag v-else color="arcoblue">是</a-tag>
          </template>
          <template #ignoreCache="{ record }">
            <a-tag v-if="record.ignoreCache" color="red">否</a-tag>
            <a-tag v-else color="arcoblue">是</a-tag>
          </template>
          <template #visible="{ record }">
            <a-switch
              v-model="record.visible"
              :checked-value="1"
              :unchecked-value="0"
              type="round"
              @change="menuStore.handleStatusChange(record)"
            >
              <template #checked> 显示 </template>
              <template #unchecked> 隐藏 </template>
            </a-switch>
          </template>
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-if="record.type == 2"
                @click="menuStore.handleBtnPermissions(record)"
              >
                按钮权限
              </a-link>
              <a-link
                v-permission="'sys:menu:update'"
                @click="menuStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:menu:delete'"
                status="danger"
                @click="menuStore.handleDelete(record)"
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
    </zs-container>
    <menu-add-or-edit ref="addEditRef" @refresh="menuStore.loadMenuPage()" />
    <menu-btn-permissions ref="btnPermissionsRef" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useMenuStore } from '@/store/modules/sys/menu/menuStore';
  import MenuAddOrEdit from './components/menu-add-or-edit.vue';
  import MenuBtnPermissions from './components/menu-btn-permissions.vue';

  const menuStore = useMenuStore();
  const { addEditRef, loading, list, btnPermissionsRef } =
    storeToRefs(menuStore);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '菜单名称',
      dataIndex: 'title',
      ellipsis: true,
      tooltip: true,
      width: 200,
      fixed: 'left',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      ellipsis: true,
      tooltip: true,
      width: 120,
      slotName: 'icon',
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      slotName: 'type',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      ellipsis: true,
      tooltip: true,
      width: 260,
    },
    {
      title: '组件名称',
      dataIndex: 'name',
      ellipsis: true,
      tooltip: true,
      width: 260,
    },

    {
      title: '组件路径',
      dataIndex: 'component',
      ellipsis: true,
      tooltip: true,
      showOverflowTooltip: true,
    },
    {
      title: '隐藏菜单',
      dataIndex: 'hideInMenu',
      slotName: 'hideInMenu',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    // {
    //   title: '隐藏子菜单',
    //   dataIndex: 'hideChildrenInMenu',
    //   slotName: 'hideChildrenInMenu',
    //   ellipsis: true,
    //   tooltip: true,
    //   width: 120,
    // },
    // {
    //   title: '当前激活的菜单',
    //   dataIndex: 'activeMenu',
    //   slotName: 'activeMenu',
    //   ellipsis: true,
    //   tooltip: true,
    //   width: 120,
    // },
    // {
    //   title: '是否固定标签页',
    //   dataIndex: 'noAffix',
    //   slotName: 'noAffix',
    //   ellipsis: true,
    //   tooltip: true,
    //   width: 120,
    // },
    {
      title: '页面缓存',
      dataIndex: 'ignoreCache',
      slotName: 'ignoreCache',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '隐藏/显示',
      dataIndex: 'visible',
      slotName: 'visible',
      ellipsis: true,
      tooltip: true,
      width: 140,
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
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 250,
      align: 'right',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    menuStore.loadMenuPage();
  });
</script>
