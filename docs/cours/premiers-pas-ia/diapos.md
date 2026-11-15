# Premiers pas avec l’IA

Parcours modulable, sans horaire ni chronomètre.

## 1. Premiers pas avec l’IA

Du chat dans le navigateur à votre premier assistant.


<p class="signature">Le Labo · Clément Bastien<br>Débutants · première version · 15 novembre 2026</p>

Sources :

## 2. À la fin, vous saurez…



- Distinguer une application, un modèle et ses outils.
- Utiliser un chat et améliorer une demande.
- Configurer un assistant réutilisable et le tester.
- Reconnaître ce qui change quand une IA devient un agent.



Sources :
- [OpenAI · demandes](https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt)

## 3. Quatre noms à reconnaître




<table><caption>Applications et éditeurs, sans classement</caption><thead><tr><th scope="col">Application</th><th scope="col">Éditeur</th><th scope="col">Repère</th></tr></thead><tbody><tr><th scope="row">ChatGPT</th><td>OpenAI</td><td>GPT désigne une famille de modèles.</td></tr><tr><th scope="row">Gemini</th><td>Google</td><td>Le nom sert aussi pour les modèles.</td></tr><tr><th scope="row">Claude</th><td>Anthropic</td><td>Le nom sert aussi pour les modèles.</td></tr><tr><th scope="row">Grok</th><td>xAI</td><td>Accessible notamment sur grok.com.</td></tr></tbody></table>

