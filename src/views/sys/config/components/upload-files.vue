<template>
  <div class="upload-files-container">
    <a-card :bordered="false">
      <a-radio-group v-model="uploadFileForm.type" direction="horizontal">
        <a-radio :value="1">本地存储</a-radio>
        <a-radio :value="2">阿里云 OSS</a-radio>
        <a-radio :value="3">腾讯云 COS</a-radio>
        <a-radio :value="4">华为云 OBS</a-radio>
      </a-radio-group>
      <a-form
        ref="uploadFileRef"
        :rules="rules"
        :model="uploadFileForm"
        auto-label-width
      >
        <div
          v-if="uploadFileForm.type === 1"
          style="margin-top: 16px; color: #888"
        >
          <a-form-item label="访问域名" field="local.domain">
            <a-input
              v-model="uploadFileForm.local.domain"
              placeholder="请输入访问域名，如：http://localhost:8080"
            />
          </a-form-item>
          <a-form-item label="存储路径" field="local.path">
            <a-input
              v-model="uploadFileForm.local.path"
              placeholder="请输入存储路径，如：windows D:/var/www/uploads  linux /var/www/uploads"
            />
          </a-form-item>
          <a-form-item label="URL前缀" field="local.prefix">
            <a-input
              v-model="uploadFileForm.local.prefix"
              placeholder="请输入URL前缀, 如：/files, 则访问地址为：http://localhost:8080/files/文件名"
            />
          </a-form-item>
        </div>

        <div
          v-if="uploadFileForm.type === 2"
          style="margin-top: 16px; color: #888"
        >
          <a-form-item label="访问域名" field="aliyun.domain">
            <a-input
              v-model="uploadFileForm.aliyun.domain"
              placeholder="请输入访问域名"
            />
          </a-form-item>
          <a-form-item label="Endpoint" field="aliyun.endpoint">
            <a-input
              v-model="uploadFileForm.aliyun.endpoint"
              placeholder="请输入EndPoint"
            />
          </a-form-item>
          <a-form-item label="Access Key ID" field="aliyun.accessKeyId">
            <a-input
              v-model="uploadFileForm.aliyun.accessKeyId"
              placeholder="请输入Access Key ID"
            />
          </a-form-item>
          <a-form-item label="Access Key Secret" field="aliyun.accessKeySecret">
            <a-input-password
              v-model="uploadFileForm.aliyun.accessKeySecret"
              placeholder="请输入Access Key Secret"
            />
          </a-form-item>
          <a-form-item label="Bucket 名称" field="aliyun.bucketName">
            <a-input
              v-model="uploadFileForm.aliyun.bucketName"
              placeholder="请输入Bucket名称"
            />
          </a-form-item>
        </div>

        <div
          v-if="uploadFileForm.type === 3"
          style="margin-top: 16px; color: #888"
        >
          <a-form-item label="访问域名" field="tencent.domain">
            <a-input
              v-model="uploadFileForm.tencent.domain"
              placeholder="请输入访问域名"
            />
          </a-form-item>
          <a-form-item label="所属地域" field="tencent.region">
            <a-input
              v-model="uploadFileForm.tencent.region"
              placeholder="请输入所属地域"
            />
          </a-form-item>
          <a-form-item label="SecretId" field="tencent.secretId">
            <a-input
              v-model="uploadFileForm.tencent.secretId"
              placeholder="请输入SecretId"
            />
          </a-form-item>
          <a-form-item label="SecretId" field="tencent.secretKey">
            <a-input
              v-model="uploadFileForm.tencent.secretKey"
              placeholder="请输入SecretKey"
            />
          </a-form-item>

          <a-form-item label="Bucket 名称" field="tencent.bucketName">
            <a-input
              v-model="uploadFileForm.tencent.bucketName"
              placeholder="请输入Bucket名称"
            />
          </a-form-item>
        </div>
        <div
          v-if="uploadFileForm.type === 4"
          style="margin-top: 16px; color: #888"
        >
          <a-form-item label="访问域名" field="huawei.domain">
            <a-input
              v-model="uploadFileForm.huawei.domain"
              placeholder="请输入访问域名"
            />
          </a-form-item>
          <a-form-item label="所属地域" field="huawei.endPoint">
            <a-input
              v-model="uploadFileForm.huawei.endPoint"
              placeholder="请输入所属地域"
            />
          </a-form-item>
          <a-form-item label="accessKey" field="huawei.accessKey">
            <a-input
              v-model="uploadFileForm.huawei.accessKey"
              placeholder="请输入accessKey"
            />
          </a-form-item>
          <a-form-item label="secretAccessKey" field="huawei.secretAccessKey">
            <a-input
              v-model="uploadFileForm.huawei.secretAccessKey"
              placeholder="请输入secretAccessKey"
            />
          </a-form-item>
          <a-form-item label="Bucket 名称" field="huawei.bucketName">
            <a-input
              v-model="uploadFileForm.huawei.bucketName"
              placeholder="请输入Bucket名称"
            />
          </a-form-item>
        </div>
      </a-form>
      <!-- 操作按钮 -->
      <div :style="{ marginTop: '24px' }">
        <a-button
          type="primary"
          style="margin-right: 8px"
          :loading="loading"
          @click="useUploadFileStore.submit()"
        >
          <template #icon>
            <icon-save />
          </template>
          保存
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { uploadFileStore } from '@/store/modules/sys/config/file/uploadFileStore';

  const useUploadFileStore = uploadFileStore();
  const { uploadFileRef, uploadFileForm, loading } =
    storeToRefs(useUploadFileStore);

  const rules = {
    'type': [{ required: true, message: '请选择存储类型', trigger: 'change' }],
    'local.domain': [
      { required: true, message: '请输入访问域名', trigger: 'blur' },
    ],
    'local.path': [
      { required: true, message: '请输入存储路径', trigger: 'blur' },
    ],
    'local.prefix': [
      { required: true, message: '请输入URL前缀', trigger: 'blur' },
    ],
    'aliyun.accessKeyId': [
      { required: true, message: '请输入Access Key ID', trigger: 'blur' },
    ],
    'aliyun.accessKeySecret': [
      { required: true, message: '请输入Access Key Secret', trigger: 'blur' },
    ],
    'aliyun.bucketName': [
      { required: true, message: '请输入Bucket名称', trigger: 'blur' },
    ],
    'aliyun.endpoint': [
      { required: true, message: '请输入EndPoint', trigger: 'blur' },
    ],
    'aliyun.domain': [
      { required: true, message: '请输入访问域名', trigger: 'blur' },
    ],
    'aliyun.prefix': [
      { required: true, message: '请输入URL前缀', trigger: 'blur' },
    ],
    'tencent.domain': [
      { required: true, message: '请输入访问域名', trigger: 'blur' },
    ],
    'tencent.region': [
      { required: true, message: '请输入所属地域', trigger: 'blur' },
    ],
    'tencent.bucketName': [
      { required: true, message: '请输入Bucket名称', trigger: 'blur' },
    ],
    'tencent.secretId': [
      { required: true, message: '请输入SecretId', trigger: 'blur' },
    ],
    'tencent.secretKey': [
      { required: true, message: '请输入SecretKey', trigger: 'blur' },
    ],
    'huawei.domain': [
      { required: true, message: '请输入访问域名', trigger: 'blur' },
    ],
    'huawei.endPoint': [
      { required: true, message: '请输入所属地域', trigger: 'blur' },
    ],
    'huawei.accessKey': [
      { required: true, message: '请输入accessKey', trigger: 'blur' },
    ],
    'huawei.secretAccessKey': [
      { required: true, message: '请输入secretAccessKey', trigger: 'blur' },
    ],
    'huawei.bucketName': [
      { required: true, message: '请输入Bucket名称', trigger: 'blur' },
    ],
  };

  onMounted(async () => {
    await useUploadFileStore.init();
  });
</script>

<style scoped>
  .upload-files-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .upload-files-container > .arco-card {
    max-width: 100%;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .upload-files-container {
      max-width: 768px;
    }
  }

  @media (min-width: 1200px) {
    .upload-files-container {
      max-width: 900px;
    }
  }
</style>
