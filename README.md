# AlmoxApp - Backend

Este repositório contém o código do backend da aplicação AlmoxApp, desenvolvido em NestJS.

## Estrutura
- src/ → código fonte principal
- test/ → testes automatizados
- package.json → dependências e scripts
- .env.example → exemplo de variáveis de ambiente

## Pré-requisitos
- Node.js (versão LTS recomendada: 24.x via NVM)
- npm ou yarn
- PostgreSQL (utilizado como banco de dados)

## Configuração
1. Copie o arquivo .env.example para .env e ajuste as variáveis.

2. Instale as dependências:
```
npm install
```

## Rodando a aplicação
### Desenvolvimento
```
npm run start:dev
```

### Produção
```
npm run build
npm run start:prod
```

## Testes
```
npm run test
npm run test:e2e
npm run test:cov
```
