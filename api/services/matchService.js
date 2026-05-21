
import AppError from "../errors/AppError.js";
import { Op } from "sequelize";

const parseBrazilianDate = (dateStr) => {
  if (!dateStr) return null;

  // Aceita formato DD/MM/YYYY HH:MM ou DD/MM/YYYY
  const brDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/;
  const match = dateStr.match(brDateRegex);

  if (match) {
    const [, day, month, year, hour = "00", minute = "00"] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`);
  }

  // Se já for ISO ou outro formato válido, aceita direto
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;

  return null;
};

export const getAll = async (models, userId = null) => {
  const now = new Date();

  if (userId) {
    // Busca apenas partidas futuras das ligas que o usuário participa
    const memberships = await models.LeagueMember.findAll({
      where: { userId },
      attributes: ["championshipId"],
    });

    const championshipIds = memberships.map((m) => m.championshipId);

    return await models.Match.findAll({
      where: {
        championshipId: { [Op.in]: championshipIds },
        matchDate: { [Op.gt]: now },
      },
      include: [models.Championship],
      order: [["matchDate", "ASC"]],
    });
  }

  return await models.Match.findAll({
    include: [models.Championship],
    order: [["matchDate", "ASC"]],
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

  const parsedDate = parseBrazilianDate(data.matchDate);
  if (!parsedDate) throw new AppError("Data inválida. Use o formato DD/MM/YYYY HH:MM ou DD/MM/YYYY.", 400);

  return await models.Match.create({ ...data, matchDate: parsedDate });
};

export const update = async (id, data, models) => {
  const match = await models.Match.findByPk(id);
  if (!match) return null;

  if (data.matchDate) {
    const parsedDate = parseBrazilianDate(data.matchDate);
    if (!parsedDate) throw new AppError("Data inválida. Use o formato DD/MM/YYYY HH:MM.", 400);
    data.matchDate = parsedDate;
  }

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