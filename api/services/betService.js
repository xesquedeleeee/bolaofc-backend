import AppError from "../errors/AppError.js";

const calcPoints = (predictedHome, predictedAway, homeScore, awayScore) => {
  if (homeScore === null || awayScore === null) return 0;
  if (predictedHome === homeScore && predictedAway === awayScore) return 3;
  const betWinner =
    predictedHome > predictedAway ? "home" :
    predictedHome < predictedAway ? "away" : "draw";
  const matchWinner =
    homeScore > awayScore ? "home" :
    homeScore < awayScore ? "away" : "draw";
  return betWinner === matchWinner ? 1 : 0;
};

export const getAll = async (userId, models) => {
  return await models.Bet.findAll({
    where: { userId },
    include: [models.Match],
  });
};

export const getById = async (id, userId, models) => {
  return await models.Bet.findOne({
    where: { id, userId },
    include: [models.Match],
  });
};

export const create = async (data, userId, models) => {
  const match = await models.Match.findByPk(data.matchId);
  if (!match) throw new AppError("Partida não encontrada.", 404);

  const existingBet = await models.Bet.findOne({
    where: { userId, matchId: data.matchId },
  });
  if (existingBet) {
    throw new AppError("Você já fez um palpite para esta partida.", 409);
  }
  const championship = await models.Championship.findByPk(match.championshipId);
  if (championship && championship.userId === userId) {
    throw new AppError(
      "O criador da liga não pode dar palpites para manter o equilíbrio da competição.",
      403
    );
  }

  const points = calcPoints(
    data.predictedHome,
    data.predictedAway,
    match.homeScore,
    match.awayScore
  );
  return await models.Bet.create({ ...data, userId, points });
};

export const update = async (id, data, userId, models) => {
  const bet = await models.Bet.findOne({ where: { id, userId } });
  if (!bet) throw new AppError("Palpite não encontrado ou sem permissão.", 404);
  const match = await models.Match.findByPk(bet.matchId);
  const points = calcPoints(
    data.predictedHome,
    data.predictedAway,
    match.homeScore,
    match.awayScore
  );
  return await bet.update({ ...data, points });
};

export const remove = async (id, userId, models) => {
  const bet = await models.Bet.findOne({ where: { id, userId } });
  if (!bet) throw new AppError("Palpite não encontrado ou sem permissão.", 404);
  await bet.destroy();
  return true;
};

export const getRanking = async (models) => {
  const bets = await models.Bet.findAll({
    include: [{ model: models.User, attributes: ["id", "name", "email"] }],
  });

  const ranking = {};
  bets.forEach((bet) => {
    const uid = bet.userId;
    if (!ranking[uid]) {
      ranking[uid] = {
        user: bet.user,
        totalPoints: 0,
        totalBets: 0,
      };
    }
    ranking[uid].totalPoints += bet.points;
    ranking[uid].totalBets += 1;
  });

  return Object.values(ranking).sort((a, b) => b.totalPoints - a.totalPoints);
};