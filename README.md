# 🏆 BolãoFC — Backend

API REST desenvolvida com Express, PostgreSQL, NeonDB e deploy na Vercel.

## 👥 Integrantes

| Nome | RA |
|---|---|
| Brenno Henrique | 855276 |
| Alexis Gonçalves | 855357 |
| Levi Vitor | 855503 |
| Luan Bandeira | 855241 |

## 🚀 Tecnologias

- Node.js + Express
- PostgreSQL (NeonDB)
- Sequelize ORM
- JWT (Access Token + Refresh Token)
- Deploy: Vercel

## 🌐 URL de Produção

https://bolaofc-backend.vercel.app

## 📋 Entidades

- **User** — cadastro e autenticação de usuários
- **Championship** — campeonatos criados pelos usuários
- **Match** — partidas vinculadas a campeonatos
- **Bet** — palpites dos usuários nas partidas

## 🔗 Rotas principais

### Auth
- `POST /auth/register` — cadastro
- `POST /auth/login` — login
- `POST /auth/refresh` — renovar token
- `POST /auth/logout` — logout

### Championships
- `GET /championships` — listar
- `POST /championships` — criar
- `GET /championships/:id` — buscar
- `PUT /championships/:id` — atualizar
- `DELETE /championships/:id` — deletar
- `GET /championships/:id/matches` — partidas do campeonato *(rota composta)*

### Matches
- `GET /matches` — listar
- `POST /matches` — criar
- `GET /matches/:id` — buscar
- `PUT /matches/:id` — atualizar
- `DELETE /matches/:id` — deletar
- `GET /matches/:id/bets` — palpites da partida *(rota composta)*

### Bets
- `GET /bets` — listar
- `POST /bets` — criar
- `GET /bets/:id` — buscar
- `PUT /bets/:id` — atualizar
- `DELETE /bets/:id` — deletar
- `GET /bets/ranking` — ranking geral

## 🔒 Autenticação

Todas as rotas exceto `/auth/register` e `/auth/login` são protegidas por JWT.
