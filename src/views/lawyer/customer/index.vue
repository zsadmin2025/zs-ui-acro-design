<template>
  <div class="customer-container">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-form :model="form" label-align="left" :auto-label-width="true">
          <a-row :gutter="[16, 16]">
            <a-col :span="8">
              <a-form-item field="customerName" label="客户名称">
                <a-input
                  v-model="form.customerName"
                  placeholder="客户名称"
                  :allow-clear="true"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="customerCategory" label="客户类别">
                <a-select
                  v-model="form.customerCategory"
                  placeholder="请选择客户类别"
                  :allow-clear="true"
                >
                  <a-option
                    v-for="item in customerCategory"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="customerNature" label="客户性质">
                <a-select
                  v-model="form.customerNature"
                  placeholder="请选择客户性质"
                  :allow-clear="true"
                >
                  <a-option
                    v-for="item in customerNature"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="!collapsed">
              <a-col :span="8">
                <a-form-item field="maintainingPeople" label="维系人">
                  <a-select
                    v-model="form.maintainingPeople"
                    placeholder="请选择维系人"
                    allow-search
                    :allow-clear="true"
                  >
                    <a-option
                      v-for="item in userList"
                      :key="item.sysUserId"
                      :value="item.sysUserId"
                      >{{ item.realName }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="sharer" label="共享人">
                  <a-select
                    v-model="form.sharer"
                    placeholder="请选择共享人"
                    allow-search
                    :allow-clear="true"
                  >
                    <a-option
                      v-for="item in userList"
                      :key="item.sysUserId"
                      :value="item.sysUserId"
                      >{{ item.realName }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="inputPerson" label="录入人">
                  <a-select
                    v-model="form.inputPerson"
                    placeholder="请选择录入人"
                    allow-search
                    :allow-clear="true"
                  >
                    <a-option
                      v-for="item in userList"
                      :key="item.sysUserId"
                      :value="item.sysUserId"
                      >{{ item.realName }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
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
            </template>
            <a-col :flex="1">
              <div style="text-align: right">
                <a-space :size="9" wrap>
                  <a-button type="primary" @click="customerStore.fetchData">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="customerStore.reset">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    {{ $t('searchTable.form.reset') }}
                  </a-button>
                  <a-button type="text" @click="collapsed = !collapsed">
                    <template #icon>
                      <icon-up v-if="!collapsed" />
                      <icon-down v-else />
                    </template>
                    {{ collapsed ? '展开' : '收起' }}
                  </a-button>
                </a-space>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'biz:customer:save'"
                type="primary"
                @click="customerStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                新增客户
              </a-button>
              <a-button
                v-permission="'biz:customer:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="customerStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'biz:customer:export'"
                @click="customerStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                导出
              </a-button>
            </a-space>
          </a-col>
          <a-col
            v-if="appStore.device !== 'mobile'"
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => customerStore.reset()"
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
          row-key="customerId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
          :table-layout-fixed="true"
        >
          <template #customerGrade="{ record }">
            <a-rate
              :default-value="parseGrade(record.customerGrade)"
              readonly
            />
          </template>
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'biz:customer:update'"
                @click="handleRegister(record)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                <template #default>立项</template>
              </a-link>
              <a-link
                v-permission="'biz:customer:update'"
                @click="customerStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'biz:customer:update'"
                status="danger"
                @click="customerStore.handleDelete(record)"
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
          :show-total="appStore.device !== 'mobile'"
          :show-jumper="appStore.device !== 'mobile'"
          :show-page-size="appStore.device !== 'mobile'"
          :simple="appStore.device === 'mobile'"
          @change="customerStore.handleCurrentChange"
          @page-size-change="customerStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <CustomerAddOrEdit ref="addEditRef" @refresh="customerStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useDicts } from '@/hooks/dict';
  import { useCustomerStore } from '@/store/modules/lawyer/customer/customerStore';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { sysUserApi } from '@/api/sys/user';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '@/store';
  import CustomerAddOrEdit from './components/customer-add-or-edit.vue';

  const router = useRouter();
  const appStore = useAppStore();

  const { customerCategory, customerNature, customerGrade } = useDicts(
    'customerCategory',
    'customerNature',
    'customerGrade',
  );

  const customerStore = useCustomerStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(customerStore);
  const rowSelection = reactive({
    type: 'checkbox' as const,
    showCheckedAll: true,
  });

  const collapsed = ref(true);
  let userList: any[] = [];
  const loadUserList = async () => {
    const { data } = await sysUserApi.getUserList({});
    userList = data;
  };

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '序号',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 80,
      align: 'center',
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '客户编号',
      dataIndex: 'customerCode',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '客户性质',
      dataIndex: 'customerNature',
      ellipsis: true,
      tooltip: true,
      width: 120,
      render: ({ record }) => {
        const data = customerNature.value.filter(
          (item) => item.dictValue === record?.customerNature,
        );
        return data.length > 0 ? data[0].dictLabel : '';
      },
    },
    {
      title: '法人代表',
      dataIndex: 'legalPerson',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '联系人',
      dataIndex: 'legalPerson',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'contactNumber',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '维系人',
      dataIndex: 'maintainingPeopleName',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '客户等级',
      dataIndex: 'customerGrade',
      slotName: 'customerGrade',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '录入时间',
      dataIndex: 'inputTime',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '录入人',
      dataIndex: 'inputPersonName',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '简称',
      dataIndex: 'customerAbbreviation',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 200,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const handleRegister = (record: any) => {
    router.push({
      name: 'infoRegister',
      query: {
        type: 'projectApproval',
        customerId: record.customerId,
        customerName: record.customerName,
        customerCode: record.customerCode,
      },
    });
  };

  const parseGrade = (value: any) => {
    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
      const num = Number(value.trim());
      if (!Number.isNaN(num) && num >= 0 && num <= 5) {
        return num;
      }
    }

    return 0; // 默认值
  };

  onMounted(async () => {
    customerStore.fetchData();
    loadUserList();
  });
</script>

<style lang="less" scoped>
  :deep(.arco-rate) {
    font-size: 14px;

    .arco-rate-character {
      margin-right: 0;

      .arco-rate-character-right {
        color: transparent;
      }
    }
    .arco-rate-character-full {
      margin-right: 0;
      .arco-rate-character-right {
        color: rgb(var(--gold-6));
      }
    }
  }
</style>
