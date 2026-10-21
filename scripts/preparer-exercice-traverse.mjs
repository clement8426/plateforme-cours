// Une seule procédure d’installation, complétée par le contexte de cet exercice.
// Aucun code de correction ni inventaire des défauts du formateur n’est publié.
import { readFileSync, writeFileSync } from 'node:fs';
const dossier = new URL('../public/diapos/ux-ia/', import.meta.url);
const installation = readFileSync(new URL('installation-labo-ux.md', dossier), 'utf8');
const contexte = `

# Contexte prioritaire : exercice Traverse du cours UX × IA

J’utilise ce fichier pour l’exercice Labo UX Démo, pas pour mon propre projet.
Après l’installation, choisis directement « Essayer Traverse » et prépare le site
local à partir de labo-ux-demos/exercices/traverse. Lis son README et son PROMPT.md.
Installe ses dépendances, construis sa version de production et démarre-la. Fais
ces opérations toi-même. Ne me donne pas de commandes à taper. Prépare le serveur
dans une session conservée et ouvre son adresse dans le navigateur.

L’adresse prévue est http://127.0.0.1:4192. Si ce port est occupé, vérifie d’abord
quel service l’utilise : ne ferme pas un processus inconnu. Réutilise la bonne
instance ou choisis un autre port et adapte uniquement le plan d’exécution de
l’audit, hors du code du site. Vérifie que cette adresse répond et affiche bien
Traverse avant de me la donner. Ouvre-la dans le navigateur et fournis un lien
cliquable vers l’adresse réellement démarrée. Ne me renvoie pas vers un bouton
du cours qui supposerait un port fixe. Si l’installation ou le démarrage échoue,
explique le blocage ; ne me demande pas de commencer un parcours indisponible.

Laisse-moi d’abord essayer le parcours : choisir une sortie, saisir Alex Exemple,
alex@example.test et 0600000000, puis essayer d’envoyer la demande et d’atteindre
une confirmation. Tout est fictif. Laisse-moi relever mes observations avant de
révéler les constats. Ne lis pas DEFAUTS.md, defauts.json ni les résultats des
sondes du formateur pour fabriquer les résultats de l’audit.

Quand je demande l’audit, confirme avec moi l’objectif, la cible (personne peu à
l’aise avec l’informatique, téléphone ou ordinateur) et l’autorisation de tester
le formulaire fictif, y compris les retours en arrière et les doubles clics.
Utilise audit.json et les deux parcours de l’exercice. Lis le code et teste le
rendu avec Labo UX. Utilise les outils disponibles, dont axe et Lighthouse, et
annonce les contrôles indisponibles ou non réalisés.

Couvre les six blocs avec les preuves et les limites : design system, friction,
accessibilité, analyse comportementale, microcopie et performances réelle/perçue.
Les événements de fixtures/events.json sont synthétiques. N’en déduis pas les
comportements ou les motifs d’abandon de vrais visiteurs. Distingue les problèmes
du site, les erreurs d’outils et les vérifications manuelles restantes.

Mode Audit obligatoire pour cet exercice : permissions.codeModification = false.
Écris les rapports dans le dossier de résultats prévu, sans réécrire le code de
l’application. Aucune version corrigée ni comparaison avant/après fictive.
Traverse reste volontairement cassé. N’annonce aucun gain de conversion ni
conformité complète à partir de cet audit.

Ouvre mon rapport HTML réel. Aide-moi à expliquer trois problèmes : l’obstacle,
la conséquence pour l’utilisateur, la preuve consultable, la priorité et une
piste d’amélioration. Ne corrige pas à ma place. Je dois comprendre le rapport.
`;
writeFileSync(new URL('exercice-traverse.md', dossier), installation.trimEnd() + contexte);
console.log('Consigne Traverse prête : installation commune et mission en mode Audit.');
