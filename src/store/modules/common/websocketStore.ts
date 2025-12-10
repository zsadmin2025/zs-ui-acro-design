import { defineStore } from 'pinia';
import { WebSocketConnection } from '@/types/common/websocketTypes';
import { Client, IFrame } from '@stomp/stompjs';
import { getToken, getTenantId } from '@/utils/auth';

export const useWebsocketStore = defineStore('websocket', {
  state: (): WebSocketConnection & {
    // 扩展状态，加入回调（注意：WebSocketConnection 需要兼容）
    privateMessageCallback: ((data: any) => void) | null;
    broadcastMessageCallback: ((data: any) => void) | null;
    initMessageCallback: ((data: any) => void) | null;
  } => ({
    isConnected: false,
    stompClient: null,
    unReadCount: 0,
    privateMessageCallback: null,
    broadcastMessageCallback: null,
    initMessageCallback: null,
  }),
  actions: {
    // 【新增】统一注册所有业务回调
    registerMessageHandlers() {
      // 初始化消息
      this.onInitMessage((data) => {
        // eslint-disable-next-line no-console
        console.log('[WS] 收到初始化消息:', data);
        // 可在此更新未读数、用户状态等
      });

      // 私信消息
      this.onPrivateMessage((data) => {
        // eslint-disable-next-line no-console
        console.log('[WS] 收到私信:', data);
        this.unReadCount += 1;
        // 可触发通知弹窗、播放提示音等
      });

      // 广播消息
      this.onBroadcastMessage((data) => {
        // eslint-disable-next-line no-console
        console.log('[WS] 收到系统广播:', data);
        this.unReadCount += 1;
        // 全局公告处理
      });
    },

    // 提供注册方法
    onPrivateMessage(callback: (data: any) => void) {
      this.privateMessageCallback = callback;
    },
    onBroadcastMessage(callback: (data: any) => void) {
      this.broadcastMessageCallback = callback;
    },
    onInitMessage(callback: (data: any) => void) {
      this.initMessageCallback = callback;
    },

    connect(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        if (
          this.isConnected ||
          (this.stompClient && this.stompClient.connected)
        ) {
          resolve(true);
          return;
        }

        if (!getToken()) {
          resolve(false);
          return;
        }

        // 如果已有 client 但未连接，先清理
        if (this.stompClient) {
          this.stompClient.deactivate();
        }

        const token = getToken();
        const httpUrl = import.meta.env.VITE_API_BASE_URL;
        const wsUrl = httpUrl.replace(/^http(?=s?:)/, 'ws');
        const socketEndpoint = `${wsUrl}/ws`;

        this.stompClient = new Client({
          webSocketFactory: () => new WebSocket(socketEndpoint),
          connectHeaders: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-Id': getTenantId() ?? '',
          },
          // eslint-disable-next-line no-console
          // debug: (str) => console.log('STOMP:', str),
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,

          onConnect: (frame: IFrame) => {
            // eslint-disable-next-line no-console
            console.log('WebSocket 连接已建立:', frame);
            this.isConnected = true;

            // 订阅逻辑
            this.stompClient.subscribe('/app/init', (message: any) => {
              const data = JSON.parse(message.body);
              this.initMessageCallback?.(data);
            });

            this.stompClient.subscribe(
              `/topic/${getTenantId()}/message`,
              (message: any) => {
                const data = JSON.parse(message.body);
                this.unReadCount += 1;
                this.broadcastMessageCallback?.(data);
              },
            );

            this.stompClient.subscribe(
              `/user/queue/${getTenantId()}/message`,
              (message: any) => {
                const data = JSON.parse(message.body);
                this.unReadCount += 1;
                this.privateMessageCallback?.(data);
              },
            );

            resolve(true); // 连接成功
          },

          onStompError: (frame: IFrame) => {
            // eslint-disable-next-line no-console
            console.error('STOMP error:', frame);
            this.isConnected = false;
            reject(new Error('STOMP 连接失败'));
          },

          onWebSocketClose: () => {
            this.isConnected = false;
            // 注意：这里不要 resolve/reject，因为可能是正常断开
            // 如果是首次连接失败，通常会触发 onStompError 或连接超时
          },

          // 可选：添加连接超时机制（STOMP.js 默认无超时）
        });

        // 启动连接
        this.stompClient.activate();
      });
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient?.deactivate();
        this.stompClient = null;
        this.isConnected = false;
      }
    },

    // 发送广播消息
    sendAll(data: any) {
      if (!this.stompClient?.connected) return;
      this.stompClient.publish({
        destination: '/app/sendToAll',
        body: JSON.stringify(data),
      });
    },
    // 发送私信消息
    sendUser(userId: string, data: any) {
      if (!this.stompClient?.connected) return;
      this.stompClient.publish({
        destination: `/app/sendToUser/${userId}`,
        body: JSON.stringify(data),
      });
    },
  },
});
