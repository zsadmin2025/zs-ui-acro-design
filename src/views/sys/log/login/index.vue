<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="username" label="登录用户名">
                    <a-input v-model="form.username" placeholder="登录用户名" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="ipAddress" label="登录IP">
                    <a-input v-model="form.ipAddress" placeholder="登录IP" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="city" label="地址">
                    <a-input v-model="form.city" placeholder="地址" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="loginStatus" label="登录结果">
                    <a-select
                      v-model="form.loginStatus"
                      placeholder="登录结果"
                      style="width: 100%"
                    >
                      <a-option :value="1"> 成功 </a-option>
                      <a-option :value="2"> 失败 </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="browser" label="浏览器类型">
                    <a-input v-model="form.browser" placeholder="浏览器类型" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="os" label="访问操作系统">
                    <a-input v-model="form.os" placeholder="访问操作系统" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="loginStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="loginStore.reset">
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
                v-permission="'sys:loglogin:export'"
                @click="loginStore.handleExport()"
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
                <div class="action-icon" @click="() => loginStore.reset()"
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
          row-key="sysLogLoginId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #loginStatus="{ record }">
            <ZsStatus
              :value="record.loginStatus"
              :custom-config="{
                1: { text: '成功' },
                2: {
                  icon: 'icon-filled-minus-circle',
                  color: 'red',
                  text: '失败',
                },
              }"
            />
          </template>
          <template #loginMethod="{ record }">
            <span v-if="record.loginMethod === 1"> 用户名密码登录 </span>
            <span v-else-if="record.loginMethod === 2"> 用户名密码登录 </span>
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link @click="loginStore.handleDetails(record)">
                <template #icon>
                  <icon-eye />
                </template>
                <template #default>详情</template>
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
          @change="loginStore.handleCurrentChange"
          @page-size-change="loginStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <Detail ref="addEditRef" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useLoginLogStore } from '@/store/modules/sys/log/loginLogStore';
  import Detail from './components/detail.vue';

  const loginStore = useLoginLogStore();
  const { loading, list, total, form, selectedKeys, addEditRef } =
    storeToRefs(loginStore);

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
      title: '登录用户名',
      dataIndex: 'username',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '登录IP',
      dataIndex: 'ipAddress',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: 'ip地址',
      dataIndex: 'city',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    // {
    //   title: '用户代理',
    //   dataIndex: 'userAgent',
    //   ellipsis: true,
    //   tooltip: true,
    // },
    {
      title: '登录结果',
      dataIndex: 'loginStatus',
      slotName: 'loginStatus',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '登录描述',
      dataIndex: 'failureReason',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '登录方式',
      dataIndex: 'loginMethod',
      slotName: 'loginMethod',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    // {
    //   title: '登录来源，网页登录、移动端应用登录',
    //   dataIndex: 'loginSource',
    //   ellipsis: true,
    //   tooltip: true,
    //   width: 100,
    // },
    {
      title: '浏览器类型',
      dataIndex: 'browser',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '访问操作系统',
      dataIndex: 'os',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    // {
    //   title: '租户id',
    //   dataIndex: 'tenantId',
    //   ellipsis: true,
    //   tooltip: true,
    // },
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
    loginStore.fetchData();
  });
</script>
