/**
 * 工作流设计器状态管理
 */
import { defineStore } from 'pinia';
import type { NodeConfig, NodeUser, DrawerState, FormField } from '../types';

export interface WorkflowState {
  tableId: number | string;
  isTried: boolean;
  promoterDrawer: boolean;
  flowPermission1: DrawerState<NodeUser[]>;
  approverDrawer: boolean;
  approverConfig1: DrawerState<NodeConfig>;
  copyerDrawer: boolean;
  copyerConfig1: DrawerState<NodeConfig>;
  conditionDrawer: boolean;
  conditionsConfig1: DrawerState<NodeConfig & { priorityLevel?: number }>;
  formFields: FormField[];
}

export const useStore = defineStore('workflowStore', {
  state: (): WorkflowState => ({
    tableId: '',
    isTried: false,
    promoterDrawer: false,
    flowPermission1: { flag: false, id: null, value: null },
    approverDrawer: false,
    approverConfig1: { flag: false, id: null, value: null },
    copyerDrawer: false,
    copyerConfig1: { flag: false, id: null, value: null },
    conditionDrawer: false,
    conditionsConfig1: { flag: false, id: null, value: null },
    formFields: [],
  }),

  actions: {
    setTableId(payload: number | string) {
      this.tableId = payload;
    },

    setIsTried(payload: boolean) {
      this.isTried = payload;
    },

    setPromoter(payload: boolean) {
      this.promoterDrawer = payload;
    },

    setFlowPermission(payload: DrawerState<NodeUser[]>) {
      this.flowPermission1 = payload;
    },

    setApprover(payload: boolean) {
      this.approverDrawer = payload;
    },

    setApproverConfig(payload: DrawerState<NodeConfig>) {
      this.approverConfig1 = payload;
    },

    setCopyer(payload: boolean) {
      this.copyerDrawer = payload;
    },

    setCopyerConfig(payload: DrawerState<NodeConfig>) {
      this.copyerConfig1 = payload;
    },

    setCondition(payload: boolean) {
      this.conditionDrawer = payload;
    },

    setConditionsConfig(
      payload: DrawerState<NodeConfig & { priorityLevel?: number }>,
    ) {
      this.conditionsConfig1 = payload;
    },

    setFormFields(payload: FormField[]) {
      this.formFields = payload;
    },
  },
});
