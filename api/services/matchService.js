// ─── ALEXIS ───────────────────────────────────────────────────────────────────
// Responsável: Alexis

import AppError from "../errors/AppError.js";

export const getAll = async (models) => {
  return await models.Match.findAll({
    include: [models.Championship],
  });
};

export const getById = async (id, models) => {
  return await models.Match.findByPk(id, {
    include: [models.Championship],
  });
};

export const create = async (data, models) => {
  const championship = await models.Championship.findByPk(data.championshipId);
  if (!championship) throw new AppError("Campeonato não encontrado.", 404);
  return await models.Match.create(data);
};

export const update = async (id, data, models) => {
  const match = await models.Match.findByPk(id);
  if (!match) return null;
  return await match.update(data);
};

export const remove = async (id, models) => {
  const match = await models.Match.findByPk(id);
  if (!match) return null;
  await match.destroy();
  return true;
};

export const getBets = async (id, models) => {
  const match = await models.Match.findByPk(id, {
    include: [models.Bet],
  });
  if (!match) return null;
  return match.bets;
};