# Carteira Digital RPG

Carteira de trabalho digital para servidores de RPG, com cadastro de trabalhadores e empresas, contratos, assinaturas, ponto, pagamentos, encerramentos, auditoria, permissões e relatórios.

## Login inicial

A primeira conta é criada automaticamente no navegador: `master` com senha `master123`. O Admin Master pode criar outras contas com nome, username, cargo e senha. Os dados da aplicação e a sessão ficam no `localStorage` do navegador. O WebSocket `/ws` sincroniza alterações entre operadores conectados; se a conexão cair, o cliente reconecta com backoff e continua operando em modo local.

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm start
```

O servidor respeita `PORT` e escuta em `0.0.0.0`, possui `GET /api/health` e serve o cliente compilado em produção. O endpoint WebSocket usa o mesmo host e porta no caminho `/ws`.

## Deploy no Render

O projeto inclui `render.yaml` e `Dockerfile`. No Render, conecte o repositório e crie um **Web Service** usando runtime Docker. O Blueprint já define o health check em `/api/health`, build da imagem e deploy automático. O serviço usa a variável `PORT` fornecida pelo Render e aceita conexões `wss://seu-servico.onrender.com/ws`.

Para produção com múltiplas instâncias ou dados compartilhados entre dispositivos, adicione um banco de dados ou storage compartilhado. O modo atual foi desenhado para RPG e mantém os dados no navegador por requisito do projeto; o WebSocket sincroniza os clientes enquanto estão conectados ao mesmo serviço.
