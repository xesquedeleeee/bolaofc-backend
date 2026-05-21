import AppError from "../errors/AppError.js";
import * as ChampionshipService from "../services/championshipService.js";

const getAll = async (req, res, next) => {
  try {
    const championships = await ChampionshipService.getAll(req.context.models);
    return res.json(championships);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const championship = await ChampionshipService.getById(
      req.params.id,
      req.context.models
    );
    if (!championship) throw new AppError("Liga não encontrada.", 404);
    return res.json(championship);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, season, description } = req.body;
    if (!name) throw new AppError("O campo 'name' é obrigatório.", 400);
    if (!season) throw new AppError("O campo 'season' é obrigatório.", 400);
    const championship = await ChampionshipService.create(
      { name, season, description },
      req.userId,
      req.context.models
    );
    return res.status(201).json(championship);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const championship = await ChampionshipService.update(
      req.params.id,
      req.body,
      req.userId,
      req.context.models
    );
    if (!championship) throw new AppError("Liga não encontrada.", 404);
    return res.json(championship);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await ChampionshipService.remove(
      req.params.id,
      req.userId,
      req.context.models
    );
    if (!deleted) throw new AppError("Liga não encontrada.", 404);
    return res.json({ message: "Liga removida com sucesso." });
  } catch (err) {
    next(err);
  }
};

const getMatches = async (req, res, next) => {
  try {
    const matches = await ChampionshipService.getMatches(
      req.params.id,
      req.context.models
    );
    if (!matches) throw new AppError("Liga não encontrada.", 404);
    return res.json(matches);
  } catch (err) {
    next(err);
  }
};

const join = async (req, res, next) => {
  try {
    const member = await ChampionshipService.join(
      req.params.id,
      req.userId,
      req.context.models
    );
    return res.status(201).json({ message: "Você entrou na liga!", member });
  } catch (err) {
    next(err);
  }
};

const leave = async (req, res, next) => {
  try {
    await ChampionshipService.leave(
      req.params.id,
      req.userId,
      req.context.models
    );
    return res.json({ message: "Você saiu da liga." });
  } catch (err) {
    next(err);
  }
};

const getMembers = async (req, res, next) => {
  try {
    const members = await ChampionshipService.getMembers(
      req.params.id,
      req.context.models
    );
    return res.json(members);
  } catch (err) {
    next(err);
  }
};

const getUserLeagues = async (req, res, next) => {
  try {
    const leagues = await ChampionshipService.getUserLeagues(
      req.userId,
      req.context.models
    );
    return res.json(leagues);
  } catch (err) {
    next(err);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getMatches,
  join,
  leave,
  getMembers,
  getUserLeagues,
};