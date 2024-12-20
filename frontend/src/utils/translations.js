export const translations = {
  english: {
		player: "Player",
    edit: "Edit",
    language: "Language",
    userInfo: "User Info",
    logout: "Logout",
    setting: "Setting",
    history: "History",
    friends: "Friends",
    email: "Email",
    username: "Username",
    nickname: "Nickname",
    save: "Save",
    language: "Language",
    oneVsOne: "1 vs 1",
    tournament: "Tournament",
    next: "Next",
		start:"Start",
    startGame: "Start Game",
    win: "WIN",
    twoFactor: "Two-Factor Authentication",
    tournamentDescription: "How many people do you want to play?",
		nickModalDescription: "Please enter your nickname",
		enterNick: "Enter Nickname",
  },
  korean: {
		enterNick: "닉네임 입력",
		player: "플레이어",
    edit: "편집",
    language: "언어",
    userInfo: "사용자 정보",
    logout: "로그아웃",
    setting: "설정",
    history: "히스토리",
    friends: "친구",
    email: "이메일",
    username: "사용자 이름",
    nickname: "닉네임",
    save: "저장",
    language: "언어",
    oneVsOne: "1 대 1",
    tournament: "토너먼트",
    next: "다음",
		start:"시작",
    startGame: "게임 시작",
    win: "승리",
    twoFactor: "이중 인증",
    tournamentDescription: "몇 명이서 게임을 하고 싶으신가요?",
		nickModalDescription: "닉네임을 입력해주세요",
  },
  japanese: {
		player: "プレイヤー",
    edit: "編集",
    language: "言語",
    userInfo: "ユーザー情報",
    logout: "ログアウト",
    setting: "設定",
    history: "履歴",
    friends: "友達",
    email: "メール",
    username: "ユーザー名",
    nickname: "ニックネーム",
    save: "保存",
    language: "言語",
    oneVsOne: "1 対 1",
    tournament: "トーナメント",
    next: "次へ",
		start:"スタート",
    startGame: "ゲームを開始",
    win: "勝利",
    twoFactor: "二要素認証",
    tournamentDescription: "何人でゲームをしたいですか？",
		nickModalDescription: "ニックネームを入力してください",
		enterNick: "ニックネームを入力",
  },
};

export const getTranslation = (key) => {
  const lang = localStorage.getItem("lang") || "english";

  return translations[lang]?.[key] || key;
};
