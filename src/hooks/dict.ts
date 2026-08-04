import { computed, type Ref } from 'vue';
import { DictData } from '@/types/sys/dict/DictData';
import { useDictDataStore } from '@/store/modules/sys/dict/dictDataStore';
import { findInTree } from '@/utils/index';

const useDict = async (dictType: string): Promise<DictData[]> => {
  try {
    const dictStore = useDictDataStore();
    const dictList = dictStore.dictDataMap?.[dictType];
    return Array.isArray(dictList) ? dictList : [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('获取字典数据失败:', error);
    return [];
  }
};

/** 批量加载字典的类型映射 */
type DictRefs<T extends string[]> = {
  [K in T[number]]: Ref<DictData[]>;
};

/** 批量加载字典增强结果 */
type UseDictsResult<T extends string[]> = DictRefs<T> & {
  /** 根据 dictType + dictValue 获取 dictLabel（自动适配树形/扁平） */
  getLabel: (type: T[number], value: any) => string;
};

/**
 * 批量加载多个数据字典（一次解析 JSON，零额外请求）
 *
 * @example
 * ```ts
 * const { caseType, proxyStage, getLabel } = useDicts('caseType', 'proxyStage');
 * // 表单绑定时直接使用 ref
 * <a-cascader :options="caseType" />
 * // 表格渲染时一键取标签
 * getLabel('caseType', record.caseType)  // => '民事诉讼'
 * ```
 */
export const useDicts = <T extends string[]>(
  ...types: T
): UseDictsResult<T> => {
  const dictStore = useDictDataStore();

  const result: any = {};

  // 使用 computed 从响应式 store 读取，字典数据更新后自动响应
  types.forEach((t) => {
    result[t] = computed(() => dictStore.dictDataMap[t] || []);
  });

  // 根据 dictType + dictValue 取 label（树形/扁平自适应）
  result.getLabel = (type: string, value: any): string => {
    if (value === undefined || value === null) return '--';
    const dict = result[type]?.value;
    if (!dict) return '--';
    const node = findInTree(dict, value);
    return node?.dictLabel ?? '--';
  };

  return result as UseDictsResult<T>;
};

export default useDict;
