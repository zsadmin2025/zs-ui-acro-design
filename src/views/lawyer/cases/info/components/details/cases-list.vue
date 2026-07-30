<template>
  <div class="item-container">
    <div class="item-title">
      <h2>卷内文件目录</h2>
      <div class="item-title-label">{{ '(' + caseLabel + ')' }}</div>
    </div>
    <a-card
      title="附件"
      :header-style="{
        background: '#fafafa',
        fontSize: '16px',
        fontWeight: 'bold',
      }"
    >
      <a-table
        :data="tableData"
        :columns="columns"
        :bordered="false"
        :pagination="false"
      >
        <template #operation="{ record }">
          <a-space>
            <a-upload
              v-if="type === 'edit'"
              v-permission="'cases:infoList:save'"
              :custom-request="(file: RequestOption) => customRequest(file, record)"
              :show-file-list="false"
            >
              <template #upload-button>
                <a-space>
                  <a-link>上传</a-link>
                </a-space>
              </template>
            </a-upload>
            <a-link
              @click="
                downloadFile(record.basicFileUrl, record.basicFileOriginalName)
              "
            >
              模板下载
            </a-link>
          </a-space>
        </template>
        <template #basicFileName="{ record }">
          <a-space>
            <span>
              {{ record.basicFileName }}
            </span>
          </a-space>
        </template>
        <template #fileName="{ record }">
          <a-space>
            <a-link @click="downloadFile(record.fileUrl, record.fileName)">
              {{ record.fileName }}
            </a-link>
          </a-space>
        </template>
        <template #operations="{ record }">
          <a-space v-if="type === 'edit'">
            <a-link
              v-permission="'cases:infoList:delete'"
              status="danger"
              @click="useInfoListStore().handleDelete(record, emits)"
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
  import { storeToRefs } from 'pinia';
  import { InfoList } from '@/types/lawyer/cases/infoList/infoListTypes';
  import type { RequestOption } from '@arco-design/web-vue/es/upload/interfaces';
  import { sysFilesApi } from '@/api/sys/files';
  import { useInfoListAddOrEditStore } from '@/store/modules/lawyer/cases/infoList/infoListAddOrEditStore';
  import { useInfoListStore } from '@/store/modules/lawyer/cases/infoList/infoListStore';
  import download from '@/utils/fileDownload';
  import { useDicts } from '@/hooks/dict';

  const infoListAddOrEditStore = useInfoListAddOrEditStore();
  const { form } = storeToRefs(infoListAddOrEditStore);

  const props = defineProps<{
    caseInfo: any;
    caseInfoList: InfoList[];
    type?: string; // 用于区分详情和编辑
  }>();
  const { getLabel } = useDicts('caseType');
  const tableData = computed(() => props.caseInfoList);
  const caseLabel = computed(() =>
    getLabel('caseType', props.caseInfo.caseType),
  );

  const columns = [
    {
      title: '操作',
      dataIndex: 'operation',
      slotName: 'operation',
      align: 'center' as const,
      width: 160,
    },
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      align: 'center' as const,
      render: ({ rowIndex }: { rowIndex: number }) => `${rowIndex + 1}`,
    },
    {
      title: '目录',
      dataIndex: 'basicFileName',
      slotName: 'basicFileName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '文件',
      dataIndex: 'fileName',
      slotName: 'fileName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '上传人',
      dataIndex: 'creator',
      ellipsis: true,
      tooltip: true,
      width: 200,
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
      align: 'center' as const,
      fixed: 'right' as const,
      width: 100,
    },
  ];

  const downloadFile = async (url: string, fileName: string) => {
    download.url(url, fileName);
  };

  const emits = defineEmits(['refreshDetails']);

  // 自定义上传逻辑
  const customRequest = (
    options: RequestOption,
    record: any,
  ): { abort: () => void } => {
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
        form.value.caseInfoId = props.caseInfo?.caseInfoId ?? '';
        form.value.caseListId = record?.basicCaseListId ?? '';
        form.value.caseListFileName = record?.basicFileName ?? '';
        form.value.caseListFileUrl = record?.basicFileUrl ?? '';
        form.value.fileName = res.data?.fileOriginalName;
        form.value.fileUrl = res.data?.fileUrl;
        // 进行上传
        infoListAddOrEditStore.submit(emits);
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();

    return {
      abort: () => controller.abort(),
    };
  };

  onMounted(() => {});
</script>

<style scoped lang="less">
  .item-container {
    padding: 0 20px 20px 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
    .item-title {
      display: flex;
      align-items: center;
      justify-content: center;

      .item-title-label {
        margin-left: 10px;
      }
    }
  }
</style>
