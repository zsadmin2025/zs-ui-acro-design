import { ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { bpmSettingModelApi } from '@/api/bpm/setting/model';
import { bpmSettingCategoryApi } from '@/api/bpm/setting/category';
import { bpmTaskMyProcessApi } from '@/api/bpm/task/my-process';
import type {
  ProcessDefinition,
  ProcessCategoryItem,
} from '@/types/bpm/bpmTypes';

export interface StartProcessState {
  definitions: ProcessDefinition[];
  loading: boolean;
  searchForm: { processName: string };
  currentDefinition: ProcessDefinition | null;
  formLoading: boolean;
  formType: number | null; // 1=动态表单, 2=业务表单
  formRule: any[];
  formOption: any;
  businessFormRoute: string;
  businessComponent: any;
  formData: Record<string, any>;
  ccUserIds: string[];
  submitting: boolean;
  dynamicFormRef: any;
  // 分类相关
  categories: ProcessCategoryItem[];
  categoryLoading: boolean;
  selectedCategory: string | null;
  // 流程图相关
  modelJson: string;
  activeTab: string; // form | diagram
}

export const useStartProcessStore = defineStore('startProcess', {
  state: (): StartProcessState => ({
    definitions: [],
    loading: false,
    searchForm: { processName: '' },
    currentDefinition: null,
    formLoading: false,
    formType: null,
    formRule: [],
    formOption: {},
    businessFormRoute: '',
    businessComponent: shallowRef(null),
    formData: {},
    ccUserIds: [],
    submitting: false,
    dynamicFormRef: ref(null),
    // 分类相关
    categories: [],
    categoryLoading: false,
    selectedCategory: null,
    // 流程图相关
    modelJson: '',
    activeTab: 'form',
  }),
  getters: {
    filteredDefinitions(): ProcessDefinition[] {
      if (!this.selectedCategory) {
        return this.definitions;
      }
      return this.definitions.filter(
        (def) => def.categoryId === this.selectedCategory,
      );
    },
  },
  actions: {
    async loadDefinitions() {
      this.loading = true;
      try {
        const { data } = await bpmSettingModelApi.getCanStartProcessList(
          this.searchForm,
        );
        this.definitions = data?.data ?? data ?? [];
      } finally {
        this.loading = false;
      }
    },
    resetSearch() {
      this.searchForm = { processName: '' };
      this.loadDefinitions();
    },
    async loadCategories() {
      this.categoryLoading = true;
      try {
        const { data } = await bpmSettingCategoryApi.getCategoryPage({
          current: 1,
          pageSize: 999,
        });
        const result = data?.data ?? data;
        this.categories = result?.list ?? result?.records ?? [];
      } finally {
        this.categoryLoading = false;
      }
    },
    selectCategory(categoryId: string | null) {
      this.selectedCategory = categoryId;
    },
    async selectProcess(item: ProcessDefinition) {
      this.currentDefinition = item;
      this.formLoading = true;
      this.formData = {};
      this.businessComponent = shallowRef(null);
      this.activeTab = 'form';
      try {
        // 根据 formId 判断表单类型
        if (item.formId) {
          // 有 formId 表示动态表单
          this.formType = 1;
          this.formRule = item.formRule ? JSON.parse(item.formRule) : [];
          this.formOption = item.formOption ? JSON.parse(item.formOption) : {};
        } else {
          // 无 formId 表示业务表单，需要根据其他逻辑判断路由
          this.formType = 2;
          this.businessFormRoute = '';
        }
        // 加载流程图数据
        this.modelJson = item.modelJson || '';
      } finally {
        this.formLoading = false;
      }
    },
    handleCcSelect(val: any) {
      if (val) {
        const arr = Array.isArray(val) ? val : [val];
        this.ccUserIds = arr.map((u: any) => u.userId);
      }
    },
    async handleStart(formData: Record<string, any>) {
      this.submitting = true;
      try {
        await bpmTaskMyProcessApi.startProcess({
          processDefinitionId: this.currentDefinition?.processDefinitionId,
          processKey: this.currentDefinition?.processKey,
          variables: formData,
          ccUserIds: this.ccUserIds,
        });
        Message.success('流程发起成功');
        this.currentDefinition = null;
        this.formData = {};
        this.ccUserIds = [];
        this.activeTab = 'form';
      } finally {
        this.submitting = false;
      }
    },
    goBack() {
      this.currentDefinition = null;
    },
    resetState() {
      this.$reset();
    },
  },
});
