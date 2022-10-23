# SimpleRide backend
Backend principal qui va servir l'app mobile de simpleRide

**Commandes pour installer et lancer le projet**
```
  yarn install
  yarn start
```

## Pull request
le système de pull request de github va être utiliser afin de merger les branches sur `main`
Quand le merge est fait sur `main` les commits seront *squashed* (écrasés) en un seul commit.

### Cycle de vie d'une branche:
- En local on commence par créer une branche basé sur la branche main
  - Je suis sur la branche main, `git checkout -b nom_de_ma_branche`, je suis directement placé sur la nouvelle brance
- Une fois mon travail fini, je commit mes derniers changement et je push ma branche sur git github
  - `git push origin nom_de_ma_branche`
- J'ouvre une pull request sur github et je demande une review aux autres développeurs.
  - la pull request est dans le sens `nom_de_ma_branche` > `main` (Je demande de merger ma branche sur main)
- Une fois le merge fait, je retourne sur la branche main en local
  - `git checkout main`
- Et je récupère la branche main distante
  - `git pull origin main`

Je supprime mes anciennes branches qui ne servent plus
Ainsi je peux recommence une nouvelle feature sur une nouvelle branche.

## Guidelines

### Linter
Nous utiliserons [husky](https://github.com/typicode/husky) pour exécuter un **git pre-push hook** afin de lancer prettier pour formater le code
suivant de simples règles de formatage classiques. Des tests unitaires seront également exécuter au pre-push.

### Tests automatiques
On utilise Jest et supertest pour exécuter des tests automatiques
Tous les tests devront être écrit dans le dossier __TESTS__ sous la forme `<nom_fichier>.test.js` afin que `jest` les lancent.
Un exemple de test simple se trouve dans le fichier `__TESTS__/index.test.js`

La commande pour lander les tests `yarn test`