const stage = [
  {
    id: 0,
    tournament_id: 0,
    name: "Tournament",
    type: "single_elimination",
    number: 1,
    settings: {},
  },
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateParticipantJson = (playerName) => {
  console.log(playerName);
  return playerName.map((name, index) => {
    return {
      id: index,
      tournament_id: 0,
      name: name,
    };
  });
};

const generateMatchJSON = (participantJson) => {
  let tournaments = [];
  let round_id = 0;
  let id = 0; // 각 경기의 고유 ID
  let totalPlayer = participantJson.length;

  while (totalPlayer > 1) {
    let matches = Math.floor(totalPlayer / 2); // 현재 라운드 경기 수
    let isBye = totalPlayer % 2 === 1; // 부전승 여부
    let matchCount = isBye ? matches + 1 : matches; // 부전승 포함한 경기 수

    for (let number = 1; number <= matchCount; number++) {
      tournaments.push({
        id: id++,
        number: number,
        stage_id: 0,
        group_id: 0,
        round_id: round_id,
        child_count: 0,
        status: 0,
        opponent1: {
          id: null,
        },
        opponent2: {
          id: null,
        },
      });
    }

    round_id++; // 다음 라운드로 이동
    totalPlayer = matches + (isBye ? 1 : 0); // 부전승 포함한 다음 라운드 참가자 수
  }

  return tournaments;
};

const insertParticipant = (tournamentJson, participantJson) => {
  const matchCount = Math.floor(participantJson.length / 2);
  let i;

  for (i = 0; i < matchCount; i++) {
    tournamentJson[i].opponent1.id = 2 * i;
    tournamentJson[i].opponent2.id = 2 * i + 1;
  }

  if (participantJson.length % 2 != 0)
    tournamentJson[matchCount].opponent1.id = 2 * i;
};

export {
  insertParticipant,
  shuffleArray,
  generateMatchJSON,
  generateParticipantJson,
  stage,
};
