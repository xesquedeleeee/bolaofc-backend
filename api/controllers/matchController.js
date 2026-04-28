// ─── ALEXIS ───────────────────────────────────────────────────────────────────
// Responsável: Alexis

import AppError from "../errors/AppError.js";
import * as MatchService from "../services/matchService.js";

const getAll = async (req, res, next) => {
  try {
    const matches = await MatchService.getAll(req.context.models);
    return res.json(matches);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const match = await MatchService.getById(req.params.id, req.context.models);
    if (!match) throw new AppError("Partida não encontrada.", 404);
    return res.json(match);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { homeTeam, awayTeam, matchDate, championshipId } = req.body;
    if (!homeTeam) throw new AppError("O campo 'homeTeam' é obrigatório.", 400);
    if (!awayTeam) throw new AppError("O campo 'awayTeam' é obrigatório.", 400);
    if (!matchDate) throw new AppError("O campo 'matchDate' é obrigatório.", 400);
    if (!championshipId) throw new AppError("O campo 'championshipId' é obrigatório.", 400);
    const match = await MatchService.create(req.body, req.context.models);
    return res.status(201).json(match);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const match = await MatchService.update(
      req.params.id,
      req.body,
      req.context.models
    );
    if (!match) throw new AppError("Partida não encontrada.", 404);
    return res.json(match);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await MatchService.remove(
      req.params.id,
      req.context.models
    );
    if (!deleted) throw new AppError("Partida não encontrada.", 404);
    return res.json({ message: "Partida removida com sucesso." });
  } catch (err) {
    next(err);
  }
};

const getBets = async (req, res, next) => {
  try {
    const bets = await MatchService.getBets(
      req.params.id,
      req.context.models
    );
    if (!bets) throw new AppError("Partida não encontrada.", 404);
    return res.json(bets);
  } catch (err) {
    next(err);
  }
};

export default { getAll, getById, create, update, remove, getBets };