export function createWebSocketManager() {
  let socket = null;
  let url = `wss://${window.location.host}/ws/`;
  let reconnectTimeout = null;
  const callbacks = {
    onOpen: null,
    onMessage: null,
    onClose: null,
    onError: null,
    // WebSocket 초기화 함수
  };

  function init(urlParams = "") {
    console.log("Initializing WebSocket...");
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      console.warn("WebSocket is already open.");
      return;
    }
    socket = new WebSocket(url + urlParams);
    url = urlParams;

    // WebSocket 이벤트 핸들러 등록
    socket.onopen = () => {
      console.log("WebSocket connected.");
      if (callbacks.onOpen) callbacks.onOpen();
    };

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      if (callbacks.onMessage) callbacks.onMessage(event);
    };

    socket.onclose = (event) => {
      console.warn("WebSocket closed:", event.reason);
      if (callbacks.onClose) callbacks.onClose(event);
      if (!event.wasClean) {
        console.log("Reconnecting WebSocket...");
        reconnect(); // 연결이 비정상적으로 종료된 경우 재연결 시도
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      if (callbacks.onError) callbacks.onError(error);
      socket.close(); // 오류 발생 시 소켓 종료
    };
  }

  // WebSocket 재연결 함수
  function reconnect() {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    reconnectTimeout = setTimeout(() => {
      console.log("Attempting to reconnect...");
      init(); // WebSocket 재생성
    }, 3000); // 3초 후 재연결
  }

  // WebSocket에 메시지 보내기
  function sendMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      console.log("Message sent:", message);
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  }

  // WebSocket 종료 함수
  function close() {
    if (socket) {
      socket.close();
      socket = null;
      console.log("WebSocket closed manually.");
    }
  }

  // 상태 확인 함수
  function getStatus() {
    if (!socket) return "CLOSED";
    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "OPEN";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  }

  // 콜백 등록 함수
  function on(event, callback) {
    if (callbacks.hasOwnProperty(event)) {
      callbacks[event] = callback;
    } else {
      console.warn(`Unsupported event: ${event}`);
    }
  }

  // 클로저를 통해 WebSocket 관리 기능 반환
  return {
    init,
    sendMessage,
    close,
    getStatus,
    on,
  };
}

// WebSocket 매니저 생성 및 사용
export const loginSocket = createWebSocketManager();
export const pongSocket = createWebSocketManager();
