<template>
  <div class="files-container">
    <a-card
      title="附件"
      :header-style="{
        background: '#fafafa',
        fontSize: '16px',
        fontWeight: 'bold',
      }"
    >
      <template #extra>
        <a-upload
          v-if="type === 'edit'"
          :custom-request="customRequest"
          :show-file-list="false"
        >
          <template #upload-button>
            <a-space>
              <a-button type="primary">
                <template #icon>
                  <icon-plus />
                </template>
                <template #default>上传</template>
              </a-button>
            </a-space>
          </template>
        </a-upload>
      </template>
      <a-table
        :data="tableData"
        :columns="columns"
        :bordered="false"
        :pagination="false"
      >
        <template #fileSource="{ record }">
          <span v-if="record.fileSource === '0'">其他</span>
          <span v-else-if="record.fileSource === '1'">案件信息</span>
          <span v-else-if="record.fileSource === '2'">开庭信息</span>
          <span v-else-if="record.fileSource === '3'">合同信息</span>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-link
              v-permission="'cases:infoFiles:select'"
              @click="downloadFile(record.fileUrl, record.fileName)"
            >
              查看
            </a-link>
            <a-link
              v-permission="'cases:infoFiles:download'"
              @click="downloadFile(record.fileUrl, record.fileName)"
            >
              下载
            </a-link>
            <a-link
              v-if="type === 'edit'"
              v-permission="'cases:infoFiles:delete'"
              status="danger"
              @click="useInfoFilesStore().handleDelete(record, emits)"
            >
              删除
            </a-link>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { InfoFiles } from '@/types/lawyer/cases/infoFiles/infoFilesTypes';
  import download from '@/utils/fileDownload';
  import { useInfoFilesAddOrEditStore } from '@/store/modules/lawyer/cases/infoFiles/infoFilesAddOrEditStore';
  import { useInfoFilesStore } from '@/store/modules/lawyer/cases/infoFiles/infoFilesStore';
  import type { RequestOption } from '@arco-design/web-vue/es/upload/interfaces';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { sysFilesApi } from '@/api/sys/files';
  import { storeToRefs } from 'pinia';

  const infoFilesAddOrEditStore = useInfoFilesAddOrEditStore();
  const { form } = storeToRefs(infoFilesAddOrEditStore);

  const props = defineProps<{
    caseInfoId: string;
    caseInfoFiles: InfoFiles[];
    type?: string; // 用于区分详情和编辑
  }>();

  const columns: TableColumnData[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      render: ({ rowIndex }: { rowIndex: number }) => `${rowIndex + 1}`,
    },
    {
      title: '附件名称',
      dataIndex: 'fileName',
    },
    {
      title: '附件来源',
      dataIndex: 'fileSource',
      slotName: 'fileSource',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      fixed: 'right',
      width: 200,
    },
  ];

  const tableData = computed(() => props.caseInfoFiles);

  const downloadFile = async (url: string, fileName: string) => {
    download.url(url, fileName);
  };

  const emits = defineEmits(['refreshDetails']);
  // 自定义上传逻辑
  const customRequest = (options: RequestOption): { abort: () => void } => {
    const controller = new AbortController();

    (async () => {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'file',
      } = options;
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);

      try {
        onProgress(20);
        const res = await sysFilesApi.upload(formData);
        // 添加表单
        form.value.caseInfoId = props.caseInfoId;
        form.value.fileSource = '0';
        form.value.fileName = res.data?.fileOriginalName;
        form.value.fileType = res.data?.fileType;
        form.value.fileSize = res.data?.fileSize;
        form.value.fileUrl = res.data?.fileUrl;
        // 进行上传
        infoFilesAddOrEditStore.submit(emits);
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();

    return {
      abort: () => controller.abort(),
    };
  };
</script>

<style scoped lang="less">
  .files-container {
    padding: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
  }
</style>
