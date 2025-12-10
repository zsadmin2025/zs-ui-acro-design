<template>
  <a-modal
    v-model:visible="smsRecordVisible"
    title="发送记录"
    title-align="start"
    width="1500px"
    :draggable="true"
    body-class="modal-body-style"
    body-style="height: 70vh;"
  >
    <div>
      <zs-container layout="header-main-footer">
        <template #header>
          <a-row :gutter="16">
            <a-col :flex="1">
              <a-form :model="form" :auto-label-width="true" label-align="left">
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-form-item field="requestId" label="请求ID">
                      <a-input v-model="form.requestId" placeholder="请求ID" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item field="bizId" label="回执ID">
                      <a-input v-model="form.bizId" placeholder="回执ID" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item field="phoneNumbers" label="接收短信手机号">
                      <a-input
                        v-model="form.phoneNumbers"
                        placeholder="接收短信手机号"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
            <a-col :flex="'86px'" style="text-align: right">
              <a-space :size="18">
                <a-button type="primary" @click="smsRecordStore.fetchData">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('searchTable.form.search') }}
                </a-button>
                <a-button @click="smsRecordStore.reset">
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
                  v-permission="'system:smsRecord:export'"
                  @click="smsRecordStore.handleExport()"
                >
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
                  <div class="action-icon" @click="() => smsRecordStore.reset()"
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
            row-key="sysSmsRecordId"
            :loading="loading"
            :pagination="false"
            :columns="(columns as TableColumnData[])"
            :data="list"
            :bordered="false"
            :size="currentSize"
            :scroll="{ x: '100%', y: '100%' }"
          >
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
            @change="smsRecordStore.handleCurrentChange"
            @page-size-change="smsRecordStore.handleSizeChange"
          />
        </template>
      </zs-container>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useSmsRecordStore } from '@/store/modules/sys/messages/sms/smsRecordStore';

  const smsRecordStore = useSmsRecordStore();
  const { loading, list, total, form, selectedKeys } =
    storeToRefs(smsRecordStore);

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
      title: '请求ID',
      dataIndex: 'requestId',
      ellipsis: true,
      tooltip: true,
      width: 330,
    },
    {
      title: '回执ID',
      dataIndex: 'bizId',
      ellipsis: true,
      tooltip: true,
      width: 330,
    },
    {
      title: '接收短信手机号',
      dataIndex: 'phoneNumbers',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '短信内容',
      dataIndex: 'content',
      ellipsis: true,
      tooltip: true,
      width: 330,
    },
    {
      title: '短信模板CODE',
      dataIndex: 'templateCode',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '模板变量',
      dataIndex: 'templateParams',
      ellipsis: true,
      tooltip: true,
      width: 330,
    },
    {
      title: '短信通道/服务商',
      dataIndex: 'channel',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      ellipsis: true,
      tooltip: true,
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  const smsRecordVisible = ref(false);

  const init = (record: any) => {
    smsRecordVisible.value = true;
    form.value.templateNumber = record.templateNumber;
    smsRecordStore.fetchData();
  };

  defineExpose({
    init,
  });
</script>

<style lang="less" scoped>
  .zs-container {
    height: 100%;
  }
</style>
