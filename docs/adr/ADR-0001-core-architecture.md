# ADR-0001 — Arquitetura base do My Tennis Stats

- **Status:** Aceito
- **Data:** 2026-08-06
- **Decisores:** Alexandre Curvelo e equipe de desenvolvimento
- **Escopo:** V1 do aplicativo

## Contexto

O My Tennis Stats será um aplicativo iOS voltado a jogadores amadores de tênis. O desenvolvimento será feito em Windows, com testes em um iPhone físico.

A proposta da V1 é registrar estatísticas simples ao final de cada game, sem interação ponto a ponto. A partida será recreativa e disputada em um único set, com tie-break em 6–6.

O aplicativo deve funcionar sem internet, preservar os dados localmente e permitir evolução futura sem acoplar as regras do tênis à interface ou ao banco de dados.

## Decisão

### Plataforma e linguagem

- React Native com Expo.
- TypeScript com modo estrito.
- Desenvolvimento principal no Windows.
- Testes no iPhone por meio do Expo Go.
- Build e distribuição futura via EAS Build.

### Organização do projeto

- `app/` contém somente rotas do Expo Router.
- `src/` contém o código da aplicação.
- `@/` aponta para `src/`.
- A organização interna será por funcionalidade.

Estrutura principal:

```text
app/
src/
  features/
    matches/
      domain/
      application/
      infrastructure/
      presentation/
  shared/
  test/
```

### Navegação

- Expo Router.
- Arquivos em `app/` funcionam apenas como adaptadores de rota.
- Regras e lógica de tela permanecem em `src/`.

### Domínio

- O domínio não depende de React, React Native, Expo, SQLite ou Zustand.
- `Match` é a raiz do agregado.
- A fonte da verdade é a sequência de registros da partida.
- Placar e estatísticas são recalculados a partir dos registros.
- A V1 suporta apenas um set tradicional.
- A partida termina em:
  - 6–0 até 6–4;
  - 7–5;
  - 7–6 após tie-break.
- Em 6–6, somente um tie-break pode ser registrado.
- Tie-breaks não participam das estatísticas de saque e devolução da V1.

### Persistência

- Expo SQLite será a fonte persistente.
- Drizzle ORM será usado para schema, consultas e migrations.
- O banco será local-first e funcionará sem internet.
- O estado persistente da partida não será duplicado no Zustand.

### Estado de interface

- Zustand será usado apenas para estado temporário:
  - carregamento;
  - erro;
  - modal ativo;
  - rascunho do registro;
  - partida atualmente exibida.

### Tema

- `src/shared/theme` será a única fonte de cores, espaçamentos e raios.
- Hooks e componentes de tema gerados pelo template do Expo não serão usados.
- `SafeAreaView` será importado de `react-native-safe-area-context`.

### Testes

- Jest com `jest-expo`.
- Testes do domínio terão prioridade.
- Os testes ficam fora de `app/`.
- Builders e repositórios em memória serão usados para reduzir dependência de infraestrutura.
- Todo cálculo de placar, validação e estatística deverá possuir testes unitários.

## Consequências positivas

- Regras do tênis podem ser testadas sem React Native.
- O aplicativo permanece simples para a V1.
- O código fica preparado para futura sincronização em nuvem.
- O banco pode mudar sem alterar o domínio.
- O placar não fica duplicado em várias camadas.
- O projeto pode ser desenvolvido no Windows e testado em iPhone físico.

## Consequências negativas

- A arquitetura possui mais arquivos do que uma implementação direta.
- Mappers e casos de uso adicionam código de integração.
- O iOS Simulator oficial não estará disponível no Windows.
- Builds iOS finais dependerão de infraestrutura macOS remota ou física.

## Alternativas consideradas

### SwiftUI

Não adotado porque o desenvolvimento principal ocorre em Windows e o Xcode exige macOS.

### Flutter

Tecnicamente viável, mas React Native com Expo permite testar diretamente no iPhone pelo Expo Go com menor atrito no ambiente escolhido.

### React Native sem Expo

Não adotado na V1 porque aumentaria a complexidade de configuração nativa sem benefício imediato.

### Persistir placar consolidado

Não adotado porque poderia divergir da sequência de registros. O placar será derivado.

### Registro ponto a ponto

Não adotado porque prejudicaria a concentração do jogador. O registro será feito ao final de cada game.

### Múltiplos sets

Não adotado na V1 por não ser necessário ao uso recreativo inicial.

## Reavaliação

Esta decisão deverá ser revista quando ocorrer uma destas situações:

- inclusão de múltiplos sets;
- suporte a partidas de duplas;
- sincronização entre dispositivos;
- login e contas de usuário;
- publicação na App Store;
- integração com Apple Watch;
- necessidade de módulos nativos incompatíveis com Expo Go.
