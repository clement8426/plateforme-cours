// Exercice « Puis-je l'envoyer à une IA ? » : douze fichiers fictifs de l'étude, à trier avec les trois questions.
// Les fichiers sont dans public/fichiers/tri/ (voir scripts/generer-fichiers-tri.mjs). Tout est inventé.

export type Couleur = 'vert' | 'vertAnon' | 'orange' | 'rouge';
export type Apercu =
  | { type: 'texte'; contenu: string }
  | { type: 'image'; alt: string }
  | { type: 'audio'; transcription: string };

export type FichierTri = {
  id: string;
  fichier: string;
  format: string; // ce que voit l'utilisateur : PDF, Tableur, Photo…
  titre: string;
  but: string; // ce que l'on voudrait demander à l'IA
  apercu: Apercu;
  attendu: Couleur;
  pourquoi: string;
};

// Les trois questions, dans l'ordre. Même règle que la diapo « Avant d'envoyer à une IA ».
export const QUESTIONS = [
  { id: 'q1', question: 'Est-ce médical, intime, ou couvert par un secret professionnel ?', aide: 'Santé, religion, opinions, condamnations, ou ce qu’un médecin ou un avocat apprend dans son métier. Être client d’un avocat est déjà un secret.' },
  { id: 'q2', question: 'Est-ce réservé à certaines personnes, ou cela parle-t-il de quelqu’un ?', aide: 'Réservé : la direction, l’équipe, un client seulement. Quelqu’un : un nom, un visage, une voix, ou des indices pour le retrouver.' },
  { id: 'q3', question: 'Peut-on vraiment l’anonymiser, sans perdre ce qui sert ?', aide: 'Retirer le nom ne suffit pas toujours. Un secret d’affaires, lui, ne s’anonymise pas.' },
] as const;

export const RESULTATS: Record<Couleur, { nom: string; outil: string }> = {
  vert: { nom: 'Vert', outil: 'N’importe quel outil, même un chat grand public.' },
  vertAnon: { nom: 'Vert, après anonymisation', outil: 'Anonymiser d’abord, puis n’importe quel outil.' },
  orange: { nom: 'Orange', outil: 'Une offre entreprise sous contrat, ou une IA hébergée en Suisse.' },
  rouge: { nom: 'Rouge', outil: 'Sur l’ordinateur, ou une IA hébergée en Suisse sous contrat. Jamais un chat grand public.' },
};

// Les réponses aux trois questions donnent la couleur : oui à la 1 → rouge ; non à la 2 → vert ; puis la 3 tranche.
export function couleurDe(reponses: boolean[]): Couleur | null {
  if (reponses.length === 0) return null;
  if (reponses[0]) return 'rouge';
  if (reponses.length < 2) return null;
  if (!reponses[1]) return 'vert';
  if (reponses.length < 3) return null;
  return reponses[2] ? 'vertAnon' : 'orange';
}

