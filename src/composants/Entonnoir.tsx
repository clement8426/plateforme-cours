'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { telecharger } from '@/contenu/parcours/exports';
import { kitMarkdown, NIVEAUX_KIT } from '@/contenu/parcours/kit';
import { calculerPlan, depuisFragment, famille, GRAVITES, lireFiche, outilsDe, preremplir, TAXONOMIE, versFragment, type Angle, type Choix, type Reponse } from '@/contenu/parcours/moteur';

const ETAPES = ['Intention', 'Type de projet', 'Contexte', 'Ton plan'];
const REPONSES: { id: Reponse; nom: string }[] = [{ id: 'oui', nom: 'Oui' }, { id: 'non', nom: 'Non' }, { id: 'jnsp', nom: 'Je ne sais pas' }];
const depart = (): Choix => ({ contexte: {}, signaux: [] });

function CarteAngle({ a }: { a: Angle }) {
  const outils = outilsDe(a.id);
  return (
    <li className="plan-carte">
      <p className="plan-tags"><span className={`plan-tag est-${a.severity}`}>{GRAVITES[a.severity].nom}</span><span className="plan-tag">{famille(a.family)}</span></p>
      <h4>{a.title}</h4>
      <p>{a.question}</p>
      <p>{a.action}</p>
      {outils.length > 0 && <p>Outils : {outils.slice(0, 3).map((o, i) => <span key={o.id}>{i > 0 && ', '}<Link prefetch={false} href={`/demarrer/catalogue/${o.id}/`}>{o.name}</Link></span>)}</p>}
      <p><Link prefetch={false} href={`/bonnes-pratiques/angles-morts/${a.id}/`}>Lire la fiche<span className="visuellement-cache"> : {a.title}</span></Link></p>
    </li>
  );
}

