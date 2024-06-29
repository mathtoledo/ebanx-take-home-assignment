# Ebanx Take-home Assignment

### RFs (Requisitos Funcionais)

- [x] Deve ser possível resetar o estado da aplicação
- [x] Deve ser possível criar uma conta com saldo inicial
- [x] Deve ser possível consultar o saldo de uma conta
- [x] Deve ser possível efetuar depósito em uma conta
- [x] Deve ser possível efetuar o saque de uma conta
- [x] Deve ser possível efetuar transferência entre contas

### RNs (Regras de Negócio)

- [x] Não deve ser possível criar contas com mesmo identificador (accountId).
- [x] A API deve retornar um status 404 e saldo 0 ao tentar consultar o saldo de uma conta que não existe.
- [x] A API deve retornar um status 404 e saldo 0 ao tentar realizar um saque de uma conta que não existe.
- [x] A API deve retornar um status 404 e saldo 0 ao tentar realizar uma transferência de uma conta que não existe.
- [x] Não deve ser possível realizar um saque de valor maior que o disponível em saldo.
- [x] Não deve ser possível realizar uma transferência de valor maior que o disponível em saldo.

### RNFs (Requisitos Não-Funcionais)

- [x] Os dados da aplicação não precisam estar persistidos em um banco de dados.

## Estrutura

A aplicação está estruturada da seguinte forma:

- `src/entities`: Contém as entidades do domínio, como `Account`.
- `src/repositories`: Contém as interfaces e implementações dos repositórios (por exemplo, `InMemoryAccountsRepository`).
- `src/use-cases`: Contém a lógica de negócios para cada caso de uso (por exemplo, `DepositUseCase`, `WithdrawUseCase`).
- `src/controllers`: Contém os manipuladores de requisições para os endpoints da API.
- `src/app.ts`: Configuração principal da aplicação, incluindo rotas e middleware.

## Como Executar

Para executar a aplicação localmente, siga estes passos:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/your-repo/ebanx-take-home-assignment.git
   cd ebanx-take-home-assignment

2. **Instale as dependências:**
    ```bash
    npm install

2. **Inicie a aplicação:**
    ```bash
    npm run start:dev

A aplicação estará rodando em http://localhost:3333

## Teste unitários e end to end

1. **Executar todos os testes:**
    ```bash
    npm run test

2. **Executar apenas testes e2e:**
    ```bash
    npm run test:e2e

#### Notas sobre Testes

- Os testes unitários cobrem casos de uso individuais.
- Os testes de ponta a ponta cobrem os endpoints da API e seus comportamentos esperados.

