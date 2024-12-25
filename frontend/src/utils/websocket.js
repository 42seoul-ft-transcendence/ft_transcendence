export default class WebSocketClient {
  constructor(url) {
    this.socket = new WebSocket(url);
  }

  connect(onMessage, onOpen = () => {}, onClose = () => {}) {
    this.socket.onopen = onOpen;
    this.socket.onmessage = (event) => onMessage(JSON.parse(event.data));
    this.socket.onclose = onClose;
  }

  send(message) {
    this.socket.send(JSON.stringify(message));
  }
}
