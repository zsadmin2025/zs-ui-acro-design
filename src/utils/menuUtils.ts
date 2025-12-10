/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/permission.ts
export interface RawMenuItem {
  title: string;
  type: number;
  key: string;
  children?: RawMenuItem[] | null;
}

export interface TableRowNode {
  key: string;
  name: string; // Arco Table 默认读取 name / title，建议用 name
  type: number;
  children?: TableRowNode[];
  buttons?: { label: string; value: string }[]; // 仅 type=2 有
}

export function buildTreeTableData(raw: RawMenuItem[]): TableRowNode[] {
  return raw
    .map((group) => {
      if (group.type !== 1) return {} as TableRowNode;

      const children: TableRowNode[] = (group.children || [])
        .filter((menu) => menu.type === 2)
        .map((menu) => {
          const buttons = (menu.children || [])
            .filter((btn) => btn.type === 3)
            .map((btn) => ({ label: btn.title, value: btn.key }));

          return {
            key: menu.key,
            name: menu.title,
            type: menu.type,
            buttons,
            children: [], // Arco 要求非叶子节点必须有 children（可为空）
          };
        });

      return {
        key: group.key,
        name: group.title,
        type: group.type,
        children,
      };
    })
    .filter(
      (item) => item.type === 1 && item.children && item.children.length > 0,
    );
}

// utils/menuUtils.ts
// utils/menuUtils.ts

// 从原始 menuData 中，根据一组 keys，递归提取所有关联的按钮权限（type=3 的 key）
export function extractAllPermissionKeys(
  selectedKeys: string[],
  originalMenuData: RawMenuItem[],
): string[] {
  const result = new Set<string>();

  // 构建 key → node 的映射（用于快速查找）
  const keyMap = new Map<string, RawMenuItem>();
  const traverse = (nodes: RawMenuItem[]) => {
    nodes.forEach((node) => {
      keyMap.set(node.key, node);
      if (node.children) traverse(node.children);
    });
  };
  traverse(originalMenuData);

  // 对每个选中的 key，递归收集其自身及所有后代的 type=3 节点
  const collectPermissions = (key: string) => {
    const node = keyMap.get(key);
    if (!node) return;

    // 如果是按钮（type=3），直接加入
    if (node.type === 3) {
      result.add(node.key);
      return;
    }

    // 如果是菜单或分组，遍历其所有后代
    const dfs = (n: RawMenuItem) => {
      if (n.type === 3) {
        result.add(n.key);
      }
      if (n.children) {
        n.children.forEach(dfs);
      }
    };

    dfs(node);
  };

  selectedKeys.forEach(collectPermissions);
  return Array.from(result);
}

// utils/menuUtils.ts

// 构建 key -> node 映射（用于快速查找）
export function buildKeyMap(nodes: RawMenuItem[]): Map<string, RawMenuItem> {
  const map = new Map<string, RawMenuItem>();
  const traverse = (list: RawMenuItem[]) => {
    list.forEach((node) => {
      map.set(node.key, node);
      if (node.children) traverse(node.children);
    });
  };
  traverse(nodes);
  return map;
}

// 获取某节点的所有后代 keys（包括自己）
export function getAllDescendantKeys(
  key: string,
  keyMap: Map<string, RawMenuItem>,
): string[] {
  const result: string[] = [];
  const node = keyMap.get(key);
  if (!node) return result;

  const dfs = (n: RawMenuItem) => {
    result.push(n.key);
    if (n.children) {
      n.children.forEach(dfs);
    }
  };
  dfs(node);
  return result;
}

// 获取某节点的所有祖先 keys
const getAncestorKeys = (
  nodes: RawMenuItem[],
  targetKey: string,
): string | null => {
  const directParent = nodes.find((node) =>
    node.children?.some((child) => child.key === targetKey),
  );
  if (directParent) return directParent.key;

  // 使用 reduce 模拟递归查找过程
  return nodes.reduce<string | null>((acc, node) => {
    if (acc) return acc;
    if (node.children) {
      return getAncestorKeys(node.children, targetKey);
    }
    return null;
  }, null);
};
