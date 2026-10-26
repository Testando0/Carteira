# Carteira Digital RPG — plano e design

## Implementação
Aplicação web React/Vite com experiência mobile-first. O protótipo usa `localStorage` como fonte persistente local e um canal WebSocket no servidor Express para anunciar alterações entre abas e clientes conectados. Não usa ManusAuth: o login é próprio da aplicação, com perfis demonstrativos (admin master, empregador e trabalhador) e permissões simuladas no estado local.

O domínio é representado por trabalhadores, empresas, contratos, registros de ponto, pagamentos, encerramentos e histórico. A interface principal é uma SPA com navegação lateral no desktop e menu horizontal rolável no mobile. Exportação de relatórios/contratos é feita via impressão do navegador para PDF.

## Estrutura
- `client/src/pages/Home.tsx`: shell do dashboard, navegação e telas operacionais.
- `client/src/index.css`: tema visual escuro, tokens, componentes de formulário, tabelas e responsividade.
- `server/_core/index.ts`: servidor HTTP e relay WebSocket para eventos de sincronização.
- `public/manus-routes.json`: manifesto de rotas.

## Design

### Estilos considerados
- **Painel de comando neon** — 0.06: dark mode, cards densos e acentos esmeralda/dourado, fiel ao vídeo.
- **Escritório cívico** — 0.03: mais claro e documental, com azul e cinza.
- **Terminal de guilda** — 0.05: mais monoespaçado, inspirado em interfaces de RPG.

### Direção escolhida: Painel de comando neon
- **Movimento:** dashboard dark de ferramentas SaaS com influência de HUD de RPG e “status cards”.
- **Princípios:** densidade informacional sem perder hierarquia; ação primária sempre visível; estados por cor; histórico tratado como prova.
- **Cores:** azul-marinho quase preto cria foco e sensação de sistema protegido; esmeralda sinaliza ações válidas; dourado marca atenção e pendências; vermelho apenas para encerramentos.
- **Layout:** sidebar fixa no desktop, conteúdo em coluna com cards e painéis assimétricos; navegação mobile rolável horizontalmente.
- **Assinaturas visuais:** selo “RP” no logotipo; linhas de status pontilhadas; badges de contrato e eventos.
- **Interação:** ações destrutivas exigem intenção explícita; formulários ficam próximos das listas; feedback em toast e no feed.
- **Animação:** transições curtas de 160ms, entrada suave de cards e pulse discreto no status WebSocket.
- **Tipografia:** Manrope para interface, Space Mono para IDs, salários e metadados.
- **Essência:** a carteira de trabalho que transforma cada vínculo do servidor em histórico confiável. Personalidade: rastreável, ágil, segura.
- **Voz:** direta, operacional e diegética. Exemplos: “Registrar entrada” e “Vínculo encerrado sem apagar o histórico”.
- **Marca:** wordmark “CARTEIRA // RP” com o “//” como símbolo de trilhas de auditoria.
- **Cor proprietária:** verde “guilda” `#42e6a4`.
