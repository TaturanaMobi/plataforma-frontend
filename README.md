# Taturana Mobilização Social

> ## Seja cinema, liberte um filme
>
> Organize uma sessão coletiva em seu espaço e fortaleça os circuitos alternativos da #RedeDeExibidoresTaturana pela democratização do acesso ao cinema!

## Requisitos

Antes de começar, certifique-se que atende os seguintes requerimentos:

* Docker CE >= 17 - ```curl https://releases.rancher.com/install-docker/18.09.sh | sh```
* Docker Compose >= 1.21 - ````curl -L https://github.com/docker/compose/releases/download/1.25.0-rc4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose```
* NodeJS 8 e NPM  - ```curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n && bash n lts```
* Meteor - ```curl https://install.meteor.com/ | sh```

## Instalando

Então, rode os comandos:

```bash
$ git clone https://github.com/TaturanaMobi/plataforma-frontend.git
cd plataforma-frontend
$ make dev
# in another window or tab
$ meteor npm i
$ MONGO_URL=mongodb://localhost:27017/taturana MAIL_URL=smtp://fake-smtp:1025 WORKER=1 METEOR_DISABLE_OPTIMISTIC_CACHING=1 meteor --settings ./settings.json
```

O container pode ser logado via `docker-compose exec app bash` a qualquer momento depois do `docker-compose up`.
Você deve ser capaz de acessar o site em `http://localhost:3000`

## Testes automatizados
[![Build Status](https://travis-ci.org/TaturanaMobi/plataforma-frontend.svg?branch=develop)](https://travis-ci.org/TaturanaMobi/plataforma-frontend)

<img src="./public/Browserstack-logo@2x.png" alt="BrowserStack Logo" width="200">

## Para importar filmes de exemplo

```bash
docker-compose exec mongo mongoimport --db taturana --collection films --type json --file /backup/taturana-films.json
mongoimport -h localhost:3001 --db meteor --collection films --type json --file ./backup/taturana-films.json
```

## Para restaurar o banco de prod localmente

> Usando docker containers

```bash
docker-compose exec mongo mongorestore -d taturana /backups/taturana.json/taturanamobi --drop
```

> Usando docker containers para servidor remoto

```
docker-compose exec mongo mongorestore -h taturana.mongo.com:23812 -d taturana -u external -p  /backups/taturana.json/taturanamobi --drop
```

## Schema & Collections

* https://guide.meteor.com/collections.html
* https://github.com/aldeed/simple-schema-js
* https://github.com/aldeed/meteor-collection2
* https://github.com/dburles/mongo-collection-instances
* https://github.com/dburles/meteor-collection-helpers
* https://github.com/percolatestudio/meteor-migrations
* https://github.com/matb33/meteor-collection-hooks

* https://github.com/aldeed/meteor-autoform
* https://github.com/VeliovGroup/meteor-autoform-file
* https://github.com/VeliovGroup/Meteor-Files

* https://github.com/aslagle/reactive-table
* https://github.com/Urigo/awesome-meteor

## Como extrair o banoco de dados de produção e fazer o restore?

```bash
prod ~ $ mongodump --db taturanamobi --out taturana-$(date +%Y%m%d).json
prod ~ $ ls -1 |grep tatuarna-
prod ~ $ exit
local ~/plataforma-taturana $ scp -r prod:~/taturana-<data>.json .
local ~/plataforma-taturana $ mongorestore -h localhost:3001 -d meteor taturana-<data>.json/taturanamobi --drop
```

## Como importar os municípios brasileiros?

```
cd backups/
git clone git@github.com:kelvins/Municipios-Brasileiros.git
mongoimport -d taturana -c cities /backups/Municipios-Brasileiros/json/municipios.json --jsonArray --drop
```

## Como carregar dados do servidor no cliente?

Mesmo utilizando as mesmas collections, tanto no servidor quanto no cliente, é necessário definir quais registros da collection estarão disponíveis no cliente.
Nessa resposta do [Stack Overflow](https://stackoverflow.com/a/21853298/397927) tem mais detalhes de como essa lógica funciona.

É feito em 3 lugares no projeto: ```imports/startup/server/main.js```, ```imports/startup/client/routes.js``` e ```imports/ui/pages/screenings.js```.