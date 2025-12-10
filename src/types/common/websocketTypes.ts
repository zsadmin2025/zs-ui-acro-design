export interface WebSocketConnection {
  isConnected: boolean;
  stompClient: any;
  unReadCount: number;
}
