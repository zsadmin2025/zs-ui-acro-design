<template>
  <div class="start-process">
    <!-- 流程列表页 -->
    <template v-if="!currentDefinition">
      <zs-container layout="header-main-footer">
        <template #header>
          <a-row :gutter="[16, 16]">
            <a-col :flex="1">
              <a-form :model="searchForm" label-align="left" :auto-label-width="true">
                <a-row :gutter="[16, 16]">
                  <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                    <a-form-item label="流程名称">
                      <a-input v-model="searchForm.name" placeholder="请输入流程名称" :allow-clear="true" @press-enter="store.loadDefinitions()" />
                    </a-form-item>
                  </a-col>
                  <a-col flex="1">
                    <div style="text-align: right">
                      <a-space :size="9" wrap>
                        <a-button type="primary" @click="store.loadDefinitions()"><template #icon><icon-search /></template>搜索</a-button>
                        <a-button @click="store.resetSearch()"><template #icon><icon-refresh /></template>重置</a-button>
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
              <a-col v-for="item in definitions" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-card hoverable class="process-card" @click="store.selectProcess(item)">
                  <template #cover>
                    <div class="card-cover"><icon-file size="40" /></div>
                  </template>
                  <a-card-meta :title="item.name">
                    <template #description>
                      <div class="card-desc">
                        <p v-if="item.description">{{ item.description }}</p>
                        <a-space>
                          <a-tag color="arcoblue" size="small">v{{ item.version }}</a-tag>
                          <a-tag v-if="item.category" size="small">{{ item.category }}</a-tag>
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
          <a-page-header :title="currentDefinition.name" @back="store.goBack()">
            <template #subtitle>
              <a-space>
                <a-tag>版本 v{{ currentDefinition.version }}</a-tag>
                <a-tag v-if="currentDefinition.category">{{ currentDefinition.category }}</a-tag>
              </a-space>
            </template>
          </a-page-header>
        </template>
        <template #main-body>
          <a-spin :loading="formLoading" style="width: 100%">
            <template v-if="formType === 'DYNAMIC' && formSchema">
              <DynamicFormRenderer ref="dynamicFormRef" v-model="formData" :schema="formSchema" />
            </template>
            <template v-else-if="formType === 'BUSINESS' && store.businessFormPath">
              <component :is="store.businessComponent" v-if="store.businessComponent" v-model="formData" />
              <a-empty v-else description="业务表单组件加载中..." />
            </template>
            <a-empty v-else-if="!formLoading" description="该流程无需填写表单" />

            <a-divider />
            <a-form auto-label-width>
              <a-form-item label="抄送人">
                <ZsSelectUser v-model="ccUserIds" :multiple="true" style="max-width: 400px" @on-select="store.handleCcSelect" />
              </a-form-item>
            </a-form>
          </a-spin>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: center; padding: 16px">
            <a-space :size="12">
              <a-button @click="store.goBack()">返回</a-button>
              <a-button type="primary" :loading="submitting" @click="store.handleStart()">提交</a-button>
            </a-space>
          </div>
        </template>
      </zs-container>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useStartProcessStore } from '@/store/modules/bpm/process/startProcessStore';
import DynamicFormRenderer from '../components/DynamicFormRenderer.vue';

const store = useStartProcessStore();
const { loading, definitions, searchForm, currentDefinition, formLoading, formType, formSchema, formData, ccUserIds, submitting, dynamicFormRef } = storeToRefs(store);

onMounted(() => { store.loadDefinitions(); });
onUnmounted(() => { store.resetState(); });
</script>

<style lang="less" scoped>
.start-process { height: 100%; }
.process-card { transition: all 0.3s; &:hover { transform: translateY(-4px); } }
.card-cover {
  display: flex; align-items: center; justify-content: center; height: 100px;
  background: linear-gradient(135deg, var(--color-primary-light-4), var(--color-primary-light-2));
  color: var(--color-white);
}
.card-desc { min-height: 40px; p { margin: 0 0 8px; color: var(--color-text-2); font-size: 13px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; } }
</style>
