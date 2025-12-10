<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="templateNumber" label="模板编号">
                    <a-input
                      v-model="form.templateNumber"
                      placeholder="模板编号"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="channel" label="短信通道/服务商">
                    <a-select
                      v-model="form.channel"
                      placeholder="请选择短信通道/服务商"
                    >
                      <a-option
                        v-for="item in smsCarrier"
                        :key="item.dictValue"
                        :value="item.dictValue"
                      >
                        {{ item.dictLabel }}
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="signName" label="短信签名">
                    <a-input v-model="form.signName" placeholder="短信签名" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="templateCode" label="短信模板code">
                    <a-input
                      v-model="form.templateCode"
                      placeholder="短信模板code"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="templateStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="templateStore.reset">
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
                v-permission="'system:smsTemplate:save'"
                type="primary"
                @click="templateStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'system:smsTemplate:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="templateStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'system:smsTemplate:export'"
                @click="templateStore.handleExport()"
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
                <div class="action-icon" @click="() => templateStore.reset()"
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
          row-key="sysSmsTemplateId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #channel="{ record }">
            <a-tag color="arcoblue">
              {{
                smsCarrier.find((item) => item.dictValue === record.channel)
                  ?.dictLabel ?? ''
              }}
            </a-tag>
          </template>
          <template #status="{ record }">
            <ZsStatus :status="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link
                v-permission="'system:smsTemplate:update'"
                @click="templateStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'system:smsTemplate:delete'"
                status="danger"
                @click="templateStore.handleDelete(record)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-link>
              <a-link
                v-permission="'system:smsTemplate:send'"
                @click="handleOpenSend(record)"
              >
                <template #icon>
                  <icon-send />
                </template>
                <template #default>发送</template>
              </a-link>
              <a-link
                v-permission="'system:smsRecord:page'"
                @click="handleSmsRecord(record)"
              >
                <template #icon>
                  <icon-eye />
                </template>
                <template #default>发送记录</template>
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
          @change="templateStore.handleCurrentChange"
          @page-size-change="templateStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <TemplateAddOrEdit ref="addEditRef" @refresh="templateStore.fetchData" />
    <TemplateSend ref="smsSendRef" @refresh="templateStore.fetchData" />
    <TemplateSmsRecord ref="smsRecordRef" @refresh="templateStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useTemplateStore } from '@/store/modules/sys/messages/sms/smsTemplateStore';
  import useDict from '@/hooks/dict';
  import { DictData } from '@/types/sys/dict/DictData';
  import TemplateAddOrEdit from './template-add-or-edit.vue';
  import TemplateSend from './template-send.vue';
  import TemplateSmsRecord from './template-sms-record.vue';

  const templateStore = useTemplateStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(templateStore);

  const smsSendRef = ref<InstanceType<typeof TemplateSend>>();
  const smsRecordRef = ref<InstanceType<typeof TemplateSmsRecord>>();
  // 短信服务商
  const smsCarrier = ref<DictData[]>([]);

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
      title: '模板编号',
      dataIndex: 'templateNumber',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '短信通道/服务商',
      dataIndex: 'channel',
      slotName: 'channel',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: '短信签名',
      dataIndex: 'signName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '短信模板code',
      dataIndex: 'templateCode',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '短信模板内容',
      dataIndex: 'templateContent',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 300,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  async function loadDicts() {
    smsCarrier.value = await useDict('smsCarrier');
  }

  const handleOpenSend = (record: any) => {
    smsSendRef.value?.open(record);
  };

  const handleSmsRecord = (record: any) => {
    smsRecordRef.value?.init(record);
  };

  onMounted(() => {
    loadDicts();
    templateStore.fetchData();
  });
</script>
