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
    if (!championship) throw new AppError("Campeonato não encontrado.", 404);
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
    if (!championship) throw new AppError("Campeonato não encontrado.", 404);
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
    if (!deleted) throw new AppError("Campeonato não encontrado.", 404);
    return res.json({ message: "Campeonato removido com sucesso." });
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
    if (!matches) throw new AppError("Campeonato não encontrado.", 404);
    return res.json(matches);
  } catch (err) {
    next(err);
  }
};

export default { getAll, getById, create, update, remove, getMatches };