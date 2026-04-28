export const getAll = async (models) => {
  return await models.Championship.findAll();
};

export const getById = async (id, models) => {
  return await models.Championship.findByPk(id, {
    include: [models.Match],
  });
};

export const create = async (data, userId, models) => {
  return await models.Championship.create({ ...data, userId });
};

export const update = async (id, data, userId, models) => {
  const championship = await models.Championship.findByPk(id);
  if (!championship) return null;
  if (championship.userId !== userId)
    throw new AppError("Sem permissão.", 403);
  return await championship.update(data);
};

export const remove = async (id, userId, models) => {
  const championship = await models.Championship.findByPk(id);
  if (!championship) return null;
  if (championship.userId !== userId)
    throw new AppError("Sem permissão.", 403);
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