type TargetContext = '_self' | '_parent' | '_blank' | '_top';

export const openWindow = (
  url: string,
  opts?: { target?: TargetContext; [key: string]: any },
) => {
  const { target = '_blank', ...others } = opts || {};
  window.open(
    url,
    target,
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue;
        return [...preValue, `${key}=${value}`];
      }, [])
      .join(','),
  );
};

export const regexUrl = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i',
);

/**
 * 递归查找树结构中指定值的节点
 * @param tree 树结构
 * @param targetValue 目标值
 * @returns 找到的节点
 */
export const findInTree = (
  tree: Array<{ dictValue: any; dictLabel: any; children?: any }>,
  targetValue: any,
): { dictValue: any; children?: any } | null => {
  return tree.reduce((found, node) => {
    if (found) return found;
    if (node.dictValue === targetValue) return node;
    if (node.children && Array.isArray(node.children)) {
      const result: { dictValue: any; children?: any } | null = findInTree(
        node.children,
        targetValue,
      );
      if (result) return result;
    }
    return null;
  }, null as { dictValue: any; children?: any } | null);
};

/**
 * 格式化毫秒时长为可读字符串
 * 只展示最高位和下一个非零位，如: 9秒、3分钟、1小时28分钟、3天12分钟
 * @param millis 毫秒数
 */
export const formatDuration = (millis: number | null | undefined): string => {
  if (millis == null || millis < 0) return '-';
  const totalSeconds = Math.floor(millis / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);
  if (seconds > 0 && parts.length === 0) parts.push(`${seconds}秒`);

  return parts.slice(0, 2).join('') || '0秒';
};
