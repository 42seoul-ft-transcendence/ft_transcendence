const wsConnect = (url, onMessageCallBack, onErrorCallback) => {
  const ws = new WebSocket(url);

  ws.onmessage = onMessageCallBack;
  ws.onerror = onErrorCallback;
  ws.onopen = () => {
    console.log("connected");
  };
  return ws;
};

export { wsConnect };
