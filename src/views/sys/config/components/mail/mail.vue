<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button type="primary" @click="handleMailConfig()">
                <template #icon>
                  <icon-settings />
                </template>
                邮件配置
              </a-button>
              <a-button
                v-permission="'sys:mailTasks:save'"
                type="primary"
                @click="mailTasksStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                发送邮件
              </a-button>
              <a-button
                v-permission="'sys:mailTasks:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="mailTasksStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'sys:mailTasks:export'"
                @click="mailTasksStore.handleExport()"
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
              <a-input
                v-model="form.subject"
                placeholder="邮件主题"
                @input="handleInput"
              />
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => mailTasksStore.reset()"
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
          row-key="sysMailTasksId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <a-tag v-if="record.status === 1" color="orange">草稿箱</a-tag>
            <a-tag v-else-if="record.status === 2" color="arcoblue"
              >已发送</a-tag
            >
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link
                v-permission="'sys:mailTasks:update'"
                :disabled="record.status === 2"
                @click="mailTasksStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:mailTasks:delete'"
                status="danger"
                @click="mailTasksStore.handleDelete(record)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-link>
              <a-link
                v-permission="'sys:mailTasks:sendNow'"
                status="normal"
                :disabled="record.status === 2"
                @click="mailTasksStore.handleSend(record)"
              >
                <template #icon>
                  <icon-send />
                </template>
                <template #default>发送</template>
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
          @change="mailTasksStore.handleCurrentChange"
          @page-size-change="mailTasksStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <MailSend ref="addEditRef" @refresh="mailTasksStore.fetchData" />
    <MailConfig ref="mailConfigRef" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useMailTasksStore } from '@/store/modules/sys/mail/mailTasksStore';
  import MailSend from './mail-send.vue';
  import MailConfig from './mail-config.vue';

  const mailTasksStore = useMailTasksStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(mailTasksStore);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const mailConfigRef = ref<InstanceType<typeof MailConfig> | null>(null);

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
      title: '邮件主题',
      dataIndex: 'subject',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '发件人邮箱地址',
      dataIndex: 'sender',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '发件人姓名',
      dataIndex: 'senderName',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '收件人列表',
      dataIndex: 'recipients',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '抄送列表',
      dataIndex: 'cc',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '密送列表',
      dataIndex: 'bcc',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '使用的邮件模板表',
      dataIndex: 'templateId',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      width: 120,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 240,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  const handleInput = (value: string) => {
    form.value.subject = value;
    mailTasksStore.fetchData();
  };

  const handleMailConfig = () => {
    if (mailConfigRef.value) {
      mailConfigRef.value.init();
    }
  };

  onMounted(() => {
    mailTasksStore.fetchData();
  });
</script>