export default function Entonnoir() {
  const [etape, setEtape] = useState(0);
  const [c, setC] = useState<Choix>(depart);
  const [niveau, setNiveau] = useState('essential');
  const [statut, setStatut] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [compris, setCompris] = useState(false);
  const titre = useRef<HTMLHeadingElement>(null);
  const premierRendu = useRef(true);

  // Un lien partagé ouvre directement le plan.
  useEffect(() => {
    if (!window.location.hash) return;
    const lu = depuisFragment(window.location.hash);
    if (lu.intention && lu.type) { setC(lu); setEtape(3); }
  }, []);

  useEffect(() => {
    if (premierRendu.current) { premierRendu.current = false; return; }
    titre.current?.focus();
  }, [etape]);

  const plan = useMemo(() => calculerPlan(c), [c]);
  const lien = () => `${window.location.origin}${window.location.pathname}#${versFragment(c)}`;
  const choisir = (partiel: Partial<Choix>) => { setC((p) => ({ ...p, ...partiel })); setEtape((e) => e + 1); };
  const sensibles = c.contexte.donnees === 'oui' || c.contexte.donnees === 'jnsp';
  const bloquants = plan.actifs.filter((a) => a.severity === 'bloquant');
  const prioritaires = plan.actifs.slice(0, 5);
  const reste = plan.actifs.slice(5);

  const importer = async (e: ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    e.target.value = '';
    if (!fichier) return;
    const lu = lireFiche(await fichier.text());
    if (!lu) { setStatut('Ce fichier ne vient pas d’une fiche du Labo. Tu peux répondre aux questions à la main.'); return; }
    setC((p) => preremplir(p, lu.fiche, lu.reponses));
    const projet = lu.reponses['nom-projet'] ?? lu.reponses['identite.projet'];
    if (typeof projet === 'string' && projet.trim()) setNotes((n) => [...new Set([...n, `Project name: ${projet.trim()}`])]);
    setStatut('Fiche chargée dans cette page. Rien n’a été envoyé.');
  };

  const partager = async () => {
    try { await navigator.clipboard.writeText(lien()); setStatut('Lien copié.'); }
    catch { setStatut(`Copie impossible. Voici le lien : ${lien()}`); }
  };
  const kit = () => { telecharger(kitMarkdown(c, plan, niveau, notes), 'kit-agent-le-labo.md', 'text/markdown;charset=utf-8'); setStatut('Ton kit est téléchargé.'); };
  const pdf = async () => {
    const { pageEnPdf } = await import('@/contenu/parcours/pdf');
    telecharger(pageEnPdf({
      titre: 'Mon plan : les angles morts de mon projet',
      lignes: [
        ...plan.actifs.flatMap((a) => [{ type: 'gras' as const, texte: `${GRAVITES[a.severity].nom} : ${a.title}` }, { type: 'texte' as const, texte: `${a.question} ${a.action}` }]),
        ...(plan.aVerifier.length ? [{ type: 'titre' as const, texte: 'À vérifier aussi' }, ...plan.aVerifier.map((a) => ({ type: 'texte' as const, texte: `${a.title} : ${a.when.verifier}` }))] : []),
      ],
    }), 'plan-le-labo.pdf', 'application/pdf');
    setStatut('Ton plan est téléchargé.');
  };

  return (
    <div className="entonnoir">
      <ol className="etapes-entonnoir" aria-label="Étapes">
        {ETAPES.map((e, i) => <li key={e} className={i < etape ? 'est-passe' : undefined} aria-current={i === etape ? 'step' : undefined}>{e}</li>)}
      </ol>

      {etape === 0 && <>
        <h2 ref={titre} tabIndex={-1} className="titre-section">Où en es-tu ?</h2>
        <ul className="cartes-choix">
          {TAXONOMIE.intentions.map((i) => <li key={i.id}><button type="button" className="carte-choix" aria-pressed={c.intention === i.id} onClick={() => choisir({ intention: i.id })}><strong>{i.label_fr}</strong><span>{i.exemple}</span></button></li>)}
          <li><button type="button" className="carte-choix" aria-pressed={c.intention === 'jnsp'} onClick={() => choisir({ intention: 'jnsp' })}><strong>Je ne sais pas</strong><span>On te montre les oublis les plus fréquents.</span></button></li>
        </ul>
      </>}

      {etape === 1 && <>
        <h2 ref={titre} tabIndex={-1} className="titre-section">Qu’est-ce que tu construis ?</h2>
        <ul className="cartes-choix">
          {TAXONOMIE.types.map((t) => <li key={t.id}><button type="button" className="carte-choix" aria-pressed={c.type === t.id} onClick={() => choisir({ type: t.id })}><strong>{t.label_fr}</strong><span>{t.exemple}</span></button></li>)}
          <li><button type="button" className="carte-choix" aria-pressed={c.type === 'jnsp'} onClick={() => choisir({ type: 'jnsp' })}><strong>Je ne sais pas</strong><span>On garde tous les angles morts liés au produit.</span></button></li>
        </ul>
      </>}

      {etape === 2 && <>
        <h2 ref={titre} tabIndex={-1} className="titre-section">Ton contexte</h2>
        <p>« Je ne sais pas » compte comme un oui : mieux vaut vérifier.</p>
        <section className="import-fiche" aria-labelledby="import-titre">
          <div>
            <h3 id="import-titre">Facultatif : gagne du temps avec tes fiches</h3>
            <p>Si tu as rempli la <Link href="/demarrer/technique/">fiche 2</Link> ou la <Link href="/demarrer/idee/">fiche 1</Link> sur ce site, reprends le fichier .md téléchargé à la fin. Les réponses déjà données seront cochées ici. Le fichier reste sur ton ordinateur. Sinon, réponds simplement aux questions.</p>
          </div>
          <div>
            <input id="fiche-import" type="file" accept=".md,text/markdown" onChange={importer} />
            <label htmlFor="fiche-import" className="bouton-secondaire">Choisir mon fichier .md</label>
          </div>
        </section>
        <div className="contexte-grille">
        {TAXONOMIE.contexte.map((q) => (
          <fieldset className="contexte-question" key={q.id}>
            <legend>{q.label_fr}</legend>
            <p className="champ-aide">{q.aide}</p>
            <div className="contexte-reponses">
              {REPONSES.map((r) => <label className="option" key={r.id}><input type="radio" name={q.id} checked={c.contexte[q.id] === r.id} onChange={() => setC((p) => ({ ...p, contexte: { ...p.contexte, [q.id]: r.id } }))} /><span>{r.nom}</span></label>)}
            </div>
          </fieldset>
        ))}
        <fieldset className="contexte-question">
          <legend>As-tu déjà choisi un outil ?</legend>
          <div className="contexte-reponses">
            {[...TAXONOMIE.outils, { id: 'jnsp', label_fr: 'Je ne sais pas' }].map((o) => <label className="option" key={o.id}><input type="radio" name="outil" checked={c.outil === o.id} onChange={() => setC((p) => ({ ...p, outil: o.id }))} /><span>{o.label_fr}</span></label>)}
          </div>
        </fieldset>
        </div>
        <div className="actions"><button type="button" className="bouton" onClick={() => setEtape(3)}>Voir mon plan</button></div>
      </>}

      {etape === 3 && <>
        <h2 ref={titre} tabIndex={-1} className="titre-section">Ton plan</h2>
        <p>{plan.actifs.length} angles morts à regarder, dont {bloquants.length} bloquant{bloquants.length > 1 ? 's' : ''}.</p>
        <div className="plan-grille">
        <div className="plan-colonne">
        <section className="bloc-plan" aria-labelledby="plan-priorites">
          <h3 id="plan-priorites">Par quoi commencer</h3>
          <ul className="plan-liste">{prioritaires.map((a) => <CarteAngle key={a.id} a={a} />)}</ul>
        </section>
        {reste.length > 0 && <details className="plan-plus"><summary>Voir les {reste.length} autres angles morts</summary><ul className="plan-liste">{reste.map((a) => <CarteAngle key={a.id} a={a} />)}</ul></details>}
        {plan.aVerifier.length > 0 && <details className="plan-plus"><summary>À vérifier aussi ({plan.aVerifier.length})</summary><ul className="plan-liste">{plan.aVerifier.map((a) => <li key={a.id} className="plan-carte"><h4>{a.title}</h4><p>{a.when.verifier}</p><p><Link prefetch={false} href={`/bonnes-pratiques/angles-morts/${a.id}/`}>Lire la fiche<span className="visuellement-cache"> : {a.title}</span></Link></p></li>)}</ul></details>}
        </div>

        <section className="kit" aria-labelledby="titre-kit">
          <h3 id="titre-kit">Ton kit pour l’agent IA</h3>
          <div className="champ">
            <label htmlFor="niveau-kit">Comment l’agent doit-il travailler ?</label>
            <select id="niveau-kit" value={niveau} onChange={(e) => setNiveau(e.target.value)}>{NIVEAUX_KIT.map((n) => <option key={n.id} value={n.id}>{n.nom}</option>)}</select>
          </div>
          {sensibles && <div className="fiche-alerte">
            <p>Ce que tu envoies à une IA non suisse ou non européenne compte plus que l’outil choisi. Travaille avec des données factices, ou avec un agent open source et un modèle européen ou suisse. C’est ton choix : rien n’est interdit.</p>
            <label className="option"><input type="checkbox" checked={compris} onChange={(e) => setCompris(e.target.checked)} /><span>J’ai compris</span></label>
          </div>}
          <div className="actions">
            <button type="button" className="bouton" disabled={sensibles && !compris} onClick={kit}>Télécharger le kit</button>
            <button type="button" className="bouton-secondaire" onClick={() => void pdf()}>Télécharger le plan en PDF</button>
            <button type="button" className="bouton-secondaire" onClick={() => void partager()}>Copier le lien du plan</button>
          </div>
        </section>
        </div>
      </>}

      <p role="status" aria-live="polite" className="fiche-statut">{statut}</p>
      {etape > 0 && <div className="actions"><button type="button" className="bouton-secondaire" onClick={() => setEtape((e) => e - 1)}>Retour</button></div>}
    </div>
  );
}
