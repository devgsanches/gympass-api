# App

Gym pass style app.

## RFs (Requisitos funcionais)

[ funcionalidades da app ]

ex: O usuário deve conseguir fazer check-in

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil do usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível obter o histórico de check-ins realizados pelo usuário logado;
- [x] Deve ser possível obter as academias próximas do usuário logado (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia; CORE
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

[ caminhos/condições que cada funcionalidade pode tomar. Sempre associada ao RF ]

ex: O usúario só deve conseguir fazer check-in, caso esteja a menos de 10km da localidade do estabelecimento

- [x] O usuário não deve conseguir realizar um cadastro com um e-mail duplicado;
- [x] O usuário não deve conseguir realizar 2 check-ins no mesmo dia;
- [x] O usuário não deve conseguir realizar check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

[ aquilo que será utilizado no dev da app]

- [x] A senha do usuário deve estar criptografada;
- [x] Os dados da app devem ser persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT;