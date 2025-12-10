<template>
  <a-drawer
    :visible="dialogFormVisible"
    width="50%"
    unmount-on-close
    @cancel="noticeAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysNoticeId ? '新增通知公告' : '修改通知公告' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="标题" field="title">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item label="类型" field="type">
        <a-radio-group v-model="form.type" placeholder="请选择公告类型">
          <a-radio :value="1">通知</a-radio>
          <a-radio :value="2">公告</a-radio>
          <a-radio :value="3">其他</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="等级" field="level">
        <a-radio-group v-model="form.level" placeholder="请选择公告类型">
          <a-radio :value="1">普通</a-radio>
          <a-radio :value="2">一般</a-radio>
          <a-radio :value="3">紧急</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="接收者" field="receivingType">
        <div style="width: 100%">
          <div>
            <a-radio-group
              v-model="form.receivingType"
              @change="noticeAddOrEditStore.handleReceivingTypeChange"
            >
              <a-radio :value="1">全体用户</a-radio>
              <a-radio :value="2">指定用户</a-radio>
              <a-radio :value="3">指定角色</a-radio>
              <a-radio :value="4">指定部门</a-radio>
              <a-radio :value="5">指定岗位</a-radio>
            </a-radio-group>
          </div>
          <ZsGap height="10" />
          <div>
            <ZsSelectUser
              v-if="form.receivingType === 2"
              v-model="form.receiverIds"
              multiple
            />
            <a-select
              v-if="form.receivingType === 3"
              v-model="form.receiverIds"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="5"
              placeholder="请选择角色"
              style="width: 100%"
            >
              <a-option
                v-for="item in roleData"
                :key="item.sysRoleId"
                :label="item.roleName"
                :value="item.sysRoleId"
              >
              </a-option>
            </a-select>

            <a-tree-select
              v-if="form.receivingType === 4"
              v-model="form.receiverIds"
              :data="deptTreeData"
              :tree-checkable="true"
              :allow-search="true"
              :allow-clear="true"
              style="width: 100%"
              :field-names="{
                key: 'sysDeptId',
                title: 'deptName',
                children: 'children',
              }"
              placeholder="请选择部门"
            />

            <a-tree-select
              v-if="form.receivingType === 5"
              v-model="form.receiverIds"
              :data="processedDeptPostTreeData"
              :multiple="true"
              :allow-search="true"
              :allow-clear="true"
              :max-tag-count="5"
              style="width: 100%"
              :field-names="{
                key: 'id',
                title: 'name',
                children: 'children',
              }"
              placeholder="请选择岗位"
            />
          </div>
        </div>
      </a-form-item>
      <a-form-item label="内容" field="content">
        <ZsEditor v-model="form.content" @change="handleEditorChange" />
      </a-form-item>
      <a-form-item label="附件" field="files">
        <zs-upload-files
          v-model="form.files"
          multiple
          style="width: 100%"
          @add="handleAddFile"
          @remove="handleRemoveFile"
        />
      </a-form-item>
      <!-- <a-form-item label="发布时间" field="releaseTime">
        <a-date-picker v-model="form.releaseTime" />
      </a-form-item> -->
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="noticeAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          status="warning"
          :loading="loading"
          @click="noticeAddOrEditStore.handleSaveDraft(emits)"
        >
          保存草稿
        </a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="noticeAddOrEditStore.submit(emits)"
        >
          立即发布
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useNoticeAddOrEditStore } from '@/store/modules/sys/notice/noticeAddOrEditStore';
  import { useRoleStore } from '@/store/modules/sys/role/roleStore';
  import { useDeptStore } from '@/store/modules/sys/dept/deptStore';

  const noticeAddOrEditStore = useNoticeAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } =
    storeToRefs(noticeAddOrEditStore);

  // 角色store
  const roleStore = useRoleStore();
  const { roleData } = storeToRefs(roleStore);

  // 部门
  const deptStore = useDeptStore();
  const { deptTreeData, deptPostTreeData } = storeToRefs(deptStore);
  const handleEditorChange = (val: string) => {
    form.value.content = val;
  };

  // 在 onBeforeMount 或数据处理函数中
  const processTreeData = (data: any[]) => {
    return data.map((item) => {
      const processedItem = { ...item };
      // 如果有子节点，则禁用复选框
      if (item.children && item.children.length > 0) {
        processedItem.selectable = false;
        processedItem.children = processTreeData(item.children);
      }
      return processedItem;
    });
  };
  // 使用处理后的数据
  const processedDeptPostTreeData = computed(() => {
    return processTreeData(deptPostTreeData.value);
  });

  const emits = defineEmits(['refresh']);

  const handleAddFile = (fileItem: any) => {
    form.value.files.push({
      fileName: fileItem.fileName,
      fileOriginalName: fileItem.fileOriginalName,
      fileType: fileItem.fileType,
      fileSize: fileItem.fileSize,
      fileUrl: fileItem.fileUrl,
      filePath: fileItem.filePath,
    });
  };

  const handleRemoveFile = (fileItem: any) => {
    // 删除成功后，将文件信息从 form.value.contractFileList 中删除
    form.value.files = form.value.files.filter(
      (item: any) => item.fileUrl !== fileItem.fileUrl,
    );
  };

  onBeforeMount(async () => {
    await roleStore.loadRoleList();
    await deptStore.loadDeptTreeData();
    await deptStore.loadDeptPostTree();
  });

  defineExpose({
    init: noticeAddOrEditStore.init,
    form,
  });
</script>
