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
