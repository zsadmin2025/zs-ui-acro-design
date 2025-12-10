<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="type" label="消息类型">
                    <a-select v-model="form.type" placeholder="请选择">
                      <a-option :value="1" label="站内信" />
                      <a-option :value="2" label="通知" />
                      <a-option :value="3" label="待办" />
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="title" label="主题">
                    <a-input v-model="form.title" placeholder="主题" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="isRead" label="是否已读">
                    <a-select v-model="form.isRead" placeholder="请选择">
                      <a-option :value="0" label="未读" />
                      <a-option :value="1" label="已读" />
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="messagesStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="messagesStore.reset">
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
                v-permission="'system:messages:save'"
                type="primary"
                @click="messagesStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'system:messages:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="messagesStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'system:messages:export'"
                @click="messagesStore.handleExport()"
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
                <div class="action-icon" @click="() => messagesStore.reset()"
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
          row-key="sysMessageId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #type="{ record }">
            <span v-if="record.type === 1"> 站内信 </span>
            <span v-else-if="record.type === 2"> 通知 </span>
            <span v-else-if="record.type === 3"> 待办 </span>
            <span v-else> 未知 </span>
          </template>
          <template #isRead="{ record }">
            <a-tag v-if="record.isRead === 0"> 未读 </a-tag>
            <a-tag v-else-if="record.isRead === 1" color="green"> 已读 </a-tag>
            <a-tag v-else> 未知 </a-tag>
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'system:messages:update'"
                @click="messagesStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'system:messages:delete'"
                status="danger"
                @click="messagesStore.handleDelete(record)"
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
          @change="messagesStore.handleCurrentChange"
          @page-size-change="messagesStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <MessagesAddOrEdit ref="addEditRef" @refresh="messagesStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useMessagesStore } from '@/store/modules/sys/messages/message/messagesStore';
  import MessagesAddOrEdit from './messages-add-or-edit.vue';

  const messagesStore = useMessagesStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(messagesStore);

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
      title: '消息类型',
      dataIndex: 'type',
      slotName: 'type',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '发送者',
      dataIndex: 'senderName',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    {
      title: '接收者',
      dataIndex: 'receiverName',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    {
      title: '主题',
      dataIndex: 'title',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '是否已读',
      dataIndex: 'isRead',
      slotName: 'isRead',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '阅读时间',
      dataIndex: 'readTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
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
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    messagesStore.fetchData();
  });
</script>
