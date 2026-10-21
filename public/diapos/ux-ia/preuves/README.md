# Rapport utilisé dans le cours UX × IA

Les fichiers `traverse-lighthouse.png`, `.html` et `.json` sont les sorties réelles d’une même exécution de Lighthouse sur la page d’entrée d’une version locale de l’exercice Traverse.

- Date UTC : 21 octobre 2026, 10:33:12.
- Version de Lighthouse : 13.5.0.
- URL au moment de l’exécution : `http://127.0.0.1:4192/`. Ce port est une métadonnée historique, pas un lien à ouvrir chez les apprenants.
- Profil : mobile simulé, écran 412 × 823, ralentissement CPU ×4, limitation réseau simulée. Détails complets dans `configSettings` du JSON.
- Scores : performance 73, accessibilité 76, bonnes pratiques 96, SEO 91.
- FCP : 1064,047 ms ; LCP : 86029,094 ms ; TBT : 170 ms ; CLS : 0.

Le LCP particulièrement élevé est bien la valeur du rapport archivé. Il ne prédit pas la durée de toutes les visites. Ces fichiers ne décrivent ni l’état actuel du site corrigé ni l’ensemble du tunnel. Consulter l’archive ne relance pas un audit.

La capture et le rapport permettent d’examiner les mesures et leurs limites. Les autres cas interactifs de cette partie du cours sont explicitement pédagogiques. Les valeurs CSS de la première scène sont lues directement dans son DOM ; aucun modèle d’IA n’est connecté aux scènes.

Pour remplacer cette archive : conserver ensemble une nouvelle capture, son HTML et son JSON, puis mettre à jour les chiffres, la date et les conditions dans `atelier-ia.js` et les notes du diaporama. Ne pas modifier seulement le score affiché.

Documentation : https://developer.chrome.com/docs/lighthouse/overview
