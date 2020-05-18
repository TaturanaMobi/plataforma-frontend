# TODO

- [x] Revisar dados de estatísticas com dados atualizados de produção ( sessoes cadastradas em prod, usuarios cadastrados )
- [x] Remover do fluxo de 3 dias o template screening_date
- [x] Remover do fluxo de 9 dias o template screening_date
- [x] Testar upload de arquivo de material de apoio no tamanho de 100mb
- [x] Deixar texto em branco sobre aviso de sessões pednentes de Relatório (Adicionar o texto ATENÇÃO ao início do aviso)
- [x] Adicionar template padrão para weekly draft session
- [x] Deixar disponíveis as sessões excluídas pelo usuário no admin de sessões
- [x] Na visão do filme, adicionar link para agenda com filtro do filme específico
- [x] Testar criação de fluxo de email customizado por filme
- [x] Confirmar possibildade de informação do horário da sessão no email que vai para o produtor
- [x] Adicionar endereço na página de minhas sessoes em cada sessao
- [x] Adicionar aviso que o email foi enviado com sucesso

- [ ] Adicionar nome e email na lista de fluxo de emails "embaixador" e "email de destino"
- [ ] Melhorar performance do carregamento de sessão no admin
- [x] Corrigir inconsistência de dados nos gráficos
- [ ] Incluir total de municípios quando o filme em difusão (icon geolocalização)
- [ ] Atualizar Portfolio ingles/portugues

# Regras de negócio

## Entidades

> Film, Ambassador, User, Screening, State, Cities

## Dúvidas

1. User = Ambassador?
2. Screening dentro de films
3. Inventory?
4. legacy data from viewers
5.

## Screening status

* Rascunho
* Agendada
* Relatório pendente
* Relatório enviado - report_description && real_quorum

## Film status

* Oculto
* Difusão
* Difusão/Portfolio
* Portfolio

> Creating Slugs in Bulk for Existing Films

## Film inventory

* Legacy Inventory
* sessoes jah exibidas
* sessões com relatorio que ja foram exibidas
* sessoes a serem exibidas
* Espectadores por mês
* Estados e viewers por area
* quais cidades
* Usuários -         users.push(Meteor.users.findOne(screening.user_id));
* Categorias e subcategorias dos embaixadores?
* Não retorna inventorio sem sessões


## Notifications Sent

* Forget Password
* Contact Sent
* Report created
* User register
* Screening register

# MONGO QUERIES

Find by screeningId

{ screening: { $elemMatch: { _id: 'xx' } } }

Count screenings before migrate

db.films.aggregate([{
  $project: {
    _id: '$_id',
    _title: '$title',
    totalscreenings: {
      "$size": { "$ifNull": [ "$screening", [] ] }
    }
  }
}]);

Count screenings by status after migrate

db.screenings.aggregate([
  { $match: { filmId: "X55no5BySn4B3Czxa" } },
  { $group : { _id : '$status', count : {$sum : 1}} }
]);

Count screenings

db.screenings.aggregate( [
   { $count: "myCount" }
])