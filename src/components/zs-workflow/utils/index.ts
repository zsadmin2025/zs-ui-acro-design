/* eslint-disable class-methods-use-this */
class All {
  timer: string | number = '';

  debounce(fn: (...args: any[]) => void, delay = 500) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    return function debounced(this: any, arg: any) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const args = arg;
      clearTimeout(self.timer as number);
      self.timer = window.setTimeout(() => {
        fn.call(that, args);
      }, delay);
    };
  }

  setCookie(val: Record<string, string>[]) {
    for (let i = 0, len = val.length; i < len; i += 1) {
      const keys = Object.keys(val[i]);
      for (let j = 0; j < keys.length; j += 1) {
        const key = keys[j];
        document.cookie = `${key}=${encodeURIComponent(val[i][key])}; path=/`;
      }
    }
  }

  getCookie(name: string) {
    const strCookie = document.cookie;
    const arrCookie = strCookie.split('; ');
    for (let i = 0, len = arrCookie.length; i < len; i += 1) {
      const arr = arrCookie[i].split('=');
      if (name === arr[0]) {
        return decodeURIComponent(arr[1]);
      }
    }
    return undefined;
  }

  clearCookie(name: string[]) {
    const myDate = new Date();
    myDate.setTime(-1000);
    for (let i = 0, len = name.length; i < len; i += 1) {
      document.cookie = `${
        name[i]
      }=''; path=/; expires=${myDate.toUTCString()}`;
    }
  }

  arrToStr(arr: { name: string }[] | undefined) {
    if (arr) {
      return arr
        .map((item) => {
          return item.name;
        })
        .toString();
    }
    return undefined;
  }

  toggleClass(arr: any[], elem: any, key = 'id') {
    return arr.some((item) => {
      return item[key] === elem[key];
    });
  }

  toChecked(arr: any[], elem: any, key = 'id') {
    const isIncludes = this.toggleClass(arr, elem, key);
    if (!isIncludes) {
      arr.push(elem);
    } else {
      this.removeEle(arr, elem, key);
    }
  }

  removeEle(arr: any[], elem: any, key = 'id') {
    let includesIndex: number | undefined;
    arr.forEach((item, index) => {
      if (item[key] === elem[key]) {
        includesIndex = index;
      }
    });
    if (includesIndex !== undefined) {
      arr.splice(includesIndex, 1);
    }
  }

  // 设置审批人字符串
  setApproverStr(nodeConfig: any) {
    if (nodeConfig.settype === 1) {
      if (nodeConfig.nodeUserList && nodeConfig.nodeUserList.length > 0) {
        return `指定成员：${this.arrToStr(nodeConfig.nodeUserList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 2) {
      if (nodeConfig.nodeRoleList && nodeConfig.nodeRoleList.length > 0) {
        return `指定角色：${this.arrToStr(nodeConfig.nodeRoleList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 3) {
      if (nodeConfig.nodePostList && nodeConfig.nodePostList.length > 0) {
        return `指定岗位：${this.arrToStr(nodeConfig.nodePostList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 4) {
      if (
        nodeConfig.nodeDeptHeadList &&
        nodeConfig.nodeDeptHeadList.length > 0
      ) {
        return `部门负责人：${this.arrToStr(nodeConfig.nodeDeptHeadList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 5) {
      return '发起人自选';
    }
    if (nodeConfig.settype === 6) {
      return '发起人自己';
    }
    if (nodeConfig.settype === 7) {
      return '直属上级';
    }
    if (nodeConfig.settype === 8) {
      return '表单内人员';
    }
    if (nodeConfig.settype === 9) {
      if (nodeConfig.conditionExpression) {
        return `流程表达式：${nodeConfig.conditionExpression}`;
      }
      return undefined;
    }
    return undefined;
  }

  dealStr(str: string, obj: Record<string, { value: string }>) {
    const arr: string[] = [];
    const list = str.split(',');
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      const elem = keys[i];
      list.forEach((item) => {
        if (item === elem) {
          arr.push(obj[elem].value);
        }
      });
    }
    return arr.join('或');
  }

  /** 判断是否为数值类字段 */
  isNumericRule(rule: Record<string, any>): boolean {
    const columnType = String(rule.columnType ?? '').toLowerCase();
    const showType = String(rule.showType ?? '').toLowerCase();
    const numericColumnTypes = [
      'double',
      'number',
      'integer',
      'int',
      'long',
      'decimal',
      'float',
    ];
    const numericShowTypes = ['inputnumber', 'number', 'slider', 'rate'];
    return (
      numericColumnTypes.includes(columnType) ||
      numericShowTypes.includes(showType)
    );
  }

  /** 判断是否为多选/下拉类字段 */
  isMultiSelectRule(rule: Record<string, any>): boolean {
    const showType = String(rule.showType ?? '');
    return showType === '3' || showType === 'checkbox';
  }

  /** 格式化单条条件规则为展示文本 */
  formatRuleStr(rule: Record<string, any>): string {
    const { showName, optType, zdy1, opt1, zdy2, opt2, fixedDownBoxValue } =
      rule;
    const name = showName || '字段';

    if (this.isMultiSelectRule(rule)) {
      if (zdy1 && fixedDownBoxValue) {
        try {
          const options = JSON.parse(fixedDownBoxValue);
          return `${name}属于：${this.dealStr(zdy1, options)}`;
        } catch {
          return `${name}属于：${zdy1}`;
        }
      }
      if (zdy1) {
        return `${name}属于：${zdy1}`;
      }
      return '';
    }

    if (this.isNumericRule(rule)) {
      const optNum = Number(optType);
      if (optNum === 6 && zdy1 && zdy2) {
        return `${zdy1} ${opt1 || '<'} ${name} ${opt2 || '<'} ${zdy2}`;
      }
      if (zdy1) {
        const optTypeStr = ['', '<', '>', '≤', '=', '≥'][optNum] || '=';
        return `${name} ${optTypeStr} ${zdy1}`;
      }
      return '';
    }

    if (zdy1) {
      const optNum = Number(optType) || 4;
      const optTypeStr =
        ['', '<', '>', '≤', '=', '≥'][optNum] || (optNum === 6 ? '介于' : '=');
      if (optNum === 6 && zdy2) {
        return `${zdy1} ${opt1 || '<'} ${name} ${opt2 || '<'} ${zdy2}`;
      }
      return `${name} ${optTypeStr} ${zdy1}`;
    }

    return '';
  }

  /** 判断指定索引之前是否有任意条件配置了规则 */
  hasPriorConditionRules(nodeConfig: any, index: number): boolean {
    if (!nodeConfig?.conditionNodes || index <= 0) return false;
    for (let i = 0; i < index; i += 1) {
      const n = nodeConfig.conditionNodes[i];
      if (
        (n.conditionRules && n.conditionRules.length > 0) ||
        (n.conditionList && n.conditionList.length > 0) ||
        n.expression ||
        n.conditionExpression
      ) {
        return true;
      }
    }
    return false;
  }

  conditionStr(nodeConfig: any, index: number) {
    const conditionNode = nodeConfig?.conditionNodes?.[index];
    if (!conditionNode) return '请设置条件';

    const {
      conditionList,
      conditionExpression,
      expression,
      conditionRules,
      groupRelation,
    } = conditionNode;

    // 优先使用新格式的 expression
    const expr = expression || conditionExpression;
    if (expr) {
      return `表达式:${expr}`;
    }

    // 使用新格式的 conditionRules 或旧格式的 conditionList
    const rules = conditionRules || conditionList || [];
    if (rules.length === 0) {
      // 末位条件且前面已有条件配置了规则 → 其他情况（默认分支）
      if (
        index === nodeConfig.conditionNodes.length - 1 &&
        nodeConfig.conditionNodes.length > 1 &&
        this.hasPriorConditionRules(nodeConfig, index)
      ) {
        return '不满足其他条件，进入此分支';
      }
      return '请设置条件';
    }

    // 根据 groupRelation 确定连接词：true/undefined=且(并且)，false=或(或者)
    const isAnd = groupRelation !== false;
    const joinWord = isAnd ? ' 并且 ' : ' 或者 ';

    let str = '';
    for (let i = 0; i < rules.length; i += 1) {
      const ruleStr = this.formatRuleStr(rules[i] || {});
      if (ruleStr) {
        str += `${ruleStr}${joinWord}`;
      }
    }

    if (!str) {
      // 末位条件且前面已有条件配置了规则 → 其他情况（默认分支）
      if (
        index === nodeConfig.conditionNodes.length - 1 &&
        nodeConfig.conditionNodes.length > 1 &&
        this.hasPriorConditionRules(nodeConfig, index)
      ) {
        return '不满足其他条件，进入此分支';
      }
      return '请设置条件';
    }

    // 去掉末尾的连接词
    str = str.substring(0, str.length - joinWord.length);

    return str;
  }

  // 节点抄送人字符串
  copyerStr(nodeConfig: any) {
    if (nodeConfig.settype === 1) {
      if (nodeConfig.nodeUserList && nodeConfig.nodeUserList.length > 0) {
        return `指定成员：${this.arrToStr(nodeConfig.nodeUserList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 2) {
      if (nodeConfig.nodeRoleList && nodeConfig.nodeRoleList.length > 0) {
        return `指定角色：${this.arrToStr(nodeConfig.nodeRoleList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 3) {
      if (nodeConfig.nodePostList && nodeConfig.nodePostList.length > 0) {
        return `指定岗位：${this.arrToStr(nodeConfig.nodePostList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 4) {
      if (
        nodeConfig.nodeDeptHeadList &&
        nodeConfig.nodeDeptHeadList.length > 0
      ) {
        return `部门负责人：${this.arrToStr(nodeConfig.nodeDeptHeadList)}`;
      }
      return undefined;
    }
    if (nodeConfig.settype === 5) {
      return '发起人自选';
    }
    if (nodeConfig.settype === 6) {
      return '发起人自己';
    }
    if (nodeConfig.settype === 7) {
      return '直属上级';
    }
    if (nodeConfig.settype === 8) {
      return '表单内人员';
    }
    if (nodeConfig.settype === 9) {
      if (nodeConfig.conditionExpression) {
        return `流程表达式：${nodeConfig.conditionExpression}`;
      }
      return undefined;
    }
    return undefined;
  }

  toggleStrClass(item: any, key: string) {
    const a = item.zdy1 ? item.zdy1.split(',') : [];
    return a.some((val: string) => {
      return val === key;
    });
  }

  /**
   * 校验审批人节点配置，返回详细错误信息
   * @returns 通过返回 null，失败返回错误消息字符串
   */
  validateApprover(nodeConfig: any): string | null {
    const { settype } = nodeConfig;
    if (!settype) return '请选择审批人类型';

    if (settype === 1) {
      if (!nodeConfig.nodeUserList || nodeConfig.nodeUserList.length === 0) {
        return '请选择至少一名审批人';
      }
    } else if (settype === 2) {
      if (!nodeConfig.nodeRoleList || nodeConfig.nodeRoleList.length === 0) {
        return '请选择至少一个角色';
      }
    } else if (settype === 3) {
      if (!nodeConfig.nodePostList || nodeConfig.nodePostList.length === 0) {
        return '请选择至少一个岗位';
      }
    } else if (settype === 4) {
      if (
        !nodeConfig.nodeDeptHeadList ||
        nodeConfig.nodeDeptHeadList.length === 0
      ) {
        return '请选择至少一个部门负责人';
      }
    } else if (settype === 9) {
      if (!nodeConfig.conditionExpression) {
        return '请输入流程表达式';
      }
    }

    // 校验会签百分比
    if (nodeConfig.examineMode === 2) {
      const pct = nodeConfig.signPct;
      if (pct === undefined || pct === null || pct < 1 || pct > 100) {
        return '会签百分比需在 1-100 之间';
      }
    }

    return null;
  }

  /**
   * 校验抄送人节点配置，返回详细错误信息
   * @returns 通过返回 null，失败返回错误消息字符串
   */
  validateCopyer(nodeConfig: any): string | null {
    const { settype } = nodeConfig;
    if (!settype) return '请选择抄送人类型';

    if (settype === 1) {
      if (!nodeConfig.nodeUserList || nodeConfig.nodeUserList.length === 0) {
        return '请选择至少一名抄送人';
      }
    } else if (settype === 2) {
      if (!nodeConfig.nodeRoleList || nodeConfig.nodeRoleList.length === 0) {
        return '请选择至少一个角色';
      }
    } else if (settype === 3) {
      if (!nodeConfig.nodePostList || nodeConfig.nodePostList.length === 0) {
        return '请选择至少一个岗位';
      }
    } else if (settype === 4) {
      if (
        !nodeConfig.nodeDeptHeadList ||
        nodeConfig.nodeDeptHeadList.length === 0
      ) {
        return '请选择至少一个部门负责人';
      }
    } else if (settype === 9) {
      if (!nodeConfig.conditionExpression) {
        return '请输入流程表达式';
      }
    }

    return null;
  }

  /**
   * 校验条件节点配置，返回详细错误信息
   * @returns 通过返回 null，失败返回错误消息字符串
   */
  validateCondition(nodeConfig: any, index: number): string | null {
    const conditionNode = nodeConfig?.conditionNodes?.[index];
    if (!conditionNode) return '条件节点不存在';

    // 末位条件分支允许为空（作为 "其他情况" 默认分支）
    const isLastBranch =
      index === nodeConfig.conditionNodes.length - 1 &&
      nodeConfig.conditionNodes.length > 1;

    if (isLastBranch && this.hasPriorConditionRules(nodeConfig, index)) {
      return null; // 默认分支，无需校验
    }

    // 条件表达式模式
    const expr = conditionNode.expression || conditionNode.conditionExpression;
    if (
      conditionNode.configMode === 'expression' ||
      (!conditionNode.configMode && expr)
    ) {
      if (!expr) {
        return '请输入条件表达式';
      }
      return null;
    }

    // 条件组模式
    const rules =
      conditionNode.conditionRules || conditionNode.conditionList || [];
    if (rules.length === 0) {
      return '请设置至少一个条件规则';
    }

    // 校验每条规则
    for (let i = 0; i < rules.length; i += 1) {
      const rule = rules[i];
      if (!rule.columnId) {
        return `请选择第 ${i + 1} 条规则的表单字段`;
      }
      // 非复选框类型需要输入值
      if (rule.showType !== '3' && !rule.zdy1) {
        return `请输入第 ${i + 1} 条规则的条件值`;
      }
    }

    return null;
  }

  /** 审批节点是否存在配置错误 */
  isApproverNodeError(nodeConfig: any): boolean {
    return this.validateApprover(nodeConfig) !== null;
  }

  /** 抄送节点是否存在配置错误 */
  isCopyerNodeError(nodeConfig: any): boolean {
    return this.validateCopyer(nodeConfig) !== null;
  }

  /** 条件分支是否存在配置错误 */
  isConditionNodeError(nodeConfig: any, index: number): boolean {
    return this.validateCondition(nodeConfig, index) !== null;
  }
}

export default new All();
