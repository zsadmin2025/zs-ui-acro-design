<template>
  <div class="start-process">
    <!-- 流程列表页 -->
    <template v-if="!currentDefinition">
      <zs-container layout="header-main-footer">
        <template #header>
          <a-row :gutter="[16, 16]">
            <a-col :flex="1">
              <a-form
                :model="searchForm"
                label-align="left"
                :auto-label-width="true"
              >
                <a-row :gutter="[16, 16]">
                  <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                    <a-form-item label="流程名称">
                      <a-input
                        v-model="searchForm.name"
                        placeholder="请输入流程名称"
                        :allow-clear="true"
                        @press-enter="loadDefinitions"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col flex="1">
                    <div style="text-align: right">
                      <a-space :size="9" wrap>
                        <a-button type="primary" @click="loadDefinitions">
                          <template #icon><icon-search /></template>
                          搜索
                        </a-button>
                        <a-button @click="resetSearch">
                          <template #icon><icon-refresh /></template>
                          重置
                        </a-button>
                      </a-space>
                    </div>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
        </template>
        <template #main-body>
          <a-spin :loading="loading" style="width: 100%">
            <a-row :gutter="[16, 16]">
              <a-col
                v-for="item in definitions"
                :key="item.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                :xl="6"
              >
                <a-card
                  hoverable
                  class="process-card"
                  @click="selectProcess(item)"
                >
                  <template #cover>
                    <div class="card-cover">
                      <icon-file size="40" />
                    </div>
                  </template>
                  <a-card-meta :title="item.name">
                    <template #description>
                      <div class="card-desc">
                        <p v-if="item.description">{{ item.description }}</p>
                        <a-space>
                          <a-tag color="arcoblue" size="small"
                            >v{{ item.version }}</a-tag
                          >
                          <a-tag v-if="item.category" size="small">{{
                            item.category
                          }}</a-tag>
                        </a-space>
                      </div>
                    </template>
                  </a-card-meta>
                </a-card>
              </a-col>
              <a-col v-if="definitions.length === 0 && !loading" :span="24">
                <a-empty description="暂无可发起的流程" />
              </a-col>
            </a-row>
          </a-spin>
        </template>
      </zs-container>
    </template>

    <!-- 发起流程表单页 -->
    <template v-else>
      <zs-container layout="header-main-footer">
        <template #header>
          <a-page-header
            :title="currentDefinition.name"
            @back="currentDefinition = null"
          >
            <template #subtitle>
              <a-space>
                <a-tag>版本 v{{ currentDefinition.version }}</a-tag>
                <a-tag v-if="currentDefinition.category">{{
                  currentDefinition.category
                }}</a-tag>
              </a-space>
            </template>
          </a-page-header>
        </template>
        <template #main-body>
          <a-spin :loading="formLoading" style="width: 100%">
            <!-- 动态表单 -->
            <template v-if="formType === 'DYNAMIC' && formSchema">
              <DynamicFormRenderer
                ref="dynamicFormRef"
                v-model="formData"
                :schema="formSchema"
              />
            </template>
            <!-- 业务表单（动态组件加载） -->
            <template v-else-if="formType === 'BUSINESS' && businessFormPath">
              <component
                :is="businessComponent"
                v-if="businessComponent"
                v-model="formData"
              />
              <a-empty v-else description="业务表单组件加载中..." />
            </template>
            <a-empty
              v-else-if="!formLoading"
              description="该流程无需填写表单"
            />

            <!-- 抄送人 -->
            <a-divider />
            <a-form auto-label-width>
              <a-form-item label="抄送人">
                <ZsSelectUser
                  v-model="ccUserIds"
                  :multiple="true"
                  style="max-width: 400px"
                  @on-select="handleCcSelect"
                />
              </a-form-item>
            </a-form>
          </a-spin>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: center; padding: 16px">
            <a-space :size="12">
              <a-button @click="currentDefinition = null">返回</a-button>
              <a-button
                type="primary"
                :loading="submitting"
                @click="handleStart"
              >
                提交
              </a-button>
            </a-space>
          </div>
        </template>
      </zs-container>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, shallowRef, defineAsyncComponent } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { bpmProcessApi } from '@/api/bpm/process';
  import type { ProcessDefinition, FormSchema } from '@/types/bpm/bpmTypes';
  import DynamicFormRenderer from '../components/DynamicFormRenderer.vue';

  const loading = ref(false);
  const definitions = ref<ProcessDefinition[]>([]);
  const searchForm = ref({ name: '' });

  // 当前选中的流程
  const currentDefinition = ref<ProcessDefinition | null>(null);
  const formLoading = ref(false);
  const formType = ref<'DYNAMIC' | 'BUSINESS' | null>(null);
  const formSchema = ref<FormSchema | null>(null);
  const businessFormPath = ref('');
  const businessComponent = shallowRef<any>(null);
  const formData = ref<Record<string, any>>({});
  const ccUserIds = ref<string[]>([]);
  const submitting = ref(false);
  const dynamicFormRef = ref();

  const loadDefinitions = async () => {
    loading.value = true;
    try {
      const { data } = await bpmProcessApi.getDefinitions(searchForm.value);
      definitions.value = data?.data ?? data ?? [];
    } finally {
      loading.value = false;
    }
  };

  const resetSearch = () => {
    searchForm.value = { name: '' };
    loadDefinitions();
  };

  const selectProcess = async (item: ProcessDefinition) => {
    currentDefinition.value = item;
    formLoading.value = true;
    formData.value = {};
    try {
      const { data } = await bpmProcessApi.getDefinitionByKey(item.key);
      const detail = data?.data ?? data;
      const startForm = detail?.formConfig?.startForm;
      if (startForm) {
        formType.value = startForm.type;
        if (startForm.type === 'DYNAMIC') {
          formSchema.value = startForm.formSchema ?? null;
        } else if (startForm.type === 'BUSINESS') {
          businessFormPath.value = startForm.businessFormPath ?? '';
          if (businessFormPath.value) {
            // 动态加载业务表单组件
            businessComponent.value = defineAsyncComponent(() =>
              import(`@/views/${businessFormPath.value}.vue`).catch(() => {
                Message.error('业务表单组件加载失败');
                return Promise.resolve(null);
              }),
            );
          }
        }
      } else {
        formType.value = null;
      }
    } finally {
      formLoading.value = false;
    }
  };

  const handleCcSelect = (val: any) => {
    if (val) {
      if (Array.isArray(val)) {
        ccUserIds.value = val.map((v: any) => v.userId);
      } else {
        ccUserIds.value = [val.userId];
      }
    }
  };

  const handleStart = async () => {
    if (!currentDefinition.value) return;

    // 动态表单校验
    if (formType.value === 'DYNAMIC' && dynamicFormRef.value) {
      const errors = await dynamicFormRef.value.validate();
      if (errors) {
        Message.warning('请完善表单信息');
        return;
      }
    }

    submitting.value = true;
    try {
      await bpmProcessApi.startProcess(currentDefinition.value.key, {
        formData: formData.value,
        ccUserIds: ccUserIds.value,
      });
      Message.success('流程发起成功');
      currentDefinition.value = null;
      formData.value = {};
      ccUserIds.value = [];
    } catch {
      // error handled by interceptor
    } finally {
      submitting.value = false;
    }
  };

  onMounted(() => {
    loadDefinitions();
  });
</script>

<style lang="less" scoped>
  .start-process {
    height: 100%;

    .process-card {
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      .card-cover {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        background: linear-gradient(
          135deg,
          var(--color-primary-light-4),
          var(--color-primary-light-2)
        );
        color: var(--color-white);
      }

      .card-desc {
        min-height: 40px;

        p {
          margin: 0 0 8px;
          color: var(--color-text-2);
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
</style>
