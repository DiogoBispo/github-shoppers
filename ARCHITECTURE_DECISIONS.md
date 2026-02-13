
---

```md
# Documento de Decisões Arquiteturais e Metodologia de Desenvolvimento

## Visão Geral

Este documento descreve as decisões arquiteturais, escolhas tecnológicas e a metodologia de desenvolvimento assistido por IA utilizadas na construção da aplicação GitHub Shoppers.

O objetivo foi desenvolver uma aplicação full stack seguindo padrões profissionais de engenharia de software, com foco em:

- consistência
- reprodutibilidade
- escalabilidade
- clareza arquitetural

O desenvolvimento foi conduzido utilizando IA como assistente de engenharia, mantendo controle humano sobre todas as decisões críticas.

---

## Metodologia de Desenvolvimento Assistido por IA

O desenvolvimento foi realizado utilizando ferramentas de IA como suporte à engenharia, incluindo:

- ChatGPT (definição arquitetural, validação de padrões e implementação incremental)
- Cursor (edição assistida e navegação de código)
- GitHub Copilot (autocompletar e assistência contextual)

A IA foi utilizada como acelerador de desenvolvimento, não como substituto do raciocínio de engenharia.

O processo seguiu as etapas:

1. Definição da arquitetura antes da implementação
2. Implementação incremental por camadas
3. Validação funcional e estrutural a cada etapa
4. Revisão manual de todo o código gerado ou assistido por IA

Essa abordagem garante qualidade e consistência.

---

## Arquitetura do Backend

Foi adotada uma arquitetura em camadas (Layered Architecture), composta por:

```

Controllers
Services
Repositories
Infraestrutura
Banco de Dados

```

Essa estrutura permite:

- separação de responsabilidades
- maior facilidade de manutenção
- escalabilidade
- testabilidade

Cada camada possui responsabilidade bem definida.

---

## Escolhas Tecnológicas — Backend

### Node.js com TypeScript

Escolhido por:

- alto desempenho em operações assíncronas
- forte ecossistema
- tipagem estática com TypeScript aumenta segurança e manutenibilidade

---

### Express

Escolhido por:

- simplicidade e controle total da camada HTTP
- padrão amplamente utilizado em aplicações backend profissionais

---

### PostgreSQL

Escolhido por:

- suporte completo a transações (ACID)
- alta confiabilidade
- integridade referencial

Essencial para garantir consistência em operações críticas como decremento de estoque.

---

### Knex (Migrations)

Utilizado para:

- versionamento do schema do banco de dados
- reprodutibilidade do ambiente
- criação automática do banco em novos ambientes

Permite que qualquer desenvolvedor recrie o banco executando apenas:

```

npm run migrate:latest

````

---

### JWT (Autenticação)

Escolhido por:

- modelo stateless
- escalabilidade
- padrão amplamente utilizado em sistemas modernos

---

## Decisão Crítica: Decremento Atômico de Estoque

O decremento de estoque foi implementado utilizando operação atômica no banco:

```sql
UPDATE itens
SET qtd_atual = qtd_atual - 1
WHERE id = $1 AND qtd_atual > 0
RETURNING *
````

Essa abordagem garante:

* ausência de race conditions
* integridade de dados
* consistência transacional

Essa é uma prática essencial em sistemas de comércio e inventário.

---

## Integração com API Externa (GitHub)

A aplicação realiza integração com a API pública do GitHub para simular obtenção do comprador.

Essa integração demonstra capacidade de:

* consumir APIs externas
* tratar integrações com serviços terceiros
* estruturar comunicação entre serviços

---

## Arquitetura do Frontend

### React

Escolhido por:

* padrão dominante no mercado
* arquitetura baseada em componentes
* alta escalabilidade

---

### Ant Design

Escolhido por:

* biblioteca madura e estável
* componentes prontos para produção
* aceleração do desenvolvimento de interface

---

### Vite

Escolhido por:

* inicialização rápida
* ambiente de desenvolvimento eficiente

---

## Modelagem do Banco de Dados

Estrutura relacional com três entidades principais:

* usuarios
* itens
* compras

Relacionamentos definidos com chaves estrangeiras garantindo integridade.

---

## Estratégia de Testes

Foram implementados testes de integração utilizando:

* Vitest
* Supertest

Testando:

* autenticação
* criação de itens
* registro de compras
* decremento correto de estoque
* tratamento de erro quando estoque é insuficiente

Isso garante confiabilidade do sistema.

---

## Princípios de Engenharia Aplicados

Durante o desenvolvimento, foram seguidos os seguintes princípios:

* Separação de responsabilidades
* Arquitetura modular
* Reprodutibilidade do ambiente
* Consistência transacional
* Integração com serviços externos
* Validação automatizada por testes

---

## Uso Estratégico de IA no Processo

A IA foi utilizada como ferramenta de suporte para:

* validação de arquitetura
* aceleração da implementação
* verificação de consistência
* revisão estrutural

Todas as decisões críticas foram tomadas com análise humana.

---

## Considerações de Prontidão para Produção

A aplicação foi estruturada considerando requisitos de produção:

* migrations versionadas
* autenticação segura
* arquitetura modular
* testes automatizados
* frontend desacoplado

---

## Conclusão

O projeto demonstra capacidade de:

* desenvolvimento full stack
* tomada de decisões arquiteturais conscientes
* uso eficiente de IA como ferramenta de engenharia
* construção de sistemas reprodutíveis e escaláveis

O foco foi garantir qualidade estrutural e consistência técnica.

```
