<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="title" label="标题">
                    <a-input v-model="form.title" placeholder="标题" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="content" label="内容">
                    <a-input v-model="form.content" placeholder="内容" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="type" label="类型">
                    <a-select v-model="form.type" placeholder="请选择">
                      <a-option :value="1">通知</a-option>
                      <a-option :value="2">公告</a-option>
                      <a-option :value="3">其他</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="level" label="级别">
                    <a-select v-model="form.level" placeholder="请选择">
                      <a-option :value="1">普通</a-option>
                      <a-option :value="2">一般</a-option>
                      <a-option :value="3">紧急</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="status" label="状态">
                    <a-select v-model="form.status" placeholder="请选择">
                      <a-option :value="0">撤销</a-option>
                      <a-option :value="1">草稿</a-option>
                      <a-option :value="2">已发布</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="releaseTime" label="发布时间">
                    <a-input
                      v-model="form.releaseTime"
                      placeholder="发布时间"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="noticeStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="noticeStore.reset">
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
                v-permission="'sys:notice:save'"
                type="primary"
                @click="noticeStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'sys:notice:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="noticeStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <!-- <a-button
                v-permission="'sys:notice:export'"
                @click="noticeStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                {{ $t('searchTable.operation.download') }}
              </a-button> -->
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => noticeStore.reset()"
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
          row-key="sysNoticeId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="processData"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #title="{ record }">
            <a-link @click="noticeStore.handleInfo(record)">
              <template #icon>
                <icon-link />
              </template>
              <template #default>{{ record.title }}</template>
            </a-link>
          </template>
          <template #level="{ record }">
            <a-tag v-if="record.level === 1" color="arcoblue"> 普通 </a-tag>
            <a-tag v-if="record.level === 2" color="orangered"> 一般 </a-tag>
            <a-tag v-if="record.level === 3" color="red"> 紧急 </a-tag>
          </template>
          <template #status="{ record }">
            <a-tag v-if="record.status === 0" color="red"> 撤销 </a-tag>
            <a-tag v-if="record.status === 1" color="gray"> 草稿 </a-tag>
            <a-tag v-if="record.status === 2" color="green"> 已发布 </a-tag>
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'sys:notice:update'"
                :disabled="record.status === 2"
                @click="noticeStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:notice:delete'"
                status="danger"
                :disabled="record.status === 2"
                @click="noticeStore.handleDelete(record)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-link>

              <a-link
                v-if="record.status === 1 || record.status === 0"
                v-permission="'sys:notice:release'"
                @click="noticeStore.handleRelease(record)"
              >
                <template #icon>
                  <zs-icon icon="icon-custom-send" size="12" />
                </template>
                <template #default>发布</template>
              </a-link>
              <a-link
                v-if="record.status === 2"
                v-permission="'sys:notice:revoke'"
                @click="noticeStore.handleRevoke(record)"
              >
                <template #icon>
                  <icon-undo />
                </template>
                <template #default>撤销</template>
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
          @change="noticeStore.handleCurrentChange"
          @page-size-change="noticeStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <NoticeAddOrEdit ref="addEditRef" @refresh="noticeStore.fetchData" />
    <!-- 详情抽屉 -->
    <NoticeInfo ref="infoRef" @refresh="noticeStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useNoticeStore } from '@/store/modules/sys/notice/noticeStore';
  import NoticeAddOrEdit from './components/notice-add-or-edit.vue';
  import NoticeInfo from './components/notice-info.vue';

  const noticeStore = useNoticeStore();
  const { addEditRef, infoRef, loading, list, total, form, selectedKeys } =
    storeToRefs(noticeStore);

  const processData = computed(() =>
    list.value.map((item) => {
      return {
        ...item,
        disabled: item.status === 2, // 禁用已发布的数据
      };
    }),
  );

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
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
      title: '标题',
      dataIndex: 'title',
      slotName: 'title',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '类别',
      dataIndex: 'type',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
      render: ({ record }) => {
        switch (record.type) {
          case 1:
            return '通知';
          case 2:
            return '公告';
          case 3:
            return '其他';
          default:
            return '';
        }
      },
    },
    {
      title: '级别',
      dataIndex: 'level',
      slotName: 'level',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'releaseTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: '创建者',
      dataIndex: 'realName',
      ellipsis: true,
      tooltip: true,
      width: 100,
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
      width: 210,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    noticeStore.fetchData();
  });
</script>
