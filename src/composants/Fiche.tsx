'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { IDEES_FONCTIONS, LIGNES_DEPART, PRIORITES, QUESTION_CONTROLE, SEUIL_MVP, trouverFiche, type Champ } from '@/contenu/parcours/fiches';
import { fonctions, nomFichier, telecharger, versMarkdown, type LigneFonction, type Reponses } from '@/contenu/parcours/exports';

const vide = (): LigneFonction => ({ fonction: '', pourquoi: '', mvp: false, priorite: '' });
const AVERTISSEMENT = 'Tes réponses ne sont enregistrées nulle part. Si tu quittes cette page sans télécharger, elles seront perdues.';

// Une fiche éphémère : les réponses vivent seulement dans cette page, jusqu'au téléchargement.
// Elle reçoit le slug, et non la fiche : Next.js ne transmet que des données simples aux composants du navigateur.
export default function Fiche({ slug, suite }: { slug: string; suite?: { href: string; nom: string } }) {
  const fiche = trouverFiche(slug)!;
  const [r, setR] = useState<Reponses>(() => ({ ...(fiche.sections.some((s) => s.champs.some((c) => c.type === 'fonctionnalites')) ? { fonctionnalites: Array.from({ length: LIGNES_DEPART }, vide) } : {}) }));
  const [modifie, setModifie] = useState(false);
  const [fini, setFini] = useState(false);
  const [statut, setStatut] = useState('');
  const [enCours, setEnCours] = useState(false);
  const modifieRef = useRef(false);
  modifieRef.current = modifie;

  const changer = (id: string, valeur: Reponses[string]) => { setR((p) => ({ ...p, [id]: valeur })); setModifie(true); setFini(false); };

  useEffect(() => { setR((p) => ({ ...p, 'identite.date': new Date().toLocaleDateString('sv-SE') })); }, []);

  // Alerte avant de quitter : fermeture de l'onglet et clic sur un lien du site.
  useEffect(() => {
    const avant = (e: BeforeUnloadEvent) => { if (modifieRef.current) e.preventDefault(); };
    const clic = (e: MouseEvent) => {
      const lien = (e.target as HTMLElement).closest?.('a[href]');
      if (lien && modifieRef.current && !window.confirm(AVERTISSEMENT)) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener('beforeunload', avant);
    document.addEventListener('click', clic, true);
    return () => { window.removeEventListener('beforeunload', avant); document.removeEventListener('click', clic, true); };
  }, []);

  const pdf = async () => {
    setEnCours(true);
    try {
      const { ficheEnPdf } = await import('@/contenu/parcours/pdf');
      telecharger(ficheEnPdf(fiche, r), nomFichier(fiche, r, 'pdf'), 'application/pdf');
      setModifie(false); setFini(true);
      setStatut('Ton PDF est téléchargé.');
    } catch {
      setStatut('Le PDF n’a pas pu être créé. Télécharge la version Markdown pour garder tes réponses.');
    } finally { setEnCours(false); }
  };
  const markdown = () => {
    telecharger(versMarkdown(fiche, r), nomFichier(fiche, r, 'md'), 'text/markdown;charset=utf-8');
    setModifie(false); setFini(true);
    setStatut('Ton fichier Markdown est téléchargé.');
  };

  return (
    <form className="fiche" onSubmit={(e) => { e.preventDefault(); void pdf(); }}>
      <p className="fiche-regle">{fiche.intro}</p>
      <p className="fiche-ephemere"><strong>Rien n’est enregistré.</strong> Tes réponses restent dans cette page. Télécharge ton fichier à la fin, sinon elles seront perdues.</p>

      <div className="fiche-identite">
        {fiche.identite.projet && <Texte label={fiche.identite.projet} valeur={r['identite.projet']} changer={(v) => changer('identite.projet', v)} />}
        <Texte label={fiche.identite.nom} valeur={r['identite.nom']} changer={(v) => changer('identite.nom', v)} autocomplete="name" />
        <Texte label="Date" type="date" valeur={r['identite.date']} changer={(v) => changer('identite.date', v)} />
      </div>

      {fiche.sections.map((s) => (
        <section className="fiche-section" key={s.titre}>
          <h2>{s.titre}</h2>
          {s.intro && <p>{s.intro}</p>}
          {s.champs.map((c) => <ChampFiche key={c.id} champ={c} r={r} changer={changer} setStatut={setStatut} />)}
        </section>
      ))}

      <section className="fiche-fin" aria-labelledby="fiche-fin-titre">
        <h2 id="fiche-fin-titre">Terminer</h2>
        <p>Le fichier part directement dans tes téléchargements. Garde-le : le site n’en conserve aucune copie.</p>
        <div className="actions">
          <button type="submit" className="bouton" disabled={enCours}>{enCours ? 'Création du PDF…' : 'Terminer et télécharger en PDF'}</button>
          <button type="button" className="bouton-secondaire" onClick={markdown}>Télécharger en Markdown</button>
        </div>
        {fini && suite && <p><Link className="lien-fleche" href={suite.href}>Continuer : {suite.nom}</Link></p>}
      </section>
      <p className="visuellement-cache" role="status" aria-live="polite">{statut}</p>
      {statut && <p className="fiche-statut">{statut}</p>}
    </form>
  );
}

function Texte({ label, valeur, changer, type = 'text', autocomplete = 'off', aide }: { label: string; valeur: Reponses[string] | undefined; changer: (v: string) => void; type?: string; autocomplete?: string; aide?: string }) {
  const id = useId();
  return (
    <div className="champ">
      <label htmlFor={id}>{label}</label>
      {aide && <p className="champ-aide" id={`${id}-aide`}>{aide}</p>}
      <input id={id} type={type} autoComplete={autocomplete} aria-describedby={aide ? `${id}-aide` : undefined} value={typeof valeur === 'string' ? valeur : ''} onChange={(e) => changer(e.target.value)} />
    </div>
  );
}

function Zone({ label, aide, lignes, max, valeur, changer }: { label: string; aide?: string; lignes: number; max?: number; valeur: Reponses[string] | undefined; changer: (v: string) => void }) {
  const id = useId();
  const texte = typeof valeur === 'string' ? valeur : '';
  const compte = texte ? texte.split('\n').length : 0;
  const decrit = [aide && `${id}-aide`, max && `${id}-compte`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="champ">
      <label htmlFor={id}>{label}</label>
      {aide && <p className="champ-aide" id={`${id}-aide`}>{aide}</p>}
      <textarea id={id} rows={Math.max(lignes, 2)} aria-describedby={decrit} value={texte} onChange={(e) => changer(max ? e.target.value.split('\n').slice(0, max).join('\n') : e.target.value)} />
      {max && <p className="champ-aide" id={`${id}-compte`}>{compte} ligne{compte > 1 ? 's' : ''} sur {max}</p>}
    </div>
  );
}

function ChampFiche({ champ, r, changer, setStatut }: { champ: Champ; r: Reponses; changer: (id: string, v: Reponses[string]) => void; setStatut: (s: string) => void }) {
  const nom = useId();
  switch (champ.type) {
    case 'texte': return <p className="champ-texte">{champ.texte}</p>;
    case 'ligne': return <Texte label={champ.label} aide={champ.aide} valeur={r[champ.id]} changer={(v) => changer(champ.id, v)} />;
    case 'zone': return <Zone label={champ.label} aide={champ.aide} lignes={champ.lignes} max={champ.max} valeur={r[champ.id]} changer={(v) => changer(champ.id, v)} />;
    case 'mots': return (
      <fieldset className="champ-groupe">
        <legend>{champ.label}</legend>
        <div className="champ-mots">
          {Array.from({ length: champ.nombre }, (_, i) => <Texte key={i} label={`Mot ${i + 1}`} valeur={r[`${champ.id}.${i}`]} changer={(v) => changer(`${champ.id}.${i}`, v)} />)}
        </div>
      </fieldset>
    );
    case 'choix': {
      const choisis = Array.isArray(r[champ.id]) ? r[champ.id] as string[] : [];
      const basculer = (o: string, coche: boolean) => changer(champ.id, champ.multiple ? (coche ? [...choisis, o] : choisis.filter((x) => x !== o)) : [o]);
      return (
        <fieldset className="champ-groupe">
          <legend>{champ.label}</legend>
          <div className="champ-options">
            {champ.options.map((o) => (
              <label className="option" key={o}>
                <input type={champ.multiple ? 'checkbox' : 'radio'} name={nom} checked={choisis.includes(o)} onChange={(e) => basculer(o, e.target.checked)} />
                <span>{o}</span>
              </label>
            ))}
          </div>
          {champ.autre && choisis.includes(champ.autre) && <Texte label="Précise :" valeur={r[`${champ.id}.autre`]} changer={(v) => changer(`${champ.id}.autre`, v)} />}
        </fieldset>
      );
    }
    case 'grille': return (
      <div className="champ-grille">
        <p className="champ-texte">{champ.label}</p>
        {champ.notions.map((n, i) => (
          <fieldset className="grille-ligne" key={n}>
            <legend>{n}</legend>
            <div>
              {[1, 2, 3, 4, 5].map((v) => (
                <label className="option option-niveau" key={v}>
                  <input type="radio" name={`${nom}-${i}`} checked={r[`${champ.id}.${i}`] === String(v)} onChange={() => changer(`${champ.id}.${i}`, String(v))} />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    );
    case 'tableau': return (
      <div className="champ-lignes">
        {Array.from({ length: champ.lignes }, (_, l) => (
          <fieldset className="champ-groupe" key={l}>
            <legend>Solution {l + 1}</legend>
            <div className="champ-mots">
              {champ.colonnes.map((c, i) => <Texte key={c} label={c} valeur={r[`${champ.id}.${l}.${i}`]} changer={(v) => changer(`${champ.id}.${l}.${i}`, v)} />)}
            </div>
          </fieldset>
        ))}
      </div>
    );
    case 'fonctionnalites': return <Fonctionnalites r={r} changer={(v) => changer(champ.id, v)} setStatut={setStatut} />;
  }
}

function Fonctionnalites({ r, changer, setStatut }: { r: Reponses; changer: (v: LigneFonction[]) => void; setStatut: (s: string) => void }) {
  const lignes = useMemo(() => fonctions(r), [r]);
  const nbMvp = lignes.filter((l) => l.mvp).length;
  const maj = (i: number, partiel: Partial<LigneFonction>) => changer(lignes.map((l, n) => (n === i ? { ...l, ...partiel } : l)));
  const proposer = (idee: string) => {
    const libre = lignes.findIndex((l) => !l.fonction.trim());
    changer(libre === -1 ? [...lignes, { ...vide(), fonction: idee }] : lignes.map((l, n) => (n === libre ? { ...l, fonction: idee } : l)));
    setStatut(`« ${idee} » ajouté à la liste.`);
  };
  return (
    <div className="fonctions">
      <ol>
        {lignes.map((l, i) => (
          <li key={i} className="fonction">
            <span className="fonction-num" aria-hidden="true">{i + 1}</span>
            <div className="fonction-champs">
              <Texte label={`Fonctionnalité ${i + 1}`} valeur={l.fonction} changer={(v) => maj(i, { fonction: v })} />
              <Texte label="Pourquoi l’utilisateur en a besoin" valeur={l.pourquoi} changer={(v) => maj(i, { pourquoi: v })} />
              <label className="option fonction-mvp"><input type="checkbox" checked={l.mvp} onChange={(e) => maj(i, { mvp: e.target.checked })} /><span>MVP<span className="visuellement-cache"> pour la fonctionnalité {i + 1}</span></span></label>
              <Priorite numero={i + 1} valeur={l.priorite} changer={(v) => maj(i, { priorite: v })} />
            </div>
            <button type="button" className="bouton-secondaire fonction-suppr" onClick={() => { changer(lignes.filter((_, n) => n !== i)); setStatut(`Ligne ${i + 1} supprimée.`); }}>Supprimer<span className="visuellement-cache"> la ligne {i + 1}</span></button>
          </li>
        ))}
      </ol>
      <button type="button" className="bouton-secondaire" onClick={() => { changer([...lignes, vide()]); setStatut('Ligne ajoutée.'); }}>Ajouter une ligne</button>
      <div aria-live="polite">{nbMvp > SEUIL_MVP && <p className="fiche-alerte">{nbMvp} lignes en MVP : {QUESTION_CONTROLE}</p>}</div>
      <div className="idees">
        <p className="champ-aide">Idées de fonctionnalités courantes (pour t’aider, pas obligatoire) :</p>
        <ul>{IDEES_FONCTIONS.map((idee) => <li key={idee}><button type="button" className="puce" onClick={() => proposer(idee)}>{idee}</button></li>)}</ul>
      </div>
    </div>
  );
}

function Priorite({ numero, valeur, changer }: { numero: number; valeur: string; changer: (v: string) => void }) {
  const id = useId();
  return (
    <div className="champ">
      <label htmlFor={id}>Priorité<span className="visuellement-cache"> de la fonctionnalité {numero}</span></label>
      <select id={id} value={valeur} onChange={(e) => changer(e.target.value)}>
        <option value="">À choisir</option>
        {PRIORITES.map((p) => <option key={p}>{p}</option>)}
      </select>
    </div>
  );
}