Sources :
- [OpenAI · GPT](https://help.openai.com/en/articles/8554397-creating-and-editing-gpts)
- [Grok · application](https://x.ai/grok)

## 4. Il existe d’autres portes d’entrée



- Microsoft Copilot : une application et des fonctions intégrées à l’écosystème Microsoft.
- Mistral : des modèles et une application, Vibe, anciennement Le Chat.
- Les fonctions dépendent du compte, des réglages et des outils disponibles.

<p class="note">Ces exemples ne forment pas un classement. Noms et accès vérifiés le 15 novembre 2026 ; à revoir avant la séance.</p>

Sources :
- [Microsoft · Copilot](https://www.microsoft.com/en-us/copilot/solutions/individuals)
- [Mistral · application](https://mistral.ai/products/vibe/)

## 5. Application ≠ modèle ≠ outils




<ol class="flow"><li><strong>L’application</strong><span>L’interface : conversation, fichiers, réglages.</span></li><li><strong>Le modèle</strong><span>Le système entraîné qui produit une réponse.</span></li><li><strong>Les outils</strong><span>Recherche, calcul, lecture de fichiers… si activés.</span></li></ol><p class="note">Une même application peut proposer plusieurs modèles. Le modèle n’a pas automatiquement accès à votre ordinateur.</p>

Sources :
- [OpenAI · outils](https://developers.openai.com/api/docs/guides/tools)
- [OpenAI · consignes](https://developers.openai.com/api/docs/guides/prompt-engineering)

## 6. Gratuit ou payant : que vérifier ?



- Puis-je faire la tâche avec mon compte actuel ?
- Quels fichiers, outils et limites sont disponibles ?
- L’établissement autorise-t-il ce service et ce compte ?
- En cas de blocage : continuer avec un texte copié ou un outil déjà accessible.

<p class="note">Aucun abonnement ni clé API n’est nécessaire pour suivre le chemin de base de ce cours.</p>

Sources :
- [OpenAI · accès](https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq)

## 7. Trois façons de travailler




<ol class="flow"><li><strong>Chat</strong><span>Vous donnez une demande et poursuivez l’échange.</span></li><li><strong>Assistant configuré</strong><span>Vous réutilisez un rôle, des règles et des documents.</span></li><li><strong>Agent</strong><span>Il enchaîne des actions avec des outils pour atteindre un objectif.</span></li></ol><p class="note">Repères pédagogiques, pas catégories exclusives : un assistant peut avoir des outils, et un agent peut fonctionner dans un navigateur.</p>

Sources :
- [OpenAI · personnaliser](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions)
- [Anthropic · agents](https://www.anthropic.com/research/building-effective-agents)

## 8. Une conversation dans le navigateur

Vous gardez la main sur chaque étape.

- Ouvrez une nouvelle conversation dans un outil accessible.
- Écrivez votre demande, puis lisez et corrigez la réponse.
- Précisez ce qui manque et demandez une nouvelle version.

<p class="example">Exemple : « Proposez un atelier de découverte du numérique pour des adultes débutants. »</p>

Sources :
- [Grok · application](https://x.ai/grok)
- [Google · personnaliser](https://support.google.com/gemini/answer/18560919?hl=fr)

## 9. Quatre ingrédients pour démarrer




<ol class="ingredients"><li><strong>Objectif</strong> — Que faut-il obtenir ?</li><li><strong>Contexte</strong> — Pour qui, avec quelles informations ?</li><li><strong>Contraintes</strong> — Durée, budget, limites à respecter.</li><li><strong>Format</strong> — Tableau, message, étapes, longueur…</li></ol><p class="note">Pas de formule magique : une demande précise aide à évaluer la réponse.</p>

Sources :
- [OpenAI · consignes](https://developers.openai.com/api/docs/guides/prompt-engineering)

## 10. Du vague au vérifiable




<p class="example">« Organise un atelier IA. »</p><p class="example">« Propose un atelier de 90 minutes pour 12 adultes débutants. Six ordinateurs sont disponibles. Aucun achat. Présente un tableau avec les horaires, les activités et le matériel. Signale les informations qui manquent. »</p>

Sources :
- [OpenAI · demandes](https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt)

## 11. Essayez, puis améliorez



- Envoyez d’abord la demande vague dans une nouvelle conversation.
- Dans une autre conversation, envoyez la demande précise.
- Comparez trois points : public, durée et matériel.
- Notez une amélioration et une erreur encore présente.

<p class="note">Un outil suffit. La comparaison de deux marques reste facultative.</p>

Sources :
- [OpenAI · demandes](https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt)

## 12. Le contexte a des limites



- Un modèle ne mobilise pas forcément tous les détails d’un long document.
- Dans l’étude Lost in the Middle (2023), la position d’une information influençait les résultats des modèles étudiés.
- Une nouvelle conversation repart sans ce fil, mais pas forcément sans mémoire ou personnalisation.
- Redonnez les faits indispensables et vérifiez les réglages disponibles dans votre application.



Sources :
- [OpenAI · mémoire](https://help.openai.com/en/articles/8590148-memory-in-chatgpt)
- [Étude · contexte long](https://arxiv.org/abs/2307.03172)

## 13. Une réponse fluide peut être fausse



- Pour un fait : retrouvez la source et le passage qui le soutient.
- Pour un nombre : refaites le calcul.
- Pour une consigne : comparez avec le document fourni.
- Une incertitude doit rester visible : « à confirmer » est une réponse utile.



Sources :
- [OpenAI · fiabilité](https://help.openai.com/en/articles/8313428-does-chatgpt-tell-the-truth)

## 14. Pour les essais : du fictif



- Utilisez les exemples et fichiers fournis.
- N’envoyez ni mot de passe, ni dossier client, ni donnée personnelle réelle.
- Vérifiez ce que l’application reçoit avant de joindre un fichier.
- Un abonnement ne suffit pas à déterminer les conditions de traitement.

<p class="note">Pour approfondir : le cours « IA, données et responsabilité ».</p>

Sources :
- [CNIL · précautions](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative)

## 15. Un cadre que l’on réutilise

L’assistant configuré évite de répéter les mêmes consignes.

- Un rôle : ce qu’il doit aider à faire.
- Des règles : ce qu’il doit respecter ou signaler.
- Des références : les informations sur lesquelles s’appuyer.
- Des tests : les situations où il doit bien répondre.

<p class="note">Configurer ces consignes ne modifie pas les paramètres du modèle. La réutilisation éventuelle des échanges par le service dépend d’autres réglages.</p>

Sources :
- [Claude · projets](https://support.claude.com/en/articles/9517075-what-are-projects)
- [OpenAI · personnaliser](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions)

## 16. Votre premier assistant : Atelier ClairLieu

ClairLieu est une association fictive.

- Mission : préparer des ateliers numériques pour débutants.
- Public : 12 adultes ; matériel : six ordinateurs.
- Règles : aucun achat ; horaires et capacité à respecter.
- Toute information absente doit être signalée, pas inventée.



Sources :
- [Brief fictif · ClairLieu](/diapos/premiers-pas-ia/exercices/01-mini-brief.md)

## 17. Des consignes que vous pouvez copier




<p class="prompt">Vous aidez l’association fictive ClairLieu à préparer des ateliers numériques pour débutants. Utilisez uniquement le brief fourni. Distinguez les faits, vos propositions et les points à confirmer. Si une information indispensable manque, posez une question. N’inventez ni contact, ni tarif, ni disponibilité. Ne réservez rien et n’envoyez aucun message.</p>

Sources :
- [OpenAI · consignes](https://developers.openai.com/api/docs/guides/prompt-engineering)

## 18. Définir la forme du résultat




<p class="prompt">Répondez en français simple. Pour un programme, utilisez un tableau : horaire, activité, matériel. Pour un budget, indiquez quantité × prix unitaire et total. Terminez par les vérifications à effectuer. Vérifiez les contraintes du brief avant de proposer une version finale.</p><p class="note">Les deux blocs de consignes sont téléchargeables dans le dossier d’exercice.</p>

Sources :
- [OpenAI · consignes](https://developers.openai.com/api/docs/guides/prompt-engineering)

## 19. Où garder ces consignes ?



- Fichier texte : gardez vos consignes et fournissez-les dans le chat.
- ChatGPT : les instructions personnalisées peuvent s’appliquer à tous vos chats ; gardez-les adaptées à cet usage.
- Claude : instructions de projet ; Gemini : Gems ou compétences, selon le compte et le déploiement.
- Ces espaces n’offrent pas tous les mêmes fonctions. Vérifiez ce qui est disponible sur votre compte.

<p class="note">Les noms et les accès évoluent. Les liens en haut permettent de vérifier la documentation de chaque produit.</p>

Sources :
- [OpenAI · personnaliser](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions)
- [Google · personnaliser](https://support.google.com/gemini/answer/18560919?hl=fr)

## 20. Configurez votre assistant



- Ouvrez le dossier « Exercices » et récupérez les consignes et le mini-brief.
- Enregistrez votre version des consignes dans un fichier.
- Collez les consignes et le mini-brief dans un nouveau chat, ou dans un espace configuré autorisé.
- Demandez un programme de 90 minutes et conservez la réponse.

<p class="note">N’activez aucun connecteur, aucune action externe et aucun accès à vos comptes.</p>

Sources :
- [Claude · projets](https://support.claude.com/en/articles/9517075-what-are-projects)
- [OpenAI · personnaliser](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions)

## 21. Trois tests avant de lui faire confiance



- Test normal : proposer un programme respectant les 90 minutes et les six ordinateurs.
- Information absente : demander le nom et le téléphone du responsable ; il doit signaler leur absence.
- Demande incompatible : prévoir un ordinateur par personne sans achat ; il doit relever le conflit et proposer une adaptation.

<p class="note">Conservez un exemple de défaut et la correction de vos consignes.</p>

Sources :
- [OpenAI · évaluer](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

## 22. Un assistant utile se teste




<ul class="checks"><li>Le programme couvre exactement la durée demandée.</li><li>Le matériel et les effectifs sont respectés.</li><li>Les informations absentes ne sont pas inventées.</li><li>Les propositions sont distinguées des faits.</li></ul><p class="note">Si un test échoue : précisez les consignes et recommencez dans un nouveau chat.</p>

Sources :
- [OpenAI · évaluer](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

## 23. Quand l’IA commence à agir

Un agent peut utiliser un outil, observer le résultat et décider de la suite.


<ol class="flow"><li><strong>Objectif</strong><span>Un résultat attendu et des limites.</span></li><li><strong>Action</strong><span>Un outil autorisé est utilisé.</span></li><li><strong>Observation</strong><span>Le résultat est contrôlé avant de continuer ou de s’arrêter.</span></li></ol>

Sources :
- [Anthropic · agents](https://www.anthropic.com/research/building-effective-agents)

## 24. Plus d’actions, plus de décisions à cadrer



- Quels fichiers peut-il lire ou modifier ?
- Quelles actions exigent votre confirmation ?
- Comment vérifiez-vous le résultat ?
- Quand doit-il s’arrêter ?

<p class="note">Dans ce premier cours : configurer et tester un assistant. Les agents seront approfondis dans « Le Harnais ».</p>

Sources :
- [Anthropic · agents](https://www.anthropic.com/research/building-effective-agents)

## 25. Ensuite : les types d’IA

Le chat n’est qu’une porte d’entrée.

- Découvrez ce que les modèles reçoivent et produisent : texte, image, voix…
- Réutilisez le cours « Les types d’IA ».
- Sur Hugging Face : choisissez trois missions, dont une générative.
- Pour chaque mission : deux essais, un seul changement, une limite observée.

<p><a href="https://www.labonumerique.ch/comprendre-ia/types-ia/">Ouvrir le cours existant</a></p>

Sources :
- [Hugging Face · Spaces](https://huggingface.co/docs/hub/spaces-overview)

## 26. Préparez un vrai dossier… pour un projet fictif

ClairLieu organise « Déclic numérique », un atelier pour 18 adultes débutants.

- Vous disposez d’un brief, d’un inventaire et d’une liste de prix fictifs.
- Configurez votre assistant, puis produisez un programme et un budget.
- Créez les supports et vérifiez toutes les contraintes.
- Échangez votre dossier pour un contrôle croisé.

<p><a href="exercices/index.html">Ouvrir le dossier complet</a></p>

Sources :
- [Brief fictif · ClairLieu](/diapos/premiers-pas-ia/exercices/04-brief-evenement.md)

## 27. Construire, tester, corriger : à votre rythme




<ol class="agenda"><li><strong>Comprendre</strong> — Lire le brief et relever les contraintes.</li><li><strong>Configurer</strong> — Préparer l’assistant et tester ses limites.</li><li><strong>Produire</strong> — Programme, budget et supports.</li><li><strong>Vérifier</strong> — Recalculer et faire relire le dossier.</li><li><strong>Corriger</strong> — Refaire les tests après chaque amélioration.</li><li><strong>Expliquer</strong> — Présenter les choix et les points à confirmer.</li></ol>

Sources :
- [Brief fictif · ClairLieu](/diapos/premiers-pas-ia/exercices/04-brief-evenement.md)

## 28. Ce que vous rendrez



- Les consignes de votre assistant et trois tests commentés.
- Le programme, le budget et les supports demandés.
- Un journal de trois améliorations apportées aux réponses.
- Une liste des faits vérifiés et des points restant à confirmer.

<p class="note">La qualité se mesure au respect du brief et aux vérifications, pas à la longueur des réponses.</p>

Sources :
- [Brief fictif · ClairLieu](/diapos/premiers-pas-ia/exercices/04-brief-evenement.md)
- [OpenAI · évaluer](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

## 29. Retrouver les sources et le lexique




<div class="refs" data-comp="refs"></div>

Sources :
- [OpenAI · GPT](https://help.openai.com/en/articles/8554397-creating-and-editing-gpts)
- [Claude · projets](https://support.claude.com/en/articles/9517075-what-are-projects)

## 30. Les mots du cours

Choisissez une notion pour retrouver sa définition.


<div class="lexique" data-comp="lexique"></div>

Sources :
- [Hugging Face · Spaces](https://huggingface.co/docs/hub/spaces-overview)
- [Grok · application](https://x.ai/grok)
