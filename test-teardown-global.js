/**
 * Ce fichier fait parti de la configuration de jest pour forcer à quitter les tests en cas de warning
 * bloquant la bonne exécution des tests
 */
module.exports = () => {
  process.exit(0);
};
