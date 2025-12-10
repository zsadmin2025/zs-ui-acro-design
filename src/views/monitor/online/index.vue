<template>
  <div class="onlineUser-container">
    <zs-container layout="header-main-footer">
      <template #main-header>
        <a-row justify="end" align="center">
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => resetSearch()"
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
          row-key="sysRoleId"
          :loading="loading"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
          :table-layout-fixed="true"
        >
          <template #avatar="{ record }">
            <a-avatar v-if="record.avatar">
              <img alt="avatar" :src="record.avatar" />
            </a-avatar>
            <a-avatar
              v-else
              :style="{
                marginRight: '24px',
                verticalAlign: 'middle',
                backgroundColor: '#14a9f8',
              }"
            >
              {{ record.realName }}
            </a-avatar>
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
          @change="handleCurrentChange"
          @page-size-change="handlePageSizeChange"
        />
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { sysOnlineUserApi } from '@/api/sys/onlineUser';

  const form = ref({
    username: '',
    current: 1,
    pageSize: 30,
  });

  const total = ref(0);
  const list = ref<any[]>([]);
  const loading = ref(false);

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
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      ellipsis: true,
      tooltip: true,
      width: 60,
      render: ({ record }) => {
        return record.sex === 0 ? '男' : '女';
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      align: 'center',
      width: 130,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      align: 'center',
      width: 180,
    },
    {
      title: '登录IP',
      dataIndex: 'ip',
      align: 'center',
      width: 130,
    },

    {
      title: '登录地址',
      dataIndex: 'ipAddress',
      align: 'center',
      width: 150,
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '登录浏览器',
      dataIndex: 'browser',
      align: 'center',
      width: 150,
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '登录操作系统',
      dataIndex: 'os',
      align: 'center',
      width: 240,
      tooltip: true,
      ellipsis: true,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operations',
    //   slotName: 'operations',
    //   width: 240,
    //   align: 'center',
    //   fixed: 'right',
    // },
  ]);

  const loadOnlineUserPage = async () => {
    loading.value = true;
    const { data } = await sysOnlineUserApi.getOnlineUserPage(form.value);
    list.value = data?.list ?? [];
    total.value = data?.total ?? 0;

    loading.value = false;
  };

  const handleCurrentChange = (current: number) => {
    form.value.current = current;
    loadOnlineUserPage();
  };
  const handlePageSizeChange = (pageSize: number) => {
    form.value.pageSize = pageSize;
    loadOnlineUserPage();
  };

  const resetSearch = () => {
    form.value.username = '';
    form.value.current = 1;
    form.value.pageSize = 30;
    loadOnlineUserPage();
  };

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    loadOnlineUserPage();
  });
</script>
