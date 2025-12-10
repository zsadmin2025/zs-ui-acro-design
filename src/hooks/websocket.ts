import { Client, IFrame } from '@stomp/stompjs';
import { getToken, getTenantId } from '@/utils/auth';

export default function useWebsocket() {
  let stompClient: any = null;
  const isConnected = ref(false);

  // 内部工具：检查是否已连接
  const checkConnected = (): boolean => {
    if (!stompClient || !isConnected.value) {
      // eslint-disable-next-line no-console
      console.warn('WebSocket 未连接，操作被忽略');
      return false;
    }
    return true;
  };

  const connect = () => {
    // 已经连接则返回
    if (isConnected.value || (stompClient && stompClient.connected)) return;

    // 如果已有 client 但未连接（比如之前断开了），可以复用或销毁重建
    if (stompClient) {
      stompClient.deactivate(); // 确保旧的被关闭
    }

    const token = getToken();
    // 未登录则返回
    if (!token) return;

    // 将 HTTP(S) 转为 WS(S)
    const httpUrl = import.meta.env.VITE_API_BASE_URL;
    const wsUrl = httpUrl.replace(/^http(?=s?:)/, 'ws'); // 自动处理 http -> ws, https -> wss
    const socketEndpoint = `${wsUrl}/ws`;
    stompClient = new Client({
      webSocketFactory: () => new WebSocket(socketEndpoint),
      connectHeaders: {
        'Authorization': `Bearer ${token}`, // 登录token
        'X-Tenant-Id': getTenantId() ?? '', // 租户ID,
      },
      // eslint-disable-next-line no-console
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000, // 重连间隔
      heartbeatIncoming: 4000, // 心跳间隔
      heartbeatOutgoing: 4000, // 心跳间隔
      onConnect: (frame: IFrame) => {
        // eslint-disable-next-line no-console
        console.log('WebSocket 连接成功', frame);
        isConnected.value = true;

        stompClient.subscribe('/app/init', (message: any) =>
          // eslint-disable-next-line no-console
          console.log(`初始化订阅消息: ${message.body}`),
        );
        stompClient.subscribe(
          `/topic/${getTenantId()}/message`,
          // eslint-disable-next-line no-console
          (message: any) => console.log(`多租户订阅广播消息: ${message.body}`),
        );
        stompClient.subscribe(
          `/user/queue/${getTenantId()}/message`,
          // eslint-disable-next-line no-console
          (message: any) => console.log(`多租户订阅私信消息: ${message.body}`),
        );
      },
      onStompError: (frame: IFrame) => {
        // eslint-disable-next-line no-console
        console.error('STOMP error:', frame);
        isConnected.value = false;
      },
      onDisconnect: () => {
        // eslint-disable-next-line no-console
        console.log('WebSocket 断开连接');
        isConnected.value = false;
      },
      onWebSocketClose: () => {
        // eslint-disable-next-line no-console
        console.log('WebSocket 连接已关闭');
        isConnected.value = false;
      },
    });
    stompClient.activate();
  };

  // 发送广播(群聊)消息
  const sendAll = (data: any) => {
    if (!checkConnected()) return;
    stompClient.publish({
      destination: `/app/sendToAll`,
      body: JSON.stringify(data),
    });
  };

  // 发送私信消息(私信)
  const sendUser = (receiverId: string, data: any) => {
    if (!checkConnected()) return;
    stompClient.publish({
      destination: `/app/sendToUser/${receiverId}`,
      body: JSON.stringify(data),
    });
  };

  // 发送二进制
  const sendBinary = (binaryData: Uint8Array) => {
    if (!checkConnected()) return;
    if (!(binaryData instanceof Uint8Array)) {
      // eslint-disable-next-line no-console
      console.error('sendBinary 需传入 Uint8Array');
      return;
    }
    stompClient.publish({
      destination: `/app/sendBinary`,
      binaryBody: binaryData,
      headers: {
        'X-Tenant-Id': getTenantId(),
        'content-type': 'application/octet-stream',
      },
    });
  };

  // 断开连接
  const disconnect = () => {
    if (stompClient) {
      stompClient.deactivate();
      // onWebSocketClose 会自动置 null，但保险起见
      stompClient = null;
      isConnected.value = false;
    }
  };

  return { connect, sendAll, sendUser, disconnect, isConnected, sendBinary };
}
