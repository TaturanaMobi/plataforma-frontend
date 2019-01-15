# Taturana Mobilização Social

> ## Seja cinema, liberte um filme
>
> Organize uma sessão coletiva em seu espaço e fortaleça os circuitos alternativos da #RedeDeExibidoresTaturana pela democratização do acesso ao cinema!

## Requisitos

Antes de começar, certifique-se que atende os seguintes requerimentos:

* Docker CE >= 17
* Docker Compose >= 1.21

## Instalando

Então, rode os comandos:

```bash
$ git clone https://github.com/TaturanaMobi/plataforma-frontend.git
cd plataforma-frontend
$ docker-compose up -d
```

O container pode ser logado via `docker-compose exec app bash` a qualquer momento depois do `docker-compose up`.
Você deve ser capaz de acessar o site em `http://localhost:3000`

## Para importar os filme de exemplo

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
* https://bunkat.github.io/later/

* https://github.com/aldeed/meteor-autoform
* https://github.com/VeliovGroup/meteor-autoform-file
* https://github.com/VeliovGroup/Meteor-Files

* https://github.com/aslagle/reactive-table
* https://github.com/Urigo/awesome-meteor

## Para extrair o banco de prod localmente

```bash
prod ~ $ mongodump --db taturanamobi --out taturana-$(date +%Y%m%d).json
prod ~ $ ls -1 |grep tatuarna-
prod ~ $ exit
local ~/plataforma-taturana $ scp -r prod:~/taturana-<data>.json .
local ~/plataforma-taturana $ mongorestore -h localhost:3001 -d meteor taturana-<data>.json/taturanamobi --drop
```
