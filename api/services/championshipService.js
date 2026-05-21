import AppError from "../errors/AppError.js";

export const getAll = async (models) => {
  return await models.Championship.findAll({
    include: [
      {
        model: models.User,
        attributes: ["id", "name", "email"],
      },
    ],
  });
};

export const getById = async (id, models) => {
  return await models.Championship.findByPk(id, {
    include: [
      models.Match,
      {
        model: models.User,
        attributes: ["id", "name", "email"],
      },
      {
        model: models.LeagueMember,
        include: [{ model: models.User, attributes: ["id", "name", "email"] }],
      },
    ],
  });
};

export const create = async (data, userId, models) => {
  const championship = await models.Championship.create({ ...data, userId });

  await models.LeagueMember.create({
    userId,
    championshipId: championship.id,
    role: "owner",
  });

  return championship;
};

export const update = async (id, data, userId, models) => {
  const championship = await models.Championship.findByPk(id);
  if (!championship) return null;
  if (championship.userId !== userId)
    throw new AppError("Sem permissão. Apenas o dono pode editar a liga.", 403);
  return await championship.update(data);
};

export const remove = async (id, userId, models) => {
  const championship = await models.Championship.findByPk(id);
  if (!championship) return null;
  if (championship.userId !== userId)
    throw new AppError("Sem permissão. Apenas o dono pode deletar a liga.", 403);
  await championship.destroy();
  return true;
};

export const getMatches = async (id, models) => {
  const championship = await models.Championship.findByPk(id, {
    include: [models.Match],
  });
  if (!championship) return null;
  return championship.matches;
};

export const join = async (championshipId, userId, models) => {
  const championship = await models.Championship.findByPk(championshipId);
  if (!championship) throw new AppError("Liga não encontrada.", 404);

  const existing = await models.LeagueMember.findOne({
    where: { championshipId, userId },
  });
  if (existing) throw new AppError("Você já participa desta liga.", 409);

  return await models.LeagueMember.create({
    userId,
    championshipId,
    role: "member",
  });
};

export const leave = async (championshipId, userId, models) => {
  const member = await models.LeagueMember.findOne({
    where: { championshipId, userId },
  });
  if (!member) throw new AppError("Você não participa desta liga.", 404);
  if (member.role === "owner")
    throw new AppError("O dono não pode sair da liga. Delete-a.", 403);
  await member.destroy();
  return true;
};

export const getMembers = async (id, models) => {
  const championship = await models.Championship.findByPk(id);
  if (!championship) throw new AppError("Liga não encontrada.", 404);

  return await models.LeagueMember.findAll({
    where: { championshipId: id },
    include: [{ model: models.User, attributes: ["id", "name", "email"] }],
  });
};

export const getUserLeagues = async (userId, models) => {
  const memberships = await models.LeagueMember.findAll({
    where: { userId },
    include: [
      {
        model: models.Championship,
        include: [{ model: models.User, attributes: ["id", "name", "email"] }],
      },
    ],
  });
  return memberships.map((m) => m.championship);
};