import { DictData } from '@/types/sys/dict/DictData';

const useDict = async (dictType: string): Promise<DictData[]> => {
  const rawDictDataMap = localStorage.getItem('dictDataMap');
  if (!rawDictDataMap) {
    return [];
  }

  try {
    const parsedData = JSON.parse(rawDictDataMap);
    const dictList = parsedData?.dictDataMap?.[dictType];
    return Array.isArray(dictList) ? dictList : [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('解析字典数据失败:', error);
    return [];
  }
};

export default useDict;
