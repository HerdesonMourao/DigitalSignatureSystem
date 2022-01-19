<div align="center">
  <h1>
    DigitalSignatureSystem
  </h1>
</div>

Projeto sistema de assinatura digital da disciplina de Auditoria e Segurança de Informação - UFC

### Tecnologias utilizadas ###
* JavaScript
* NodeJS
* Express
* Crypto

### Como executar ###
O primeiro passo e verificar se o node esta instalado em sua máquina. Tendo feito essa verificação, clone o projeto utilizando o comando `git clone git@github.com:HerdesonMourao/DigitalSignatureSystem.git` ou `git clone https://github.com/HerdesonMourao/DigitalSignatureSystem.git`, assim que tiver concluido o clone do projeto acesse a pasta que foi criada e faça uma copia do arquivo **.env.example** renomeando a mesma para **.env**, dentro do arquivo .env coloque as configurações de acesso do seu banco de dados mysql. 

Tendo feito o clone do projeto e essa configuração do .env, crie um banco de dados vazio com o nome que foi definido no .env na variavel **DB_DATABASE** e importe o arquivo [auditoria.sql](https://github.com/HerdesonMourao/DigitalSignatureSystem/blob/master/recursos/auditoria.sql) para criar o banco de dados do projeto. Depois dessas configurações execute o comando `npm run start` para inicializar o projeto.

### Membros ###
* Allington Sousa
* César Rayan
* Herdeson Mourão
* Ronald Bonfim
