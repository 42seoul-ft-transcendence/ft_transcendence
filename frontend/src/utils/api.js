function getCSRFToken() {
  let cookieValue = null; // 기본값
  const cookies = document.cookie.split(";"); // 쿠키 문자열을 ';'로 분리
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); // 공백 제거

    // 'csrftoken='으로 시작하는 쿠키를 찾음
    if (cookie.startsWith("csrftoken=")) {
      cookieValue = cookie.substring("csrftoken=".length);
      break;
    }
  }

  return cookieValue;
}

export const apiCall = async (url, method, data = null) => {
  const csrfToken = getCSRFToken();
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };

  const init = {
    method,
    credentials: "include",
    headers,
  };

  if (data) {
    init.body = JSON.stringify(data);
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error("HTTP status " + res.status);
  }

  return await res.json();
};
