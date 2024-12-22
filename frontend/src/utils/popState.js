let currentId = 0; // 현재 상태 ID를 추적
const stateHistory = []; // 방문한 상태 ID 기록
let currentStateIndex = -1; // 현재 위치를 추적

// 상태를 설정하고 기록
function pushState(hash) {
    currentId++; // 새로운 상태 ID 생성
    history.pushState({ id: currentId }, "", hash);
    stateHistory.splice(currentStateIndex + 1); // 현재 이후 기록 제거
    stateHistory.push(currentId); // 새로운 상태 추가
    currentStateIndex = stateHistory.length - 1; // 현재 위치 업데이트
    console.log(`Navigated to: ${hash}`);
}

// 뒤로 가기/앞으로 가기 감지
function handlePopState(event) {
    const state = event.state; // 현재 상태 가져오기
    if (!state || typeof state.id !== "number") {
        console.warn("State is undefined or invalid");
        return;
    }

    const prevStateId = stateHistory[currentStateIndex - 1];
    const nextStateId = stateHistory[currentStateIndex + 1];

    if (state.id === prevStateId) {
        console.log("Back navigation detected");
        currentStateIndex--;
    } else if (state.id === nextStateId) {
        console.log("Forward navigation detected");
        currentStateIndex++;
    } else {
        console.log("Unexpected navigation or external change");
    }
}

// 이벤트 리스너 등록
window.addEventListener("popstate", handlePopState);

// 초기화
if (!history.state) {
    pushState(location.hash || "#/"); // 초기 상태 설정
}
