// ─── LEVI ─────────────────────────────────────────────────────────────────────
// Responsável: Levi

import AppError from "../errors/AppError.js";
import * as BetService from "../services/betService.js";

const getAll = async (req, res, next) => {
  try {
    const bets = await BetService.getAll(req.userId, req.context.models);
    return res.json(bets);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const bet = await BetService.getById(
      req.params.id,
      req.userId,
      req.context.models
    );
    if (!bet) throw new AppError("Palpite não encontrado.", 404);
    return res.json(bet);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { matchId, predictedHome, predictedAway } = req.body;
    if (!matchId) throw new AppError("O campo 'matchId' é obrigatório.", 400);
    if (predictedHome === undefined) throw new AppError("O campo 'predictedHome' é obrigatório.", 400);
    if (predictedAway === undefined) throw new AppError("O campo 'predictedAway' é obrigatório.", 400);
    const bet = await BetService.create(req.body, req.userId, req.context.models);
    return res.status(201).json(bet);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const bet = await BetService.update(
      req.params.id,
      req.body,
      req.userId,
      req.context.models
    );
    return res.json(bet);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await BetService.remove(req.params.id, req.userId, req.context.models);
    return res.json({ message: "Palpite removido com sucesso." });
  } catch (err) {
    next(err);
  }
};

const getRanking = async (req, res, next) => {
  try {
    const ranking = await BetService.getRanking(req.context.models);
    return res.json(ranking);
  } catch (err) {
    next(err);
  }
};

export default { getAll, getById, create, update, remove, getRanking };