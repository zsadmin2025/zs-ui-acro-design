<template>
  <div>
    <zs-container layout="left-right">
      <template #left>
        <ZsDept @node-click="userStore.handleNodeClick" />
      </template>
      <template #right-header>
        <a-form :model="form" label-align="left" :auto-label-width="true">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="username" label="登录账号">
                <a-input v-model="form.username" placeholder="登录账号" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="realName" label="真实姓名">
                <a-input v-model="form.realName" placeholder="真实姓名" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="phone" label="手机号">
                <a-input v-model="form.phone" placeholder="手机号" />
              </a-form-item>
            </a-col>
            <template v-if="!collapsed">
              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                <a-form-item field="email" label="邮箱">
                  <a-input v-model="form.email" placeholder="邮箱" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                <a-form-item field="sex" label="性别">
                  <a-select
                    v-model="form.sex"
                    placeholder="请选择性别"
                    allow-clear
                  >
                    <a-option :value="0">男</a-option>
                    <a-option :value="1">女</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                <a-form-item field="employeeNumber" label="工号">
                  <a-input v-model="form.employeeNumber" placeholder="工号" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                <a-form-item field="status" label="状态">
                  <a-select
                    v-model="form.status"
                    placeholder="请选择状态"
                    allow-clear
                  >
                    <a-option :value="0">禁用</a-option>
                    <a-option :value="1">启用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="6" :xxl="6">
              <div style="text-align: right">
                <a-space :size="9" wrap>
                  <a-button type="primary" @click="userStore.fetchData">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="userStore.reset">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    {{ $t('searchTable.form.reset') }}
                  </a-button>
                  <a-button type="text" @click="collapsed = !collapsed">
                    {{ collapsed ? '展开' : '收起' }}
                    <icon-down v-if="collapsed" />
                    <icon-up v-else />
                  </a-button>
                </a-space>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </template>

      <template #right-main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12">
            <a-space>
              <a-button
                v-permission="'sys:user:save'"
                type="primary"
                @click="userStore.handleAddOrEdit('add', $event)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'sys:user:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="userStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'sys:user:export'"
                @click="userStore.handleExport"
              >
                <template #icon>
                  <icon-download />
                </template>
                <template #default>导出</template>
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
                <div class="action-icon" @click="() => userStore.resetForm()"
                  ><icon-refresh size="18"
                /></div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #right-main-body>
        <a-table
          v-model:selected-keys="selectedKeys"
          row-key="sysUserId"
          :loading="loading"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :row-selection="rowSelection"
          :pagination="false"
          :scroll="{ x: 1800, y: '100%' }"
        >
          <template #avatar="{ record }">
            <a-avatar v-if="record.avatar" :size="32">
              <img alt="avatar" :src="record.avatar" />
            </a-avatar>
            <a-avatar
              v-else
              :size="32"
              :style="{
                verticalAlign: 'middle',
                backgroundColor: '#14a9f8',
              }"
            >
              {{ record.realName }}
            </a-avatar>
          </template>
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'sys:user:resetpassword'"
                @click="userStore.handleResetPassword(record)"
              >
                <template #icon>
                  <icon-loop />
                </template>
                <template #default>重置密码</template>
              </a-link>
              <a-link
                v-permission="'sys:user:update'"
                @click="userStore.handleAddOrEdit('edit', record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:user:delete'"
                status="danger"
                @click="userStore.handleDelete(record)"
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
          v-model:current="form.current"
          v-model:page-size="form.pageSize"
          :total="total"
          :show-total="appStore.device !== 'mobile'"
          :show-jumper="appStore.device !== 'mobile'"
          :show-page-size="appStore.device !== 'mobile'"
          :simple="appStore.device === 'mobile'"
          @change="userStore.handleCurrentChange"
          @page-size-change="userStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <user-add-or-edit ref="addEditRef" @refresh="userStore.fetchData" />

    <user-reset-password @refresh="userStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useAppStore } from '@/store';
  import { useUserStore } from '@/store/modules/sys/user/userStore';
  import userAddOrEdit from './components/user-add-or-edit.vue';
  import userResetPassword from './components/user-reset-password.vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(userStore);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const dynamicHeight = ref();
  const collapsed = ref(true);

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
      title: '头像',
      dataIndex: 'avatar',
      slotName: 'avatar',
      width: 70,
      align: 'center',
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '用户姓名',
      dataIndex: 'realName',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      slotName: 'sex',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      width: 70,
      render: ({ record }) => {
        return record.sex === 0 ? '男' : '女';
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '工号',
      dataIndex: 'employeeNumber',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 90,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 260,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
    },
  ]);
  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    userStore.fetchData();
  });
</script>
