# SisAlunos - Sistema de Gerenciamento de Alunos

![SisAlunos Logo](./src/assets/logo.png)

## Visão Geral

SisAlunos é um sistema para gerenciamento de alunos, desenvolvido com Vue.js no frontend e Node.js/Express no backend para o teste tech da a+. O sistema permite cadastrar, visualizar, editar e excluir registros de alunos, além de oferecer funcionalidades de autenticação e controle de acesso e validação de duplicidade de RA.

## Requisitos do Sistema

### Backend
- Node.js (v14.x ou superior)
- npm ou yarn
- Banco de dados (PostgreSQL)

### Frontend
- Node.js (v14.x ou superior)
- npm ou yarn
- Vue.js 3.x

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

```
teste/
├── backend/         # Código do servidor Node.js/Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── frontend/        # Aplicação Vue.js
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── config/
    │   ├── plugins/
    │   ├── router/
    │   ├── services/
    │   ├── stores/
    │   ├── views/
    │   ├── App.vue
    │   └── main.js
    ├── .env
    ├── .env.example
    └── package.json
```