export const FICHIERS: FichierTri[] = [
  {
    id: 'brochure', fichier: 'brochure-etude.pdf', format: 'PDF', titre: 'La brochure de l’étude',
    but: 'Vous voulez la faire relire et raccourcir pour le site.',
    apercu: { type: 'texte', contenu: 'Étude Fictive Avocats · Neuchâtel\nCe que nous faisons : droit du travail, assurances sociales, droit médical.\nNotre équipe : six avocats et quatre assistantes juridiques.\nPremier rendez-vous : trente minutes, 120 CHF.' },
    attendu: 'vert', pourquoi: 'Elle est déjà publiée : tout le monde peut la lire. Aucune personne n’y est nommée.',
  },
  {
    id: 'cg', fichier: 'conditions-generales.txt', format: 'Texte', titre: 'Les conditions générales',
    but: 'Vous voulez les traduire en allemand.',
    apercu: { type: 'texte', contenu: 'CONDITIONS GÉNÉRALES DE MANDAT\nPubliées sur www.etude-fictive.example\n1. Honoraires : 320 CHF de l’heure.\n2. Provision.\n3. Secret professionnel.\n4. Fin du mandat.' },
    attendu: 'vert', pourquoi: 'Un texte public, publié sur le site de l’étude.',
  },
  {
    id: 'modele', fichier: 'modele-lettre-relance.txt', format: 'Texte', titre: 'Un modèle de lettre de relance',
    but: 'Vous voulez un ton plus aimable.',
    apercu: { type: 'texte', contenu: '[Nom du client]\n[Adresse]\nConcerne : votre dossier [référence]\nSauf erreur de notre part, notre note d’honoraires n° [numéro] du [date] reste impayée à ce jour.' },
    attendu: 'vert', pourquoi: 'Des cases vides : aucune personne, aucun dossier. Attention le jour où on le remplit.',
  },
  {
    id: 'cv', fichier: 'cv-candidate.pdf', format: 'PDF', titre: 'Le CV d’une candidate',
    but: 'Vous voulez préparer les questions de l’entretien d’embauche.',
    apercu: { type: 'texte', contenu: 'Léa Modèle · Rue des Essais 3, 2034 Peseux · née le 14.05.1997\nCandidature : assistante juridique\n2021 à 2026 : assistante juridique, Étude Exemple.\nCFC d’employée de commerce. Français, allemand (B2), anglais (B1).' },
    attendu: 'vertAnon', pourquoi: 'Il parle de quelqu’un, mais rien de sensible. Pour préparer l’entretien, l’expérience suffit : retirez le nom, l’adresse, la date de naissance et l’ancien employeur, puis envoyez.',
  },
  {
    id: 'budget', fichier: 'budget-2027.csv', format: 'Tableur', titre: 'Le budget 2027',
    but: 'Vous voulez des graphiques pour la séance des associés.',
    apercu: { type: 'texte', contenu: 'Poste ; 2026 ; 2027\nSalaires ; 1 240 000 ; 1 310 000\nLoyer ; 96 000 ; 96 000\nInformatique ; 38 000 ; 52 000\nObjectif de chiffre d’affaires 2027 : 2,1 M CHF\nDocument interne, réservé à la direction.' },
    attendu: 'orange', pourquoi: 'Personne n’est nommé, mais il est réservé à la direction : c’est un secret d’affaires. Un secret d’affaires ne s’anonymise pas.',
  },
  {
    id: 'bail', fichier: 'contrat-bail-bureaux.pdf', format: 'PDF', titre: 'Le bail des bureaux',
    but: 'Vous voulez un résumé des clauses importantes.',
    apercu: { type: 'texte', contenu: 'Bailleur : SI Exemple SA, M. Hugo Ébauche\nLocataire : Étude Fictive Avocats\nLoyer mensuel : 8 000 CHF, réduit de 10 % deux ans.\nConfidentialité : les parties s’engagent à ne pas communiquer les conditions du bail.' },
    attendu: 'orange', pourquoi: 'Le contrat lui-même interdit d’en communiquer les conditions. Retirer les noms ne change rien au loyer négocié.',
  },
  {
    id: 'devis', fichier: 'email-devis-imprimante.eml', format: 'E-mail', titre: 'Le devis d’une imprimante',
    but: 'Vous voulez comparer avec d’autres offres.',
    apercu: { type: 'texte', contenu: 'De : Marc Témoin, Imprimantes Fictives SA\nObjet : votre devis, remise spéciale\nPrix accordé à votre étude : 3 360 CHF (remise de 30 %).\nCette remise est exceptionnelle et confidentielle : merci de ne pas la diffuser.' },
    attendu: 'orange', pourquoi: 'Le fournisseur demande la confidentialité sur son prix. Retirer le nom du commercial ne suffit pas.',
  },
  {
    id: 'planning', fichier: 'planning-absences-octobre.csv', format: 'Tableur', titre: 'Le planning des absences',
    but: 'Vous voulez savoir qui peut remplacer qui.',
    apercu: { type: 'texte', contenu: 'Prénom ; Du ; Au ; Motif\nLéa ; 06.10 ; 10.10 ; Vacances\nMarc ; 13.10 ; 24.10 ; Maladie\nSophie ; 14.10 ; 14.10 ; Formation\nNadia ; 20.10 ; 31.10 ; Accident (hors travail)' },
    attendu: 'rouge', pourquoi: 'La colonne « Motif » parle de maladie et d’accident : ce sont des données de santé. Une seule colonne suffit. Sans elle, le planning serait orange.',
  },
  {
    id: 'tableau', fichier: 'photo-tableau-blanc.png', format: 'Photo', titre: 'La photo du tableau blanc',
    but: 'Vous voulez que l’IA la mette au propre en liste de tâches.',
    apercu: { type: 'image', alt: 'Tableau blanc : point dossiers du lundi. Exemple contre Assurance Nord, opposition avant le 24.10. Beispiel, rapport allemand à traduire. Témoin, divorce, audience le 3.11, garde des enfants. Esquisse, expertise médicale reçue.' },
    attendu: 'rouge', pourquoi: 'Une photo aussi est un document : on y lit des noms de clients et leurs affaires. Tout cela est couvert par le secret professionnel.',
  },
  {
    id: 'note', fichier: 'note-vocale-associe.wav', format: 'Audio', titre: 'La note vocale d’un associé',
    but: 'Vous voulez la transcription par écrit.',
    apercu: { type: 'audio', transcription: 'Note pour le dossier Exemple. Jean Exemple, frontalier de Morteau, s’est fracturé le poignet gauche le 12 août 2026… L’assurance refuse l’indemnité journalière…' },
    attendu: 'rouge', pourquoi: 'Le dossier d’un client, avec une blessure : secret professionnel et donnée de santé. La transcription se fait sur l’ordinateur (exercice 01).',
  },
  {
    id: 'clients', fichier: 'liste-clients.csv', format: 'Tableur', titre: 'La liste des clients',
    but: 'Vous voulez dédoublonner les adresses.',
    apercu: { type: 'texte', contenu: 'Nom ; Prénom ; Localité ; Type de dossier\nExemple ; Jean ; Morteau ; Accident de travail\nTémoin ; Sophie ; Neuchâtel ; Divorce\nEsquisse ; Yves ; La Chaux-de-Fonds ; Responsabilité médicale' },
    attendu: 'rouge', pourquoi: 'Être client d’un avocat est déjà couvert par le secret professionnel. Et le type de dossier en dit beaucoup.',
  },
  {
    id: 'capture', fichier: 'capture-erreur-logiciel.png', format: 'Capture d’écran', titre: 'La capture d’un message d’erreur',
    but: 'Vous voulez savoir comment réparer l’erreur.',
    apercu: { type: 'image', alt: 'Capture du logiciel de facturation : un message d’erreur au centre, et derrière, la liste des factures avec les noms des clients et l’objet de leur dossier.' },
    attendu: 'rouge', pourquoi: 'Regardez derrière le message : des noms de clients et l’objet de leur dossier. Recadrez sur le seul message d’erreur, et la capture devient verte.',
  },
];
