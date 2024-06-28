# App

Ebanx Take-home Assignment

### RFs (Requisitos funcionais)

- [ ] Deve ser possível resetar o estado da aplicação
- [x] Deve ser possível criar uma conta com saldo inicial
- [x] Deve ser possível consultar o saldo de uma conta
- [x] Deve ser possível efetuar depósito em uma conta
- [x] Deve ser possível efetuar o saque de uma conta
- [x] Deve ser possível efetuar transferência entre contas

### RNs (Regras de negócio)

- [x] Não deve ser possível criar contas com mesmo identificador (accountId).
- [x] A API deve retornar um status 404 e saldo 0 ao tentar consultar o saldo de uma conta que não existe.
- [x] A API deve retornar um status 404 e saldo 0 ao tentar realizar um saque de uma conta que não existe.
- [x] A API deve retornar um status 404 e saldo 0 ao tentar realizar uma transferência de uma conta que não existe.
- [x] Não deve ser possível realizar um saque de valor maior que o disponível em saldo.
- [x] Não deve ser possível realizar uma transferência de valor maior que o disponível em saldo.

### RNFs (Requisitos não-funcionais)
- [x] Os dados da aplicação não precisam estar persistidos em um banco de dados.
